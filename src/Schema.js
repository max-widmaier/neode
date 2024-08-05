function UniqueConstraintCypher(label, property, mode = 'CREATE') {
    if (mode === 'DROP') {
        return `DROP CONSTRAINT unique_${label}_${property}`;
    }
    return `${mode} CONSTRAINT unique_${label}_${property} IF NOT EXISTS FOR (model:${label}) REQUIRE model.${property} IS UNIQUE`;
}

function ExistsConstraintCypher(label, property, mode = 'CREATE') {
    if (mode === 'DROP') {
        return `DROP CONSTRAINT exists_${label}_${property}`;
    }
    return `CREATE CONSTRAINT exists_${label}_${property} IF NOT EXISTS FOR (model:${label}) REQUIRE model.${property} IS NOT NULL`;
}

function IndexCypher(label, property, mode = 'CREATE') {
    if (mode === 'DROP') {
        return `DROP INDEX idx_${label}_${property}`;
    }
    return `CREATE INDEX idx_${label}_${property} IF NOT EXISTS FOR (n:${label}) ON (n.${property})`;
}

function FullTextIndexCypher(label, props, forLabel, mode = 'CREATE', options = {}) {
    if (mode === 'DROP') {
        return `DROP INDEX ${label}`;
    }
    let optionsString = '';

    if (options.indexConfig) {
        optionsString = `\nOPTIONS {
    indexConfig: {
        ${options.indexConfig['fulltext.analyzer'] ? '`fulltext.analyzer`: \'' + options.indexConfig['fulltext.analyzer'] + '\'' + (options.indexConfig['fulltext.eventually_consistent'] ? ',' : '') : ''}
        ${options.indexConfig['fulltext.eventually_consistent'] ? '`fulltext.eventually_consistent`: ' + options.indexConfig['fulltext.eventually_consistent'] : ''}
    }       
}`;
    }

    return `CREATE FULLTEXT INDEX idx_${label}_fulltext IF NOT EXISTS FOR ${forLabel} ON EACH [${props.map(p => `n.${p}`).join(', ')}]${optionsString}`;
}

function VectorIndexCypher(label, property, mode = 'CREATE', options = {}) {
    if (options === true) {
        options = {
            dimensions: 1536,
            similarity_function: 'cosine'
        };
    }
    let name = options.name || `idx_${label}_${property}_vector`;
    if (mode === 'DROP') {
        return `DROP INDEX ${name}`;
    }
    return `CREATE VECTOR INDEX ${name} IF NOT EXISTS FOR (n:${label}) ON (n.${property}) 
    OPTIONS {indexConfig: {
        \`vector.dimensions\`: ${options.dimensions || 1536},
        \`vector.similarity_function\`: '${options.similarity_function || 'cosine'}'
    }
}`;
}

function runAsync(session, queries, resolve, reject) {
    const next = queries.pop();

    return session.run(next)
        .then(() => {
            // If there is another query, let's run it
            if (queries.length) {
                return runAsync(session, queries, resolve, reject);
            }

            // Close Session and resolve
            session.close();
            resolve();
        })
        .catch(e => {
            reject(e);
        });
}

function InstallSchema(neode) {
    const queries = [];

    neode.models.forEach((model, label) => {
        model.properties().forEach(property => {
            // Constraints
            if (property.primary() || property.unique()) {
                queries.push(UniqueConstraintCypher(label, property.name()));
            }

            if (neode.enterprise() && property.required()) {
                queries.push(ExistsConstraintCypher(label, property.name()));
            }

            // Indexes
            if (property.indexed()) {
                queries.push(IndexCypher(label, property.name()));
            }

            // Full text indexes
            if (property.fullTextIndexed()) {
                let indexDef = property.fullTextIndexDefinition();
                let forLabel = '';
                if (property.type() === 'nodeFulltext') {
                    forLabel = `(n:${indexDef.models.join('|')})`;
                } else if (property.type() === 'relationshipFulltext') {
                    forLabel = `()-[n:${indexDef.models.join('|')}]-()`;
                }

                queries.push(FullTextIndexCypher(property.name(), indexDef.properties, forLabel, 'CREATE', indexDef.options));
            }

            if (property.vectorIndexed()) {
                queries.push(VectorIndexCypher(label, property.name(), 'CREATE', property.vectorIndex()));
            }
        });
    });

    return neode.batch(queries);
}

function DropSchema(neode) {
    const queries = [];

    neode.models.forEach((model, label) => {
        model.properties().forEach(property => {
            // Constraints
            if (property.unique()) {
                queries.push(UniqueConstraintCypher(label, property.name(), 'DROP'));
            }

            if (neode.enterprise() && property.required()) {
                // queries.push(ExistsConstraintCypher(label, property.name(), 'DROP'));
            }

            // Indexes
            if (property.indexed()) {
                queries.push(IndexCypher(label, property.name(), 'DROP'));
            }

            if (property.fullTextIndexed()) {
                queries.push(FullTextIndexCypher(property.name(), 'N/A', 'N/A', 'DROP'));
            }
        });
    });

    const session = neode.writeSession();

    return new Promise((resolve, reject) => {
        runAsync(session, queries, resolve, reject);
    });
}

export default class Schema {

    constructor(neode) {
        this.neode = neode;
    }

    install() {
        return InstallSchema(this.neode);
    }

    drop() {
        return DropSchema(this.neode);
    }

}
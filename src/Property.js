/**
 *  Container holding information for a property.
 *
 * TODO: Schema validation to enforce correct data types
 */
export default class Property {
    constructor(name, schema) {
        if (typeof schema == 'string') {
            schema = {type: schema};
        }

        this._name = name;
        this._schema = schema;

        // TODO: Clean Up
        Object.keys(schema).forEach(key => {
            this['_' + key] = schema[key];
        });
    }

    name() {
        return this._name;
    }

    type() {
        return this._schema.type;
    }

    primary() {
        return this._primary || false;
    }

    unique() {
        return this._unique || false;
    }

    exists() {
        return this._exists || false;
    }

    required() {
        return this._exists || this._required || false;
    }

    indexed() {
        return this._index || false;
    }

    fullTextIndexed() {
        return this.type() === 'nodeFulltext' || this.type() === 'relationshipFulltext';
    }

    vectorIndex() {
        return this._vectorIndex || {};
    }

    vectorIndexed() {
        return this.type() === 'vector' && this.vectorIndex() != null;
    }

    /**
     * Gets the full text index definition for this property.
     * If the type is nodeFulltext, the models field will be populated with the labels of the nodes that this property is indexed on.
     * If the type is relationshipFulltext, the relations field will be populated with the names of the relationships that this property is indexed on.
     *
     * @return {{
     *     type: 'nodeFulltext'|'relationshipFulltext',
     *     models?: string[],
     *     relations?: string[],
     *     properties: string[],
     *     options: {
     *         indexConfig: {
     *             `fulltext.analyzer`: 'english' | 'standard' | 'simple' | 'whitespace' | 'stop' | 'keyword' | 'standard-folding',
     *             `fulltext.eventually_consistent`: boolean,
     *         }
     *     }
     * }|null}
     */
    fullTextIndexDefinition() {
        if (!this.fullTextIndexed()) {
            return null;
        }
        return this._schema || null;
    }

    protected() {
        return this._primary || this._protected;
    }

    hidden() {
        return this._hidden;
    }

    readonly() {
        return this._readonly || false;
    }

    convertToInteger() {
        return this._type == 'int' || this._type == 'integer';
    }
}

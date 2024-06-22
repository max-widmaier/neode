export default class FullText {
    /**
     * @param {String} index
     * @param {'nodeFulltext'|'relationshipFullText'} type
     * @param {String[]|{
     *     key?: string,
     *     value: string,
     *     operator: 'AND'|'OR'|'NOT'|'+'|'-'
     * }[]} searchTerms
     * @param {'AND'|'OR'|'NOT'|'+'|'-'} operator (optional)
     * @param {String} alias (optional)
     * @param {String} scoreAlias (optional)
     */
    constructor(index, type, searchTerms, operator = 'AND', alias = 'res', scoreAlias = 'score') {
        this._index = index;
        this._type = type;
        this._searchTerms = searchTerms;
        this._operator = operator;
        this._alias = alias;
        this._scoreAlias = scoreAlias;
    }

    toString() {
        const procedure = `db.index.fulltext.${this._type === 'nodeFulltext' ? 'queryNodes' : 'queryRelationships'}`;
        return `CALL ${procedure}("idx_${this._index}_fulltext", '${this.parseSearchTerm()}') YIELD node AS ${this._alias}, score AS ${this._scoreAlias}`;
    }

    parseSearchTerm() {
        if (Array.isArray(this._searchTerms)) {
            return this._searchTerms.map((term, index) => {
                // Return parameterized search term along with operator
                let paramName = `$${this._index}_`;
                if (term.key) {
                    paramName += term.key;
                    paramName = `${term.key}:"${paramName}"`;
                } else {
                    paramName += index.toString();
                    paramName = `"${paramName}"`;
                }

                if (index === 0) {
                    return `${paramName}`;
                } else {
                    let operator = term.operator || this._operator;
                    return `${operator} ${paramName}`;
                }
            }).join(' ');
        } else {
            return `$${this._index}_0`;
        }
    }

    params() {
        let params = {};

        if (!Array.isArray(this._searchTerms)) {
            params = {
                [`${this._index}_0`]: this._searchTerms
            };
        }

        this._searchTerms.forEach((term, index) => {
            if (term.key) {
                params[`${this._index}_${term.key}`] = term.value;
            } else {
                params[`${this._index}_${index}`] = term.value;
            }
        });

        return params;
    }
}
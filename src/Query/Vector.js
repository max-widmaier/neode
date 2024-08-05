export default class Vector {

    /**
     * Add a vector index call to the query
     * @param model {Neode.Model} Model to query
     * @param property {String} Vector property that has been indexed
     * @param nearestNeighbors {Number} Number of nearest neighbors to return
     * @param query {String | Array<Number>} Query, either as a property of a previous node (that is a vector) or a number array
     * @param [nodeAlias] {String} Alias of the node to return (Defaults to ${property}_node)
     * @param [scoreAlias] {String} Alias of the score to return (Defaults to ${property}_score)
     */
    constructor(model, property, nearestNeighbors, query, nodeAlias, scoreAlias) {
        this._nearestNeighbors = nearestNeighbors;
        this._query = query;
        this._nodeAlias = nodeAlias;
        this._scoreAlias = scoreAlias;

        this._index = `idx_${model.name()}_${property}_vector`;
    }

    toString() {
        return `CALL db.index.vector.queryNodes("${this._index}", $${this._index}_neighbors, $${this._index}_query) YIELD node AS ${this._nodeAlias}, score AS ${this._scoreAlias}`;
    }

    params() {
        let params = {};

        params[`${this._index}_neighbors`] = this._nearestNeighbors;
        params[`${this._index}_query`] = this._query;

        return params;
    }
}
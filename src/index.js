import neo4j from 'neo4j-driver';
import Model from './Model';
import Node from './Node';
import Schema from './Schema';
import TransactionError from './TransactionError';

export default class Neode {

    /**
     * Constructor
     *
     * @param  {String} connection_string
     * @param  {String} username
     * @param  {String} password
     * @param  {Bool}   enterprise
     * @return {Neode}
     */
    constructor(connection_string, username, password, enterprise = false) {
        const auth = username && password ? neo4j.auth.basic(username, password) : null;
        this.driver = new neo4j.driver(connection_string, auth);

        this.models = new Map();
        this.setEnterprise(enterprise);
        this.schema = new Schema(this);
    }

    /**
     * @static
     * Generate Neode instance using .env configuration
     *
     * @return {Neode}
     */
    static fromEnv() {
        require('dotenv').config();

        const connection_string = `${process.env.NEO4J_PROTOCOL}://${process.env.NEO4J_HOST}`;
        const username = process.env.NEO4J_USERNAME;
        const password = process.env.NEO4J_PASSWORD;
        const enterprise = !!process.env.NEO4J_ENTERPRISE;

        return new Neode(connection_string, username, password, enterprise);
    }

    /**
     * Set Enterprise Mode
     *
     * @param {Bool} enterprise
     */
    setEnterprise(enterprise) {
        this._enterprise = enterprise;
    }

    /**
     * Are we running in enterprise mode?
     *
     * @return {Bool}
     */
    enterprise() {
        this._enterprise
    }

    /**
     * Define a new Model
     *
     * @param  {String} name
     * @param  {Object} schema
     * @return {Model}
     */
    model(name, schema) {
        if ( schema instanceof Object) {
            const model = new Model(this, name, schema);
            this.models.set(name, model);
        }

        return this.models.get(name);
    }


    /**
     * Create a new Node of a type
     *
     * @param  {String} model
     * @param  {Object} properties
     * @return {Node}
     */
    create(model, properties) {
        return this.models.get(model).create(properties);
    }

    /**
     * Delete a Node from the graph
     *
     * @param  {Node} node
     * @return {Promise}
     */
    delete(node) {
        return node.delete();
    }

    /**
     * Delete all node labels
     *
     * @param  {String} label
     * @return {Promise}
     */
    deleteAll(model) {
        return this.models.get(model).deleteAll();
    }

    /**
     * Run a Cypher query
     *
     * @param  {String} query
     * @param  {Object} params
     * @return {Promise}
     */
    cypher(query, params) {
        const session = this.driver.session();

        return session.run(query, params)
            .then(res => {
                session.close();

                return res;
            })
            .catch(err => {
                session.close();

                throw err;
            });
    }

    /**
     * Create a new Transaction
     *
     * @return {Transaction}
     */
    transaction() {
        const session = this.driver.session();
        const tx = session.beginTransaction();

        // Create an 'end' function to commit & close the session
        // TODO: Clean up
        tx.end = () => {
            tx.commit();
            session.close();
        };

        return tx;
    }

    /**
     * Run a batch of queries within a transaction
     *
     * @type {Array}
     * @return {Promise}
     */
    batch(queries = []) {
        const tx = this.transaction();
        const output = [];
        const errors = [];

        return Promise.all(queries.map(query => {
            const params = typeof query == 'object' ? query.params : {};
            query = typeof query == 'object' ? query.query : query;

            try {
                return tx.run(query, params)
                    .then(res => {
                        output.push(res);
                    })
                    .catch(error => {
                        errors.push({query, params, error});
                    })
            }
            catch (error) {
                errors.push({query, params, error});
            }

        }))
        .then(() => {
            if (errors.length) {
                tx.rollback();

                const error = new TransactionError(errors);

                throw error;
            }

            tx.end();

            return output;
        });
    }

    /**
     * Close Driver
     *
     * @return {void}
     */
    close() {
        this.driver.close();
    }

}

export {
    Model,
    Node
};

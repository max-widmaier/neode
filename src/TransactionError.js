export const ERROR_TRANSACTION_FAILED = 'ERROR_TRANSACTION_FAILED';

export default class TransactionError extends Error {
    constructor(errors) {
        super(JSON.stringify(errors));

        this.errors = errors;
    }
}
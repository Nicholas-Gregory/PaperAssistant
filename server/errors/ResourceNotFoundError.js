module.exports = class ResourceNotFoundError extends Error {
    constructor(...params) {
        super(...params);

        this.name = 'ResourceNotFoundError';
    }
}
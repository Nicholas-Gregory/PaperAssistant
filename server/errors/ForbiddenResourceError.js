module.exports = class ForbiddenResourceError extends Error {
    constructor(...params) {
        super(...params);

        this.name = 'ForbiddenResourceError';
    } 
}
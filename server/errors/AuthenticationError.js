module.exports = class AuthenticationError extends Error {
    constructor(...params) {
        super(...params);

        this.name = 'AuthenticationError';
    } 
}
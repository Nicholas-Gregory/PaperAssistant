module.exports = class ClaudeError extends Error {
    constructor(...params) {
        super(...params);

        this.name = 'ClaudeError';
    } 
}
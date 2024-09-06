const { model, Schema } = require('mongoose');

const imageSourceSchema = new Schema({
    media_type: {
        required: true,
        type: String
    },
    data: {
        required: true,
        type: String
    }
});

const contentItemSchema = new Schema({
    type: {
        required: true,
        type: String
    },
    text: String,
    source: imageSourceSchema
});

const contentSchema = new Schema({
    role: {
        required: true,
        type: String
    },
    content: [contentItemSchema]
});

const contextSchema = new Schema({
    contentItems: [contentSchema]
});

const Context = model('Context', contextSchema);

module.exports = Context;
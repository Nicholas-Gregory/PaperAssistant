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

const contextSchema = new Schema({
    role: {
        required: true,
        type: String
    },
    content: [contentItemSchema],
    name: String,
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Context'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Context'
    }
});

const Context = model('Context', contextSchema);

module.exports = Context;
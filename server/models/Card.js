const { model, Schema } = require('mongoose');

const coordinateSchema = new Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
});

const cardSchema = new Schema({
    content: String,
    context: {
        type: Schema.Types.ObjectId,
        ref: 'Context'
    },
    position: {
        type: coordinateSchema,
        required: true
    },
    scale: {
        type: coordinateSchema,
        required: true
    }
});

const Card = model('Card', cardSchema);

module.exports = Card;
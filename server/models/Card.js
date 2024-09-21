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
    content: {
        type: String,
        required: true
    },
    position: {
        type: coordinateSchema,
        required: true
    },
    scale: {
        type: coordinateSchema,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Card',
        default: () => []
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }
});

const Card = model('Card', cardSchema);

module.exports = Card;
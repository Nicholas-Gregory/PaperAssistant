const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const settingsSchema = new Schema({
    model: {
        type: String,
        default: 'claude-3-5-sonnet-20240620'
    },
    max_tokens: {
        type: Number,
        default: 2048
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        set: v => bcrypt.hashSync(v, 10)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-.!#$&'*+=?^`{}|~/]+@([\w-]+\.)+[\w-]{2,}$/,
    },
    dashboards: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Dashboard'
        }]
    },
    settings: {
        type: settingsSchema,
        default: () => ({})
    }
});

userSchema.methods.compareHashedPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = model('User', userSchema);

module.exports = User;
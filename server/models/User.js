const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

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
    contexts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Context'
        }]
    }
});

userSchema.methods.compareHashedPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = model('User', userSchema);

module.exports = User;
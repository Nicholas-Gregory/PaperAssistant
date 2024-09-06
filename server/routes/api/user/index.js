const AuthenticationError = require('../../../errors/AuthenticationError.js');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('../../../middleware');
const ResourceNotFoundError = require('../../../errors/ResourceNotFoundError.js');

const router = require('express').Router();

const filterPassword = user => Object.fromEntries(Object.entries(user.toObject()).filter(entry => entry[0] !== 'password'))

router.post('/', async (req, res, next) => {
    const userData = req.body;
    let result

    try {
        result = await User.create(userData);
    } catch (err) {
        return next(err);
    }

    return res.status(201).json(filterPassword(result));
});

router.post('/login', async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            user = await User.findOne({ email });
        }

        if (!user) {
            throw new AuthenticationError('Incorrect email or username');
        }

        if (!user.compareHashedPassword(password)) {
            throw new AuthenticationError('Incorrect password');
        }

        return res.status(200).json({
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET),
            user: filterPassword(user)
        })
    } catch (error) {
        return next(error);
    }
});

router.get('/', auth, async (req, res, next) => {
    const userId = req.userId;
    let user;

    try {
        user = await User
        .findById(userId);

        if (!user) throw new ResourceNotFoundError(`User with ID ${userId} not found.`);
    } catch (error) {
        return next(error);
    }

    return res.status(200).json(filterPassword(user));
});

router.put('/', auth, async (req, res, next) => {
    const userId = req.userId;
    const newData = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, newData, { returnDocument: 'after' });

        if (!user) throw new ResourceNotFoundError(`User with ID ${userID} not found.`);

        return res.status(201).json(filterPassword(user));
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
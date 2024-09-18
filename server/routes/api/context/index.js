const router = require('express').Router();

const AuthenticationError = require('../../../errors/AuthenticationError.js');
const ForbiddenResourceError = require('../../../errors/ForbiddenResourceError.js');
const { auth } = require('../../../middleware')
const Context = require('../../../models/Context.js');
const User = require('../../../models/User.js');

router.get('/tree/:contextId', auth, async (req, res, next) => {
    const rootContextId = req.params.contextId;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} found!`)
        }

        
    } catch (error) {
        return next(error);
    }
})

router.get('/:contextId', auth, async (req, res, next) => {
    const contextId = req.params.contextId;
    const userId = req.userId;
    
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} found!`)
        }

        if (!user.contexts.some(c => c.toString() === contextId)) {
            throw new ForbiddenResourceError(`User with ID ${userId} does not have permission to view context with ID ${contextId}`);
        }

        const context = await Context.findById(contextId);

        return res.status(200).json(context);
    } catch(error) {
        return next(error);
    }
});

router.post('/', auth, async (req, res, next) => {
    const contextData = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} found!`);
        }

        const context = await Context.create(contextData);

        user.contexts.push(context._id);
        await user.save();

        return res.status(201).json(context);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
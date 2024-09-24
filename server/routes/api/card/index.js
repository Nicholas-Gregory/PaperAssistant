const AuthenticationError = require('../../../errors/AuthenticationError');
const ForbiddenResourceError = require('../../../errors/ForbiddenResourceError');
const ResourceNotFoundError = require('../../../errors/ResourceNotFoundError');
const { auth } = require('../../../middleware');
const Card = require('../../../models/Card');
const User = require('../../../models/User');

const router = require('express').Router();

router.put('/:cardId', auth, async (req, res, next) => {
    const cardId = req.params.cardId;
    const userId = req.userId;
    const userData = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} exists!`);
        }

        const card = await Card.findById(cardId);

        if (!card) {
            throw new ResourceNotFoundError(`No card with ID ${cardId} exists!`);
        }

        if (card.ownerId && card.ownerId.toString() !== userId) {
            throw new ForbiddenResourceError(`User with ID ${userId} does not own card with ID ${cardId}`);
        }

        Object.assign(card, userData);
        await card.save();

        return res.status(200).json(card);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
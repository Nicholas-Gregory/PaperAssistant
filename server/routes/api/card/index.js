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

router.delete('/card/:cardId', auth, async (req, res, next) => {
    const cardId = req.params.cardId;
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('dashboards');

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} exists!`);
        }

        if (
            !user.dashboards
            .find(dashboard => (
                dashboard.cards
                .some(cardObjectId => cardObjectId.toString() === cardId)
            ))
        ) {
            throw new ForbiddenResourceError(`User with ID ${userId} does not own card with ID ${cardId}!`);
        }

        const response = await Card.findByIdAndDelete(cardId);

        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
});

router.delete('/tree/:cardId', auth, async (req, res, next) => {
    const rootCardId = req.params.cardId;
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('dashboards');

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} exists!`);
        }

        if (
            !user.dashboards
            .find(dashboard => (
                dashboard.cards
                .some(cardObjecId => cardObjecId.toString() === rootCardId)
            ))
        ) {
            throw new ForbiddenResourceError(`User with ID ${userId} does not own card with ID ${rootCardId}!`);
        }

        const card = await Card.findById(rootCardId);

        const removeChildren = async card => {
            await card.populate('children');

            for (let child of card.children) {
                await removeChildren(child);
            }

            return await Card.findByIdAndDelete(card._id);
        }

        const response = await removeChildren(card);

        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
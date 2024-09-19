const AuthenticationError = require('../../../errors/AuthenticationError');
const ForbiddenResourceError = require('../../../errors/ForbiddenResourceError');
const ResourceNotFoundError = require('../../../errors/ResourceNotFoundError');
const { auth } = require('../../../middleware');
const Dashboard = require('../../../models/Dashboard');
const User = require('../../../models/User');
const Context = require('../../../models/Context');

const router = require('express').Router();

router.get('/:dashboardId', auth, async (req, res, next) => {
    const dashboardId = req.params.dashboardId;
    const userId = req.userId;

    try {
        if (dashboardId === 'new') {
            return res.status(204).end();
        }

        const dashboard = await Dashboard.findById(dashboardId);
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} found!`);
        }

        if (!dashboard) {
            throw new ResourceNotFoundError(`No dashboard with ID ${dashboardId} found!`)
        }

        const ownerId = dashboard.ownerId.toString();

        if (ownerId !== userId) {
            throw new ForbiddenResourceError(`User with ID ${userId} does not have permission to edit dashboard with ID ${dashboardId}!`)
        }

        await dashboard.populate('cards');

        res.status(200).json(dashboard);
    } catch (error) {
        return next(error);
    }
});

router.post('/', auth, async (req, res, next) => {
    const userData = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`User with ID ${userId} doesn't exist!`)
        }

        const resolveTree = async (rootCard, parent) => (await Context.create({
            role: rootCard.role,
            content: rootCard.content,
            name: rootCard.name,
            parent: parent && parent._id,
            children: await Promise.all(rootCard.children.map(async child => (
                await resolveTree(child, rootCard)
            )))
        }))._id;

        const contexts = await Promise.all(await userData.contexts.filter(card => (
            !userData.contexts.find(c => c.children.includes(card))
        )).map(async card => await resolveTree(card)));

        const dashboard = await Dashboard.create({
            name: userData.name,
            ownerId: userData.ownerId,
            contexts
        });

        user.dashboards.push(dashboard._id);
        await user.save();

        return res.status(201).json(dashboard);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
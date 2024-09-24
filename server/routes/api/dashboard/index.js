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
            throw new AuthenticationError(`User with ID ${userId} doesn't exist!`);
        }

        const dashboard = await Dashboard.create(userData);

        user.dashboards.push(dashboard._id);
        await user.save();

        return res.status(201).json(dashboard);
    } catch (error) {
        return next(error);
    }
});

router.put('/:dashboardId', auth, async (req, res, next) => {
    const userId = req.userId;
    const newDashboardData = req.body;
    const dashboardId = req.params.dashboardId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new AuthenticationError(`No user with ID ${userId} exists!`);
        }

        if (!user.dashboards.some(id => id.toString() === dashboardId)) {
            throw new ForbiddenResourceError(`User with ID ${userId} does not own dashboard with ID ${dashboardId}`);
        }

        const dashboard = await Dashboard.findByIdAndUpdate(dashboardId, newDashboardData, { 
            runValidators: true,
            returnDocument: 'after'
        });

        if (!dashboard) {
            throw new ResourceNotFoundError(`No dashboard with ID ${dashboardId} exists!`);
        }

        return res.status(200).json(await dashboard.populate('cards'));
    } catch (error) {

    }
});

module.exports = router;
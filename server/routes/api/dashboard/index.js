const { response } = require('express');
const AuthenticationError = require('../../../errors/AuthenticationError');
const ForbiddenResourceError = require('../../../errors/ForbiddenResourceError');
const ResourceNotFoundError = require('../../../errors/ResourceNotFoundError');
const { auth } = require('../../../middleware');
const Dashboard = require('../../../models/Dashboard');
const User = require('../../../models/User');

const router = require('express').Router();

router.get('/:dashboardId', auth, async (req, res, next) => {
    const dashboardId = req.params.dashboardId;
    const userId = req.userId;

    try {
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

        res.status(200).json(dashboard);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
const router = require('express').Router();

const contextRoutes = require('./context');
const userRoutes = require('./user');
const claudeRoutes = require('./claude');
const dashboardRoutes = require('./dashboard');

router.use('/context', contextRoutes);
router.use('/user', userRoutes);
router.use('/claude', claudeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
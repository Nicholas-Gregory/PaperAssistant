const router = require('express').Router();

const contextRoutes = require('./context');
const userRoutes = require('./user');
const claudeRoutes = require('./claude');
const dashboardRoutes = require('./dashboard');
const cardRoutes = require('./card');

router.use('/context', contextRoutes);
router.use('/user', userRoutes);
router.use('/claude', claudeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/card', cardRoutes);

module.exports = router;
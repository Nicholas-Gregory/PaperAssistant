const router = require('express').Router();

const contextRoutes = require('./context');
const userRoutes = require('./user');
const claudeRoutes = require('./claude');

router.use('/context', contextRoutes);
router.use('/user', userRoutes);
router.use('/claude', claudeRoutes);

module.exports = router;
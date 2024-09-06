const router = require('express').Router();

const contextRoutes = require('./context');
const userRoutes = require('./user');

router.use('/context', contextRoutes);
router.use('/user', userRoutes);

module.exports = router;
const router = require('express').Router();
const axios = require('axios');
const { auth } = require('../../../middleware');
const ClaudeError = require('../../../errors/ClaudeError');
const User = require('../../../models/User');
const AuthenticationError = require('../../../errors/AuthenticationError');
const Card = require('../../../models/Card');

router.post('/', auth, async (req, res, next) => {
    const claudeBody = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            throw new AuthenticationError('Must be logged in to make LLM requests');
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', claudeBody, {
            headers: {
                'x-api-key': process.env.VITE_CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            }
        });
        const data = response.data;

        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
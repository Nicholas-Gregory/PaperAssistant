const router = require('express').Router();
const axios = require('axios');
const { auth } = require('../../../middleware');
const ClaudeError = require('../../../errors/ClaudeError');
const User = require('../../../models/User');
const AuthenticationError = require('../../../errors/AuthenticationError');
const Card = require('../../../models/Card');

const getContentArray = userContent => [{ type: 'text', text: userContent}];

const getContentString = contentArray => contentArray.reduce((string, item) => string + item.text, '');

router.post('/', auth, async (req, res, next) => {
    const userData = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            throw new AuthenticationError('Must be logged in to make LLM requests');
        }

        const newUserCard = await Card.create(userData);
        let claudeBody;
        const axiosOptions = {
            headers: {
                'x-api-key': process.env.VITE_CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            }
        };

        if (!userData.parent) {
            claudeBody = {
                model: user.settings.model,
                max_tokens: user.settings.max_tokens,
                messages: [{ role: 'user', content: getContentArray(newUserCard.content) }]
            }
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', claudeBody, axiosOptions);
        const data = response.data;
        const newClaudeCard = await Card.create({
            content: getContentString(data.content),
            position: {
                x: newUserCard.position.x,
                y: newUserCard.position.y + newUserCard.scale.y
            },
            scale: {
                x: 400,
                y: 200
            },
            type: 'assistant',
            parent: newUserCard._id
        });

        newUserCard.children.push(newClaudeCard._id);

        return res.status(200).json(newClaudeCard);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
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

        const newUserCard = await Card.create({
            ...userData,
            ownerId: user._id
        });
        let claudeBody = {
            model: user.settings.model,
            max_tokens: user.settings.max_tokens
        };
        const axiosOptions = {
            headers: {
                'x-api-key': process.env.VITE_CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            }
        };

        if (!newUserCard.parent) {
            claudeBody.messages = [{ role: 'user', content: getContentArray(newUserCard.content) }]
        } else {
            const getMessages = async (card, array) => {
                const parent = card.parent;

                array.unshift({ role: card.type, content: getContentArray(card.content) });

                if (parent) {
                    return getMessages(await Card.findById(parent), array)
                } else {
                    return array;
                }
            }

            claudeBody.messages = await getMessages(newUserCard, []);
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', claudeBody, axiosOptions);
        const data = response.data;
        const newClaudeCard = await Card.create({
            content: getContentString(data.content),
            position: {
                x: newUserCard.position.x,
                y: newUserCard.position.y + newUserCard.scale.y + 10
            },
            scale: {
                x: 400,
                y: 200
            },
            type: 'assistant',
            parent: newUserCard._id,
            ownerId: user._id
        });

        newUserCard.children.push(newClaudeCard._id);
        await newUserCard.save();

        if (newUserCard.parent) {
            const parentCard = await Card.findById(newUserCard.parent);

            parentCard.children.push(newUserCard._id);
            await parentCard.save();
        }

        return res.status(200).json({ newClaudeCard, newUserCard });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
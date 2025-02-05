const express = require('express');
const Message = require('./messages.js');

const router = express.Router();

router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/messages', async (req, res) => {
    try {
        const { from_user, room, message } = req.body;
        const newMessage = new Message({ from_user, room, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log('Connected to MongoDB'))
    .on('error', (err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

const users = require('./users.js');
const messages = require('./messages.js');
const auth = require('./auth.js');

app.use('/users', users);
app.use('/messages', messages);
app.use('/auth', auth);

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    socket.on('message', async (data) => {
        io.to(data.room).emit('message', data);
    });
    socket.on('typing', (data) => {
        socket.to(data.room).emit('typing', data.username);
    });
    socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(port, () => console.log(`Server running on port ${port}`));

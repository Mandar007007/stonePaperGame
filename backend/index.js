const express = require('express');
require('dotenv').config({ path: './config/confid.env' });
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

const rooms = [];

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New connection: ', socket.id);

    socket.on('createRoom', (data) => {
        const roomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        socket.join(roomId);
        rooms.push({
            id: roomId,
            users: [{ id: socket.id, choice: '' }]
        });
        io.to(roomId).emit('roomCreated', { roomId, user: data.user });
        console.log(`Room created with ID: ${roomId}, by user: ${data.user}`);
    });

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId);
        let room = rooms.find(room => room.id === data.roomId);

        if (room) {
            room.users.push({ id: socket.id, choice: '' });
            io.to(data.roomId).emit('connected');
            console.log(`User ${socket.id} joined room: ${data.roomId}`);
        } else {
            socket.emit('error', { message: 'Room not found' });
            console.log(`Room not found: ${data.roomId}`);
        }
    });

    socket.on('userChoise', (data) => {
        let room = rooms.find(room => room.id === data.roomId);
        if (room) {
            let user = room.users.find(user => user.id === socket.id);

            if (user) {
                user.choice = data.choice;
                console.log(`User ${socket.id} made a choice: ${data.choice} in room: ${data.roomId}`);

                let allUsersMadeChoice = room.users.every(user => user.choice !== '');
                if (allUsersMadeChoice) {
                    let choices = room.users.map(user => user.choice);
                    let winner = determineWinner(choices);

                    if (winner === 'draw') {
                        io.to(data.roomId).emit('draw');
                        console.log(`Draw in room: ${data.roomId}`);
                    } else {
                        room.users.forEach(user => {
                            if (user.choice === winner) {
                                io.to(user.id).emit('roundWin');
                                console.log(`User ${user.id} won in room: ${data.roomId}`);
                            } else {
                                io.to(user.id).emit('roundLose');
                                console.log(`User ${user.id} lost in room: ${data.roomId}`);
                            }
                        });
                    }

                    room.users.forEach(user => user.choice = '');
                }
            } else {
                socket.emit('error', { message: 'User not found in room' });
                console.log(`User not found in room: ${data.roomId}`);
            }
        } else {
            socket.emit('error', { message: 'Room not found' });
            console.log(`Room not found: ${data.roomId}`);
        }
    });

    socket.on('winner', (data) => {
        socket.emit('winnerConfirmed', { message: "Finally! won this match" });
        socket.to(data.roomId).emit('looserConfirmed', { message: "Better Luck Next Time" });
    });
});

app.get('/', (req, res) => {
    res.json({
        message: "Welcome Api Is Running fine"
    });
});

http.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});

function determineWinner(choices) {
    const uniqueChoices = [...new Set(choices)];
    if (uniqueChoices.length === 1) return 'draw';

    if (uniqueChoices.includes('rock') && uniqueChoices.includes('paper') && uniqueChoices.includes('scissors')) {
        return 'draw';
    }

    if (uniqueChoices.includes('rock') && uniqueChoices.includes('paper')) {
        return 'paper';
    }

    if (uniqueChoices.includes('rock') && uniqueChoices.includes('scissors')) {
        return 'rock';
    }

    if (uniqueChoices.includes('paper') && uniqueChoices.includes('scissors')) {
        return 'scissors';
    }

    return 'draw';
}

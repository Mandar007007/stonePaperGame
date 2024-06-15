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
    });

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId);
        let room = rooms.find(room => room.id === data.roomId);

        if (room) {
            room.users.push({ id: socket.id, choice: '' });
            io.to(data.roomId).emit('connected');
        } else {
            socket.emit('error', { message: 'Room not found' });
        }
    });

    socket.on('userChoise', (data) => {
        let room = rooms.find(room => room.id === data.roomId);
        if (room) {
            let user = room.users.find(user => user.id === socket.id);

            if (user) {
                user.choice = data.choice;

                let allUsersMadeChoice = room.users.every(user => user.choice !== '');
                if (allUsersMadeChoice) {
                    let choices = room.users.map(user => user.choice);
                    let winner = determineWinner(choices);

                    if (winner === 'draw') {
                        io.to(data.roomId).emit('draw');
                    } else {
                        room.users.forEach(user => {
                            if (user.choice === winner) {
                                io.to(user.id).emit('roundWin');
                            } else {
                                io.to(user.id).emit('roundLose');
                            }
                        });
                    }

                    room.users.forEach(user => user.choice = '');
                }
            } else {
                socket.emit('error', { message: 'User not found in room' });
            }
        } else {
            socket.emit('error', { message: 'Room not found' });
        }
    });

    socket.on('winner', (data) => {
        socket.emit('winnerConfirmed', { message: "Finally! won this match" });
        socket.to(data.roomId).emit('looserConfirmed', { message: "Better Luck Next Time" });
    });
});

app.get('/', (req, res) => {
    res.json({
        message: "Welcome Api Is Running fineeee"
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

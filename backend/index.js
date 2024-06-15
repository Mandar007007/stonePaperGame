const express = require('express');
require('dotenv').config({ path: './config/confid.env' });
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const path = require('path');

const rooms = []; // Initialize rooms array

app.use(cors({
    origin: "*", // Add your frontend URLs here
    methods: ["GET", "POST"],
    credentials: true
  }));

const io = require('socket.io')(http, {
    cors: {
        origin:"*", // Add your frontend URLs here
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
            users: [{ id: socket.id, choice: '' }],
            choice: ''
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
            // Handle case where room is not found
            socket.emit('error', { message: 'Room not found' });
        }
    });

    socket.on('userChoise', (data) => {
        let room = rooms.find(room => room.id === data.roomId);
        if (room) {
            let user = room.users.find(user => user.id === socket.id);

            if (user) {
                if (room.choice !== '') {
                    console.log('Room already has a choice:', room);
                    if (data.choice === 'rock' && room.choice === 'paper') {
                        socket.emit('roundLose');
                        socket.to(data.roomId).emit('roundWin');
                    } else if (data.choice === 'paper' && room.choice === 'rock') {
                        socket.emit('roundWin');
                        socket.to(data.roomId).emit('roundLose');
                    } else if (data.choice === 'scissors' && room.choice === 'paper') {
                        socket.emit('roundWin');
                        socket.to(data.roomId).emit('roundLose');
                    } else if (data.choice === 'paper' && room.choice === 'scissors') {
                        socket.emit('roundLose');
                        socket.to(data.roomId).emit('roundWin');
                    } else if (data.choice === 'rock' && room.choice === 'scissors') {
                        socket.emit('roundWin');
                        socket.to(data.roomId).emit('roundLose');
                    } else if (data.choice === 'scissors' && room.choice === 'rock') {
                        socket.emit('roundLose');
                        socket.to(data.roomId).emit('roundWin');
                    } else {
                        io.to(data.roomId).emit('draw');
                    }
                    room.choice = '';
                    user.choice = '';
                } else {
                    room.choice = data.choice;
                    user.choice = data.choice; 
                    console.log('Updated room:', room);
                    // socket.emit('roundWin');
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
        socket.to(data.roomId).emit('looserConfirmed',{message:"Better Luck Next Time"})
    });
});

app.get('/' ,(req,res) => {
    res.json({
        message:"Welcome Api Is Running"
    })
})

http.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});
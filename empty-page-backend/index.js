const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize Socket.IO and allow connections from your Next.js app
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URI, // The URL of your Next.js frontend
        methods: ["GET", "POST"],
    },
});


io.on('connection', (socket) => {
    // console.log(`✅ User connected: ${socket.id}`);

    // When a user opens a note, they join a "room" for that specific note
    socket.on('join_note', (noteId) => {
        socket.join(noteId);
        // console.log(`User ${socket.id} joined note room: ${noteId}`);
    });

    // When a user types, receive their update and broadcast it to the room
    socket.on('text_update', (data) => {
        // We send the update to all other clients in the same note room
        socket.to(data.noteId).emit('receive_text_update', data.content);
    });

    socket.on('disconnect', () => {
        // console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    // console.log(`🚀 Socket server listening on port ${PORT}`)
});
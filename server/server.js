const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newEmail', {
    from: 'mike@example.com',
    test: 'Hey! What is going on?',
    createAt: 123
  });

  socket.emit('newMessage', {
    from: 'Ervin',
    text: 'Welcome to the server',
    createAt: 456
  });

  socket.on('createEmail', (newEmail) => {
    console.log('createEmail ', newEmail);
  });

  socket.on('createMessage', (newMessage) => {
    console.log('createMessage ', newMessage);
  });

  socket.on('disconnect', (socket) => {
    console.log('Client disconnected');
  });
});



server.listen(port, () => {
  console.log(`Sarted on port ${port}`);
});

module.exports = { app }

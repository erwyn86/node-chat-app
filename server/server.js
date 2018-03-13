const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');
const {isRealString} = require('./utils/validation');

const {Users} = require('./utils/users');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();



app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || (!isRealString(params.room)) ){
      callback('Name and room name are required.')
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //Welcome the user
    socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room} chat room ${params.name}`));

    //tell other users that user has joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage ', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    console.log('createLocationMessage ', coords.latitude, coords.longitude);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    //callback('Coords sent');
  });

  socket.on('disconnect', () => {
    //console.log(`${params.name} has left the room ${params.room}`);
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
    console.log(`User has left the room`);
  });
});



server.listen(port, () => {
  console.log(`Sarted on port ${port}`);
});

module.exports = { app }

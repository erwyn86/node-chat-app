var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (res) {
  console.log('You have a new message', res);
  var li = $('<li></li>');
  li.text(`${res.from}: ${res.text}`);

  $('#messages').append(li);
});

socket.emit('createMessage', {
  from: 'Ervin',
  text: 'Hello there!'
}, function (data) {
  console.log('Got it', data);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('input[name=message]').val()
  }, function (data) {
    $('input[name=message]').val('');
    $('input[name=message]').focus();
  });
})

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

socket.on('newLocationMessage', function (res) {
  console.log('You have a new message', res);
  var li = $('<li></li>');
  var a = $(`<a></a>`);
  $(a).text(res.from + ': User at this place');
  $(a).attr('href', res.url);
  $(a).attr('target', '_blank');

  $(li).append(a);
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
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function (m) {
      console.log(m);
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});

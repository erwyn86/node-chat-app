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

  var messageInput = $('input[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageInput.val()
  }, function (data) {
    messageInput.val('');
    messageInput.focus();
  });
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled','disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr("disabled").text('Send location');;
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
    locationButton.removeAttr("disabled").text('Send location');;
  });
});

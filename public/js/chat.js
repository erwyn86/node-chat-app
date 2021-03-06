var socket = io();

function scrollToBottom() {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
  {
    messages.scrollTop(scrollHeight);
  }

}

socket.on('connect', function () {
  //console.log('Connected to server');
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  //console.log('Users list', users);
  var ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function (res) {
  var template = $('#message-template').html();
  var createdAt = moment(res.createdAt).format('HH:mm');
  var html = Mustache.render(template, {
    text: res.text,
    from: res.from,
    createdAt: createdAt
  });

  $("#messages").append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (res) {
  var template = $('#location-message-template').html();
  var createdAt = moment(res.createdAt).format('HH:mm');
  var html = Mustache.render(template, {
    from: res.from,
    url: res.url,
    createdAt: createdAt
  });

  $("#messages").append(html);
  scrollToBottom();
});

/*
socket.emit('createMessage', {
  from: 'Ervin',
  text: 'Hello there!'
}, function (data) {
  console.log('Got it', data);
});

*/

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageInput = $('input[name=message]');

  socket.emit('createMessage', {
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

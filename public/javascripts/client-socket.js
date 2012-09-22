// var socket = io.connect('/', {port: 443}),
var socket = io.connect('/'),
    GLOBAL_USERNAME;

// When the socket connection has been made ask for a username.
socket.on('connect', function () {
  GLOBAL_USERNAME = prompt("What's your name?");
  // Tell the server to add username.
  socket.emit('adduser', GLOBAL_USERNAME);
});

// Listen for messages on 'updatechat'. When received, append the username and message to the conversation. Not optimal code, but it does the job for demo purposes.
socket.on('updatechat', function (username, data) {
  $('.conversation').append('<strong>' + username + ':</strong> ' + data + '<br>');
});

// Listen for messages on 'updateusers'. When received, empty the user list and re-add all usernames to the list.
socket.on('updateusers', function (data) {
  $('.users-list').empty();
  $.each(data, function (key, value) {
    $('.users-list').append('<div>' + key + '</div>');
  });
});

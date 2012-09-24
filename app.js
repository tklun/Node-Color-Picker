
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    canvas = require('canvas'),
    QRCode = require('qrcode'),
    routes = require('./routes');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(connect.cookieParser());
  app.use(connect.session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/client', routes.client);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Socket Initialization
// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

  // Listen for messages on 'sendchat'. When received,
  // send the message back to the front-end with a username and message.
  socket.on('sendbackground', function (data) {
    io.sockets.emit('updatebackground', socket.username, data);
  });
  
  socket.on('sendrange', function (data) {
    io.sockets.emit('updaterange', socket.username, data);
  });

  // Listen for messages on 'sendcircle'. When a circle has been received,
  // send the username and circle data to the front-end.
  socket.on('sendcircle', function (data) {
    console.log(data);
    io.sockets.emit('updatesocketcircle', socket.username, data);
  });

  // When a user first connects, they are asked to provide a username.
  // Take this username, add it to the username array, send a connection
  // message, and update the front-end user list.
  socket.on('adduser', function(username){
    socket.username = username;
    usernames[username] = username;
    socket.emit('updatechat', 'SERVER', 'you have connected');
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    io.sockets.emit('updateusers', usernames);
  });

  // Upon disconnection, remove the username from the usernames array and send
  // the front-end a new user list. Finally broadcast a global message the user has disconnected.
  socket.on('disconnect', function(){
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});

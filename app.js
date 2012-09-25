
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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

var primarySockets = {};

var getSocketByGuid = function (guid) {
  return primarySockets[guid];
};

io.sockets.on('connection', function (socket) {
  // this is a desktop
  socket.on('primaryConnection', function (guid) {
    primarySockets[guid] = socket;
    socket.on('disconnect', function () {
      delete primarySockets[guid];
    });
  });
  
  // this is a phone
  socket.on('secondaryConnection', function (guid) {
    socket.on('operation', function (operation) {
      var desktopSocket = getSocketByGuid(guid);
      desktopSocket.emit('operation', operation);
    });
    socket.on('sendbackground', function (data) {
      var desktopSocket = getSocketByGuid(guid);
      desktopSocket.emit('updatebackground', socket.username, data);
    });
    socket.on('sendrange', function (data) {
      var desktopSocket = getSocketByGuid(guid);
      desktopSocket.emit('updaterange', socket.username, data);
    });
  });
});

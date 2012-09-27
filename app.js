
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    cuid = require('cuid'),
    QRCode = require('qrcode');

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
var websockets = {
  primarySockets: {},
  getSocketByGuid: function (guid) {
    return websockets.primarySockets[guid];
  },
  generateGuid: function() {
    return cuid();
  },
  generateQRPath: function(guid) {
    var protocol = 'http://',
        hostname = '10.101.24.39:3000',
        path = 'client',
        qrCodePath = protocol + hostname + '/' + path + '?guid=' + guid;
      return qrCodePath;
  }
};

io.sockets.on('connection', function (socket) {

  var newGuid = websockets.generateGuid();
  socket.emit('sendGuid', newGuid);

  // this is a desktop
  socket.on('primaryConnection', function (guid) {
    websockets.primarySockets[guid] = socket;
    var qrCodePath = websockets.generateQRPath(guid);
    
    QRCode.toDataURL(qrCodePath, function(err,url) {
      socket.emit('sendQRCode', url);
    });
    
    socket.on('disconnect', function () {
      delete websockets.primarySockets[guid];
    });
  });
  
  // this is a phone
  socket.on('secondaryConnection', function (guid) {
    console.log('Echo Secondary Connection Guid: ', guid);
    socket.on('sendbackground', function (data) {
      var desktopSocket = websockets.getSocketByGuid(guid);
      desktopSocket.emit('updatebackground', socket.username, data);
    });
    socket.on('sendrange', function (data) {
      var desktopSocket = websockets.getSocketByGuid(guid);
      console.log(desktopSocket);
      desktopSocket.emit('updaterange', socket.username, data);
    });
  });
});

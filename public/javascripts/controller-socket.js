(function() {
  var socketController = {
    colorSelector: '#main-color',
    rangeSelector: '#slider',
    guidSelector: '#guid',
    getColor: function(element) {
      var color = $(element).val();
      console.log(color);
      socket.emit('sendbackground', color);
    },
    getRange: function(element) {
      var currentNumber = $(element).val();
      console.log(currentNumber);
      socket.emit('sendrange', currentNumber);
    },
    getGuid: function(element) {
      var guid = $(element).val();
      return guid;
    },
    initSocketConnection: function() {
      var uniqueGuid = socketController.getGuid(socketController.guidSelector);
      socket.on('connect', function () {
        socket.emit('secondaryConnection', uniqueGuid);
      });
    },
    initSocketListeners: function() {
      $(socketController.colorSelector).on('change', function() {
        socketController.getColor(this);
      });
      
      $(socketController.rangeSelector).on('change', function() {
        socketController.getRange(this);
      });
    },
    init: function() {
      socketController.initSocketConnection();
      socketController.initSocketListeners();
    }
  };
  socketController.init();
})();

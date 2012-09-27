(function() {
  var socketController = {
    colorSelector: '#main-color',
    rangeSelector: '#slider',
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
    // Quick 'meh' string parser, needs refactor.
    parseQueryString: function() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    initSocketConnection: function() {
      // Parse current query string for guid parameter
      var queryGuid = socketController.parseQueryString().guid;
      socket.on('connect', function () {
        // On 'sendGuid'
        socket.emit('secondaryConnection', queryGuid);
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

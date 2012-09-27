(function() {
  var backgroundSwitcher = {
    selector: 'body',
    rangeSelector: '#selected-range',
    changeBackground: function(backgroundColor) {
      $(backgroundSwitcher.selector).css('background-color', backgroundColor);
    },
    changeRange: function(num) {
      $(backgroundSwitcher.rangeSelector).html(num);
      var opacity = (num/100);
      $(backgroundSwitcher.selector).css('opacity', opacity);
    },
    initSocketConnection: function() {
      socket.on('connect', function () {
        // On 'sendGuid', received a new guid from the server and send it back through 'primaryConnection'
        socket.on('sendGuid', function(guid) {
          socket.emit('primaryConnection', guid);
        });
        
        // On 'sendQRCode', received a new QR code datauri and inject it into the page
        socket.on('sendQRCode', function(qrDataURI) {
          //print generated qrDataURI
          $('body').append($('<img/>', { src: qrDataURI }));
        });
      });
      
    },
    initSocketListeners: function() {
      // Listen on updatebackground channel
      socket.on('updatebackground', function (username, color) {
        backgroundSwitcher.changeBackground(color);
      });
      socket.on('updaterange', function (username, value) {
        backgroundSwitcher.changeRange(value);
      });
    },
    init: function() {
      backgroundSwitcher.initSocketConnection();
      backgroundSwitcher.initSocketListeners();
    }
  };
  backgroundSwitcher.init();
})();

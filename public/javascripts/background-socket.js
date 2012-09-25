(function() {
  var backgroundSwitcher = {
    selector: 'body',
    rangeSelector: '#selected-range',
    guidSelector: '#guid',
    changeBackground: function(backgroundColor) {
      $(backgroundSwitcher.selector).css('background-color', backgroundColor);
    },
    changeRange: function(num) {
      $(backgroundSwitcher.rangeSelector).html(num);
      var opacity = (num/100);
      $(backgroundSwitcher.selector).css('opacity', opacity);
    },
    getGuid: function(element) {
      var guid = $(element).val();
      return guid;
    },
    initSocketConnection: function() {
      var uniqueGuid = backgroundSwitcher.getGuid(backgroundSwitcher.guidSelector);
      socket.on('connect', function () {
        socket.emit('primaryConnection', uniqueGuid);
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

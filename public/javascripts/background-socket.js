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
    init: function() {
      // Listen on updatebackground channel
      socket.on('updatebackground', function (username, color) {
        backgroundSwitcher.changeBackground(color);
      });
      socket.on('updaterange', function (username, value) {
        backgroundSwitcher.changeRange(value);
      });
    }
  };
  backgroundSwitcher.init();
})();

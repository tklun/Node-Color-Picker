(function() {
  var backgroundSwitcher = {
    selector: 'body',
    changeBackground: function(backgroundColor) {
      $(backgroundSwitcher.selector).css('background-color', backgroundColor);
    },
    init: function() {
      // Listen on updatebackground channel
      socket.on('updatebackground', function (username, color) {
        backgroundSwitcher.changeBackground(color);
      });
    }
  };
  backgroundSwitcher.init();
})();

(function() {
  var socketController = {
    colorSelector: '#main-color',
    getColor: function(element) {
      var color = $(element).val();
      console.log(color);
      socket.emit('sendbackground', color);
    },
    init: function() {
      $(socketController.colorSelector).on('change', function() {
        socketController.getColor(this);
      });
    }
  };
  socketController.init();
})();

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
    init: function() {
      $(socketController.colorSelector).on('change', function() {
        socketController.getColor(this);
      });
      
      $(socketController.rangeSelector).on('change', function() {
        socketController.getRange(this);
      });
      
      socket.emit('init', guid);
    }
  };
  socketController.init();
})();

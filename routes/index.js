
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: 'Node Color Picker'
  });
};

exports.client = function(req, res){
  res.render('client', {
    title: 'Node Color Picker - Client'
  });
};

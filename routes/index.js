
/*
 * GET home page.
 */
var QRCode = require('qrcode');

exports.index = function(req, res){
  var sess = req.session;
  console.log(req.session);
  QRCode.toDataURL('http://10.101.24.39:3000/client',function(err,url){
    res.render('index', {
      title: 'Node Color Picker',
      qrcode: url,
      sess: sess
    });
  });
};

exports.client = function(req, res){
  res.render('client', { title: 'Node Color Picker - Client' });
};

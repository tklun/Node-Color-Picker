
/*
 * GET home page.
 */
var QRCode = require('qrcode'),
    cuid = require('cuid');

var generateGuid = function() {
  return cuid();
};

exports.index = function(req, res){
  var protocol = 'http://',
      hostname = req.headers.host;
      path = 'client',
      guid = generateGuid(),
      qrCodePath = protocol + hostname + '/' + path + '?guid=' + guid;
  
  console.log('Generated path: ', qrCodePath);
  QRCode.toDataURL(qrCodePath, function(err,url) {
    res.render('index', {
      title: 'Node Color Picker',
      qrcode: url,
      guid: guid
    });
  });
};

exports.client = function(req, res){
  console.log('GUID: ', req.query.guid);
  res.render('client', {
    title: 'Node Color Picker - Client',
    guid: req.query.guid
  });
};

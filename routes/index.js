var express = require('express');
const shortid = require("shortid");
const validurl = require("valid-url");
var router = express.Router();

var urlcache = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* Redirect to original url */
router.get('/:code', function(req, res, next) {
  res.redirect(urlcache[code]);
});

/* Call shortener service */
router.post('/', function(req, res, next) {
  var original = req.body.original;
  var base = req.body.base;
  if (validurl.isUri(original)) {
    code = shortid.generate();
    urlcache[code] = original;
    res.render('index', { title: base+"/"+code });
  } else {
    res.render('index', { title: "invalid url" });
  }
  res.render('index', { title: base + original });
});

module.exports = router;

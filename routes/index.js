var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* Redirect to original url */
router.get('/:code', function(req, res, next) {
  res.redirect("http://localhost:3000");
});

/* Call shortener service */
router.post('/', function(req, res, next) {
  var original = req.body.original;
  var base = req.body.base;

  res.render('index', { title: base + original });
});

module.exports = router;

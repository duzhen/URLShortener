var express = require('express');
var shortid = require("shortid");
var validurl = require("valid-url");

var shortener = require('../models/shortener.js');
var router = express.Router();

const baseurl = "http://wfu.im";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* Redirect to original url */
router.get('/:code', function(req, res, next) {
  var code = req.params.code;
  shortener.findOne({ code: code }, function (err, data) {
    if(err) { 
      res.status(400).json(err) 
    } else if(data) {
      res.redirect(data.original);
    } else {
      res.status(400).json("invalid short url");
    }
  })
});

/* Call shortener service */
router.post('/', function(req, res, next) {
  var original = req.body.original;
  var base = req.body.base;
  if(original) {
    original = original.trim();
  }
  if(base) {
    base = base.trim();
  } else {
    base = baseurl;
  }
  if (validurl.isUri(original)) {
    if (!validurl.isUri(base)) {
      res.status(400).json("invalid base url");
    }
    shortener.findOne({ original: original, base: base }, function (err, data) {
      if(err) { 
        res.status(400).json(err) 
      } else if(data) {
        code = data.code
        res.status(200).json({base, original, code});
      } else {
        code = shortid.generate();
        shortUrl = base + "/" + code;
          var data = new shortener({
            base,
            original,
            code
          });
          data.save(function(err, data) {
            if(err) { 
              res.status(400).json(err) 
            } else {
              res.status(200).json({base, original, code});
            }
          })
        }
      });
  } else {
    res.status(400).json("invalid original url");
  }
});

module.exports = router;

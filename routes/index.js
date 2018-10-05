var express = require('express');
var shortid = require("shortid");
var validurl = require("valid-url");

var shortener = require('../models/shortener.js');
var router = express.Router();

const baseurl = "http://wfu.im";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { short:'', title: 'URL Shortener Service' });
});

/**
 * @api {get} /:code Get Original URL
 * @apiDescription Redirect to Original URL
 * @apiName get original url
 * @apiGroup Shortener
 * @apiExample {curl} Example usage:
 *     curl http://wfu.im/YM5ctlUJo
 * @apiVersion 0.0.1
 */
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

/**
 * @api {post} / Shortener URL
 * @apiDescription Shortener URL
 * @apiName Shortener url
 * @apiGroup Shortener
 * @apiParam {String} [base]  Optional Base URL.
 * @apiParam {String} original  Original URL.
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "base": "http://wfu.im",
 *   "original": "http://google.com",
 *   "code": "YM5ctlUJo"
 * }
 * @apiParamExample {json} Request-Example:
 *     {
 *       "base": http://wfu.im,
 *       "original": http:://google.com
 *     }
 * @apiSampleRequest http://wfu.im
 * @apiVersion 0.0.1
 */
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
      if(req.body.web) {
        res.render('index', { error: 'invalid base url', title: 'URL Shortener Service' });
      } else {
        res.status(400).json("invalid base url");
      }
    }
    shortener.findOne({ original: original, base: base }, function (err, data) {
      if(err) {
        if(req.body.web) {
          res.render('index', { error: err, title: 'URL Shortener Service' });
        } else {
          res.status(400).json(err);
        }
      } else if(data) {
        var code = data.code
        shorturl = base + "/" + code;
        if(req.body.web) {
          res.render('index', { short: shorturl, title: 'URL Shortener Service' });
        } else {
          res.status(200).json({base, original, code});
        }
      } else {
        code = shortid.generate();
        shorturl = base + "/" + code;
          var data = new shortener({
            base,
            original,
            code
          });
          data.save(function(err, data) {
            if(err) { 
              if(req.body.web) {
                res.render('index', { error: err, title: 'URL Shortener Service' });
              } else {
                res.status(400).json(err);
              }
            } else {
              if(req.body.web) {
                res.render('index', { short: shorturl, title: 'URL Shortener Service' });
              } else {
                res.status(200).json({base, original, code});
              }
            }
          })
        }
      });
  } else {
    if(req.body.web) {
      res.render('index', { error: 'invalid original url', title: 'URL Shortener Service' });
    } else {
      res.status(400).json("invalid original url");
    }
  }
});

module.exports = router;

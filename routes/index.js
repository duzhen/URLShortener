var express = require('express');
var shortid = require("shortid");
var validurl = require("valid-url");
var config = require('../config/config')

var shortener = require('../models/shortener.js');
var router = express.Router();
// redis
var redisClient = require('redis').createClient;
var redis = redisClient(6379, config.redis);
//kafka
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var kafkaClient = new kafka.Client();
var producer = new Producer(kafkaClient);
//consumer
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
        client,
        [
            {topic: 'SHORTENER', partition: 0}
        ],
        {
            autoCommit: true
        }
    );
consumer.on('message', function (message) {
  msg = JSON.parse(message['value']);
  base = msg.base;
  original = msg.original;
  code = msg.code;
  var data = new shortener({
    base,
    original,
    code
  });
  data.save(function(err, data) {
    if(err)
      console.log(err)
  });
  });
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
router.get('/:code', function (req, res, next) {
  var code = req.params.code;
  redis.get(code, function (err, reply) {
    if (err) res.status(400).json(err);
    else if (reply) {
      res.redirect(reply);
    } else {
      shortener.findOne({ code: code }, function (err, data) {
        if (err) {
          res.status(400).json(err)
        } else if (data) {
          redis.set(code, data.original, function() {
            res.redirect(data.original);
          });
        } else {
          res.status(400).json("invalid short url");
        }
      })
    }
  });
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
        // var data = new shortener({
        //   base,
        //   original,
        //   code
        // });
        // msg = JSON.stringify({'base':base, 'original':original, 'code':code})
        msg = JSON.stringify({base, original, code})
        var payload = [
          {
              topic: 'SHORTENER',
              messages: msg,
              partition: 0
          }
        ];
        producer.send(payload, function (err, data) {
          if(err) { 
            if(req.body.web) {
              res.render('index', { error: err, title: 'URL Shortener Service' });
            } else {
              res.status(400).json(err);
            }
          } else {
            redis.set(code, original, function() {
              if(req.body.web) {
                res.render('index', { short: shorturl, title: 'URL Shortener Service' });
              } else {
                res.status(200).json({base, original, code});
              }
            });
          }
        });

        // data.save(function(err, data) {
        //   if(err) { 
        //     if(req.body.web) {
        //       res.render('index', { error: err, title: 'URL Shortener Service' });
        //     } else {
        //       res.status(400).json(err);
        //     }
        //   } else {
        //     redis.set(code, data.original, function() {
        //       if(req.body.web) {
        //         res.render('index', { short: shorturl, title: 'URL Shortener Service' });
        //       } else {
        //         res.status(200).json({base, original, code});
        //       }
        //     });
        //   }
        // })
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

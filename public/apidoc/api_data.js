define({ "api": [
  {
    "type": "post",
    "url": "/",
    "title": "Shortener URL",
    "description": "<p>Shortener URL</p>",
    "name": "Shortener_url",
    "group": "Shortener",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "base",
            "description": "<p>Optional Base URL.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "original",
            "description": "<p>Original URL.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"base\": http://wfu.im,\n  \"original\": http:://google.com\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"base\": \"http://wfu.im\",\n  \"original\": \"http://google.com\",\n  \"code\": \"YM5ctlUJo\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://wfu.im"
      }
    ],
    "version": "0.0.1",
    "filename": "routes/index.js",
    "groupTitle": "Shortener"
  },
  {
    "type": "get",
    "url": "/:code",
    "title": "Get Original URL",
    "description": "<p>Redirect to Original URL</p>",
    "name": "get_original_url",
    "group": "Shortener",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://wfu.im/YM5ctlUJo",
        "type": "curl"
      }
    ],
    "version": "0.0.1",
    "filename": "routes/index.js",
    "groupTitle": "Shortener"
  }
] });

[![Build Status](https://travis-ci.org/duzhen/URLShortener.svg?branch=master)](https://travis-ci.org/duzhen/URLShortener)
# URL Shortener

## Dependency
* NodeJs
* Express
* Redis
* Kafka
* MongoDB
* Pug

## Environment Prepare
```
~~net start MongoDB~~
docker-compose -v
npm install mocha -g
```

# Test
```
mocha test
or
npm test
```

# Running
 ```
 npm start
 or
 supervisor bin/www
 ```
 
 # Build docker
 ```
 docker build -t duzhen/shortener .
 ~~docker run -d --name shortener --network=host -p 80:80 duzhen/shortener:latest~~
 docker-compose up
 ```
 
 # AWS Demo
 ```
 URL:http://ec2-18-217-218-155.us-east-2.compute.amazonaws.com
 Short URL:http://wfu.im
 ```
 
 ## GET Original
 ```
 curl --request GET \
  --url 'http://wfu.im/YM5ctlUJo'
 ```
 
 ## POST URL Shotener
 ```
curl --request POST \
  --url http://wfu.im \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'base=http://wfu.im&original=http://google.com'
```

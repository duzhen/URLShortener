var app = require('../app');
var request = require('supertest')(app);
var should = require("should"); 

describe('routes/index.js', function() {

    var original = 'http://google.com';
    var code = '';

    describe('url shortener', function() {
        it('should return URL Shortener Service page', function(done) {
            request.get('/')
            .expect(200, function(err, res) {
                should.not.exist(err);
                res.text.should.containEql('URL Shortener Service');
                done();
            });
        });
        it('should return a short url', function(done) {
            request.post('/')
            .send({
                original: original
            })
            .expect(200, function(err, res) {
                should.not.exist(err);
                res.text.should.containEql('code');
                code =  JSON.parse(res.text).code
                done();
            });
        });
        it('should redirect to original url', function(done) {
            request.get('/'+code)
            .expect(302, function(err, res) {
                should.not.exist(err);
                res.text.should.containEql(original);
                done();
            });
        });
    });
});
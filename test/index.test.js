var expect = require('chai').expect;
var request = require('supertest');
var app = require('../server');

describe('App', function() {
  it('should return a 302 response', function(done) {
    request(app).get('/profile').expect(302, done);
  });
});

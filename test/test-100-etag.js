var nock = require('nock');
var expect = require('chai').expect
var it = require('./utils').tcit

describe('the ETag watcher', function () {
  
  var etag = function () {
    var ctor = require('..').etag;
    var w = ctor.apply(null, arguments);
    watchers.push(w);
    return w;
  };
  var watchers;
  beforeEach(function () {
    nock('http://google.com').head('/').reply(200, '', {ETag: 'google'});
    watchers = [];
  })
  afterEach(function () {
    nock.cleanAll();
    watchers.forEach(function (w) {
      w.cancel();
    })
  });

  it('should be a constructor', function () {
    var etag = require('..').etag;
    var depends = new etag('http://google.com')
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(etag)
  })

  it('should be a constructor even without new', function () {
    var etag = require('..').etag;
    var depends = etag('http://google.com')
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(etag)
  })

  it('should make a HEAD request to the given URL', function (done) {
    var expectHead = nock('http://some.url')
                    .head('/resource')
                    .reply(200, "", {ETag: '888'})

    var depends = etag('http://some.url/resource', '888'); 
    setTimeout(function () {
      expectHead.done();
      done()
    }, 10)
  });

  it('should make a HEAD request every X seconds according ot its timeout parameter', function (done) {
    // here we expect to get 3 requests in 500 ms given that the timeout is 200ms
    var expectHead = nock('http://some.url')
                    .head('/resource')
                    .times(3)
                    .reply(200, "", {ETag: '888'})

    var depends = etag('http://some.url/resource', '888', {
      interval: 200
    }); 


    setTimeout(function () {
      expectHead.done();
      done()
    }, 510)
  })

  // 'change'
  // check(cb)
  // cancel()
})

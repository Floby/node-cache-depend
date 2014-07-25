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
    nock('http://example.com').head('/').reply(200, '', {ETag: 'google'});
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
    var depends = new etag('http://example.com')
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(etag)
  })

  it('should be a constructor even without new', function () {
    var etag = require('..').etag;
    var depends = etag('http://example.com')
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
    // here we expect to get 3 requests in 50 ms given that the timeout is 20ms
    var expectHead = nock('http://some.url')
                    .head('/resource')
                    .times(3)
                    .reply(200, "", {ETag: '888'})

    var depends = etag('http://some.url/resource', '888', {
      interval: 20
    }); 


    setTimeout(function () {
      expectHead.done();
      done()
    }, 51)
  })

  it('should emit a change event when the ETag changes', function (done) {
    var head1 = nock('http://some.url')
      .head('/resource')
      .reply(200, "", {ETag: '888'})
    var head2 = nock('http://some.url')
      .head('/resource')
      .reply(200, "", {ETag: '999'})

    var depends = etag('http://some.url/resource', '888', {interval: 20});
    depends.on('change', function(info) {
      head1.done();
      head2.done();
      expect(info).to.be.an('object');
      expect(info).to.have.property('changeId');
      expect(info.oldETag).to.equal('888');
      expect(info.newETag).to.equal('999');
      done();
    });
  });

  // 'change'
  // check(cb)
  // cancel()
})

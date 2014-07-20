var expect = require('chai').expect;

describe('The cache-depend module', function () {
  it('should be requirable', function() {
    require('../')
  })

  it('should be a function', function () {
    var cacheDepend = require('../')
    expect(cacheDepend).to.be.a('function')
  })

  describe('has methods such as', function () {
    var CacheDepend = require('../');
    it('etag', function () {
      expect(CacheDepend).to.have.property('etag');
      expect(CacheDepend.etag).to.be.a('function');
    })
  })

})

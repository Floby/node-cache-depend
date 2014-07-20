var nock = require('nock');
var expect = require('chai').expect

var etag = require('..').etag

describe('the ETag watcher', function () {
  it('should be a constructor', function () {
    var depends = new etag()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(etag)
  })

  it('should be a constructor even without new', function () {
    var depends = etag()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(etag)
  })
})

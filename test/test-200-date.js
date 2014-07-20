var expect = require('chai').expect

var date = require('..').date

describe('the ETag watcher', function () {
  it('should be a constructor', function () {
    var depends = new date()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(date)
  })

  it('should be a constructor even without new', function () {
    var depends = date()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(date)
  })
})


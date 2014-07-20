var expect = require('chai').expect
var assert = require('chai').assert

var DateTime = require('..').date

describe('the DateTime function', function () {
  it('should be a constructor', function () {
    var depends = new DateTime()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(DateTime)
  })

  it('should be a constructor even without new', function () {
    var depends = DateTime()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(DateTime)
  })
})

describe('a DateTime watcher instance', function () {
  it('should expose its limit with a `limit` method', function () {
    var limit = new Date(Date.now() + 3600)
    var d = DateTime(limit)
    expect(d).to.have.property('limit')
    expect(d.limit).to.be.a('function')
    expect(+d.limit()).to.equal(+limit)
  })

  it('should cast its limit to a date object', function () {
    var limit = '2050-09-08'
    var d = DateTime(limit)
    var actual = d.limit()
    expect(actual).to.be.an.instanceof(Date)
    expect(+actual).to.equal(+(new Date(limit)))
  })
})


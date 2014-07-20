var expect = require('chai').expect
var assert = require('chai').assert
var it = require('./utils').tcit

var DateTime = require('..').date

describe('the DateTime function', function () {
  it('should be a constructor', function () {
    var depends = new DateTime(new Date())
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(DateTime)
  })

  it('should be a constructor even without new', function () {
    var depends = DateTime(new Date());
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

  describe('When reaching the limit datetime', function () {
    it('should emit a "change" event', function (done) {
      var limit = new Date(Date.now() + 100)
      var d = DateTime(limit)
      d.on('change', function () { done() })
    })

    it('should provide a changeinfo object', function (done) {
      var limit = new Date(Date.now() + 10)
      var d = DateTime(limit)
      d.on('change', expectations)

      function expectations (changeinfo) {
        expect(changeinfo).to.be.an('object')
        done()
      }
    })
  })

  describe('the provided changeinfo object', function () {
    var changeinfo
    var now
    var limit

    beforeEach(function (done) {
      now = new Date()
      limit = Date.now() + 10
      var d = DateTime(limit)
      d.on('change', function (ci) {
        changeinfo = ci
        done()
      })
    })

    it('should have a changeId property', function () {
      expect(changeinfo).to.have.property('changeId')
    })

    it('should have a startedAt property', function () {
      expect(changeinfo).to.have.property('startedAt')
      expect(+changeinfo.startedAt).to.equal(+now)
    })

    it('should have a endedAt property', function () {
      expect(changeinfo).to.have.property('endedAt')
      expect(+changeinfo.endedAt).to.equal(+limit)
    })


  })

  describe('interacting with setTimeout', function () {
    var oldTo = setTimeout
    var mock
    beforeEach(function () {
      mock = null
      global.setTimeout = function () {
        return mock.apply(this, arguments)
      }
    })
    afterEach(function () {
      global.setTimeout = oldTo
    })

    it('should call it with the appropriate delay', function (done) {
      var expected = 4789
      var limit = Date.now() + expected
      mock = function (fun, actual) {
        expect(actual).to.equal(expected)
        done()
      }
      var d = DateTime(limit)
    })
  })
})


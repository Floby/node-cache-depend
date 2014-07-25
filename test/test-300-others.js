var expect = require('chai').expect

var others = require('..').others
var manual = require('..').manual

describe('the Others watcher', function () {
  it('should be a constructor', function () {
    var depends = new others()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(others)
  })

  it('should be a constructor even without new', function () {
    var depends = others()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(others)
  });

  it('should accept any number of arguments as other watchers', null, function () {
  })
})



var it = require('./utils').tcit
var expect = require('chai').expect

var manual = require('..').manual

describe('the Manual watcher', function () {
  it('should be a constructor', function () {
    var depends = new manual()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(manual)
  })

  it('should be a constructor even without new', function () {
    var depends = manual()
    expect(depends).to.be.an('object')
    expect(depends.constructor).to.equal(manual)
  });

  it('should not have invalid truthy at first', function () {
    var depends = manual();
    expect(depends.invalid).not.to.be.ok
  })

  it('should emit change when calling method invalidate()', function (done) {
    var depends = manual();
    depends.once('change', function (info) {
      expect(info).to.be.an('object');
      expect(info).to.have.property('changeId');
      expect(info.changeId).to.equal('changeid');
      expect(depends.invalid).to.equal(true, 'invalid shoud be true')
      done();
    });
    depends.invalidate('changeid');
  })

  it('should not emit "change" twice when calling invalidate again', function (done) {
    var depends = manual();
    depends.invalidate(8);
    expect(function () {
      depends.once('change', function() {
        throw new Error('event change called');
      })
      depends.invalidate(1)
    }).not.to.throw(/change called/i)
    done();
  })

  it('should not emit "change" twice when calling cancel', function (done) {
    var depends = manual();
    depends.cancel();
    expect(function () {
      depends.once('change', function() {
        throw new Error('event change called');
      })
      depends.invalidate('a')
    }).not.to.throw(/change called/i)
    done();
  })

})




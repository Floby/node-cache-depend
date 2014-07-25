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

  it('should accept any number of arguments as other watchers', function () {
    var manuals = [1,2,3,4,5,6,7].map(manual);
    var depends = others.apply(null, manuals);
    expect(depends.dependencies().length).to.equal(7);
  })

  it('should relay a change event when one of its dependencies changes', function (done) {
    var manuals = [1,2,3,4,5,6,7].map(manual);
    var depends = others(manuals);
    depends.once('change', function(info) {
      expect(info).to.be.an('object');
      expect(info).to.have.property('changeId');
      expect(info.changeId).to.equal('888');
      expect(info.changed).to.equal(manuals[5]);
      done();
    });

    manuals[5].invalidate('888');
  });

  it('should not relay a second change event', function () {
    var manuals = [1,2,3].map(manual);
    var depends = others(manuals);
    manuals[0].invalidate('id');
    expect(function () {
      depends.on('change', function () {
        throw new Error('change event');
      })
      manuals[2].invalidate('8');
    }).not.to.throw('change event')

  });

  it('should cancel all other depdencies when one changes', function () {
    var manuals = [1,2,3].map(manual);
    var depends = others(manuals);
    var called = [];
    manuals.forEach(function (m) {
      var _cancel = m.cancel;
      m.cancel = function () {
        called.push(m);
        _cancel.call(m);
      }
    })

    manuals[1].invalidate('a');
    expect(called).to.have.length(2);
    expect(called[0]).to.equal(manuals[0]);
    expect(called[1]).to.equal(manuals[2]);
  });
})



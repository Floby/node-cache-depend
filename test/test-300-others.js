var sinon = require('sinon');
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
      manuals[2].emit('change');
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

  describe('.check()', function () {

    it('should return true if all children checks come positive', function (done) {
      var manuals = [1,2,3].map(manual)
      var depends = others(manuals);
      depends.check(function (good) {
        expect(good).to.equal(true);
        done();
      })
    });

    it('should call its callback as soon as one check comes false', function (done) {
      var manuals = [1,2,3].map(manual)
      var called = false
      manuals.forEach(function (m) {
        m.check = sinon.spy()
      });
      var depends = others(manuals);
      depends.check(function (isGood) {
        expect(called).to.equal(false, 'main callback called several times');
        called = true;
        expect(isGood).to.equal(false, 'isGood should be false');
        setTimeout(function (){
          manuals[1].check.callArgWith(0, true);
          done();
        }, 1);
      });

      setTimeout(function () {
        try {
          manuals.forEach(function (m) {
            expect(m.check.called).to.equal(true, 'check should have been called');
          });
          manuals[2].check.callArgWith(0, true);
          expect(called).to.equal(false, 'main callback should not get called');
          manuals[0].check.callArgWith(0, false);
        } catch(e) {
          done(e)
        }
      }, 0)
    });
  });

  describe('.add()', function () {
    it('adds the dependency to its list', function (done) {
      var manuals = [1,2,3].map(manual);
      var depends = others(manuals);
      depends.once('change', function(info) {
        expect(info).to.be.an('object');
        expect(info).to.have.property('changeId');
        expect(info.changeId).to.equal('888');
        expect(info.changed).to.equal(newManual);
        done();
      });

      var newManual = manual();
      depends.add(newManual);
      newManual.invalidate('888');
    });
  })
})



module.exports = Others

var util = require('util');
var EventEmitter = require('events').EventEmitter

function Others (list) {
  if(!Array.isArray(list)) {
    list = [].slice.call(arguments);
  }
  if(!(this instanceof Others)) return new Others(list);
  EventEmitter.call(this);

  this.dependencies = function () {
    return list;
  }

  var self = this;
  var _change = function (info, dependency) {
    info.changed = dependency;
    self.emit('change', info);
    list.forEach(function (dep) {
      if(dep === dependency) return;
      dep.cancel();
      _change = function () {}
    })
  };

  list.forEach(function (dependency) {
    dependency.once('change', function (info) {
      _change(info, dependency);
    });
  })

}
util.inherits(Others, EventEmitter);

Others.prototype.check = function (callback) {
  var count = 0, called = false, self = this;
  this.dependencies().forEach(function (dep) {
    ++count;
    process.nextTick(dep.check.bind(dep, onDepCheck));
  });

  function onDepCheck (isGood) {
    if(--count === 0 && !called) {
      return callback(true);
    }
    if(isGood === false) {
      called = true;
      self.invalid = true;
      return callback(false);
    }
  }
};

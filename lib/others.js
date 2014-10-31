module.exports = Others

var util = require('util');
var EventEmitter = require('events').EventEmitter

function Others (list) {
  if(!Array.isArray(list)) {
    list = [].slice.call(arguments);
  }
  if(!(this instanceof Others)) return new Others(list);
  EventEmitter.call(this);
  var self = this;

  var dependencies = [];

  this.dependencies = function () {
    return [].concat(dependencies);
  }

  this.add = function (watcher) {
    if(this.invalid) return;
    watcher.once('change', function (info) {
      _change(info, watcher);
    })
    dependencies.push(watcher);
  };

  var _change = function (info, dependency) {
    info.changed = dependency;
    self.invalid = true;
    self.emit('change', info);
    list.forEach(function (dep) {
      if(dep === dependency) return;
      dep.cancel();
      _change = function () {}
    })
  };

  list.forEach(this.add.bind(this));

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

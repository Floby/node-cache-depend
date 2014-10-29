module.exports = Manual

var util = require('util');
var EventEmitter = require('events').EventEmitter

function Manual () {
  if(!(this instanceof Manual)) return new Manual();
  EventEmitter.call(this);

  this.invalidate = function (id) {
    this.invalid = true;
    this.emit('change', { changeId: id});
    this.invalidate = function () {};
  }

  this.cancel = function () {
    this.invalidate = function () {};
  }
  this.check = function (cb) {
    cb(!this.invalid);
  }
}
util.inherits(Manual, EventEmitter);



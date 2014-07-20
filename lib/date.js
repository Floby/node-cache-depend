module.exports = DateTime

var util = require('util');
var EventEmitter = require('events').EventEmitter


function DateTime (date) {
  if(!(this instanceof DateTime)) return new DateTime(date);

  EventEmitter.call(this)

  var limit = new Date(date);
  this.limit = function () {
    return limit;
  }

  this._initiate(limit);
}
util.inherits(DateTime, EventEmitter)

DateTime.prototype._initiate = function (limit) {
  var now = new Date();
  var delay = limit.getTime() - now.getTime();
  var changeinfo = {
    changeId: null,
    startedAt: now,
    endedAt: limit
  };
  setTimeout(this.emit.bind(this, 'change', changeinfo), delay);
}

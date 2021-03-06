module.exports = DateTime

var util = require('util');
var EventEmitter = require('events').EventEmitter
var crypto = require('crypto');


function DateTime (date) {
  if(!(this instanceof DateTime)) return new DateTime(date);

  EventEmitter.call(this)

  var limit = new Date(date);
  this.limit = function () {
    return limit;
  }

  this.invalid = false;
  this._initiate(limit);
}
util.inherits(DateTime, EventEmitter)

DateTime.prototype.check = function check(cb) {
  cb(!this.invalid);
}

DateTime.prototype._initiate = function (limit) {
  var now = new Date();
  var delay = limit.getTime() - now.getTime();
  var changeinfo = {
    changeId: this._generateId(now, limit),
    startedAt: now,
    endedAt: limit
  };
  var timeout = setTimeout(this._change.bind(this, changeinfo), delay);
  this.cancel = function () {
    clearTimeout(timeout);
  }
}

DateTime.prototype._generateId = function _generateId(start, end) {
  start = start.toISOString();
  end = end.toISOString();
  var msg = start + '->' + end;
  return md5(msg);
}

DateTime.prototype._change = function _change(changeinfo) {
  this.invalid = true;
  this.emit('change', changeinfo)
}

function md5 (str) {
  var hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest();
}

module.exports = ETag

var util = require('util');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter
var request = require('request');

function ETag (url, tag, options) {
  if(!(this instanceof ETag)) return new ETag(url, tag, options);
  EventEmitter.call(this);
  options = options || {};
  options.interval = options.interval || 2000;

  this._url = url;
  this._originalEtag = tag;
  var self = this;
  var makeRequest = function () {
    request.head(url, self._inspectHead.bind(self));
  }
  this._interval = setInterval(makeRequest, options.interval);
  makeRequest()
}
util.inherits(ETag, EventEmitter);

ETag.prototype._inspectHead = function _inspectHead(err, response) {
  if(err) return this.emit('error', err);
  var newETag = response.headers.etag;
  if(newETag !== this._originalEtag) {
    this._finish(this._originalEtag, newETag);
  }
}

ETag.prototype._finish = function (oldETag, newETag) {
  this.emit('change', {
    changeId: this._generateId(oldETag, newETag),
    oldETag: oldETag,
    newETag: newETag
  });
  clearInterval(this._interval);
  this._interval = null;
}

ETag.prototype._generateId = function (o, n) {
  var msg = o + '->' + n;
  return md5(msg);
}

ETag.prototype.cancel = function cancel() {
  clearInterval(this._interval);
}

function md5 (str) {
  var hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest();
}


module.exports = ETag

var util = require('util');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter
var url = require('url');
var protocols = {
  'http:': require('http'),
  'https:': require('https')
};

function ETag (url, tag, options) {
  if(!(this instanceof ETag)) return new ETag(url, tag, options);
  EventEmitter.call(this);
  options = options || {};
  options.interval = options.interval || 2000;

  this._requestOptions = require('url').parse(url);
  this._requestOptions.method = 'HEAD';
  var httpModule = protocols[this._requestOptions.protocol]
  this.invalid = false;
  this._originalEtag = tag;
  var self = this;
  var makeRequest = function (notify) {
    httpModule.request(self._requestOptions)
      .on('response', onResponse.bind(null, null))
      .on('error', onResponse.bind(null))
      .end()

    function onResponse (err, response) {
      self._inspectHead(err, response, notify);
    }
  }

  this.check = makeRequest;

  this._interval = setInterval(makeRequest, options.interval);
  makeRequest()
}
util.inherits(ETag, EventEmitter);

ETag.prototype._inspectHead = function _inspectHead(err, response, notify) {
  if(err) return this.emit('error', err);
  var newETag = response.headers.etag;
  if(newETag !== this._originalEtag) {
    this._finish(this._originalEtag, newETag);
    if(notify) notify(!this.invalid);
  }
}

ETag.prototype._finish = function (oldETag, newETag) {
  this.invalid = true;
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

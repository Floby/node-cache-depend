module.exports = ETag

var request = require('request');

function ETag (url, tag, options) {
  if(!(this instanceof ETag)) return new ETag(url, tag, options);
  options = options || {};
  options.interval = options.interval || 2000;

  this._url = url;
  var makeRequest = function () {
    request.head(url);
  }
  this._interval = setInterval(makeRequest, options.interval);
  makeRequest()
}

ETag.prototype.cancel = function cancel() {
  clearInterval(this._interval);
}

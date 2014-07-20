module.exports = ETag

function ETag (url, tag) {
  if(!(this instanceof ETag)) return new ETag(url, tag);
}

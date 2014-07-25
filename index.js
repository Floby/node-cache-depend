module.exports = CacheDepend;


function CacheDepend () {
}

CacheDepend.etag = require('./lib/etag');
CacheDepend.date = require('./lib/date');
CacheDepend.others = require('./lib/others');
CacheDepend.manual = require('./lib/manual');

var trycatch = require('trycatch');

exports.tcit = function try_catch_it(desc, test) {
  if(!test) return it.call(this, desc, null);
  if(test.length === 0) {
    return it.call(this, desc, test);
  }
  if (!test) return it.call(this, desc);
  it(desc, function (done) {
    trycatch(test.bind(this, done), done);
  });
}



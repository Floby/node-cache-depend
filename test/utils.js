var trycatch = require('trycatch');

exports.tcit = function try_catch_it(desc, test) {
  if(!test) return it(desc, null);
  if(test.length === 0) {
    return it(desc, test);
  }
  if (!test) return it(desc);
  it(desc, function (done) {
    trycatch(test.bind(null, done), done);
  });
}



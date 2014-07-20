module.exports = DateTime

function DateTime (date) {
  if(!(this instanceof DateTime)) return new DateTime(date);

  this._limit = new Date(date);
}

var p = DateTime.prototype;

p.limit = function limit() {
  return this._limit;
}

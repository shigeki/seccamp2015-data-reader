var assert = require('assert');
exports.DataReader = DataReader;

function DataReader(data) {
  assert(Buffer.isBuffer(data));
  this.data = data;
  this.len = data.length;
  this.pos = 0;
}

DataReader.prototype.readBytes = function(size) {
  if (size > this.bytesRemaining())
    return null;

  var buf = this.data.slice(this.pos, this.pos + size);
  this.pos += size;
  return buf;
};

DataReader.prototype.readVector = function(floor, ceiling) {
  assert(this.bytesRemaining() >= 1);
  assert(typeof floor === 'number' && typeof ceiling, 'number');
  var vector_length = Math.ceil(ceiling.toString(2).length/8);
  var length = this.readBytes(vector_length).readUIntBE(0, vector_length);
  assert(length >= floor && ceiling >= length);
  return this.readBytes(length);
};

DataReader.prototype.bytesRemaining = function() {
  return this.len - this.pos;
};

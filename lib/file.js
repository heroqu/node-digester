const { createReadStream } = require('fs');
const streamDigester = require('./stream');

/**
 * make Digest instance, ready to digest a file
 */
module.exports = (createHash, format) => async (path, options) =>
  streamDigester(createHash, format)(createReadStream(path, options));

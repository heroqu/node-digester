const hashThrough = require('hash-through');
const devNull = require('./devnull');
const eventPromise = require('./event-promise');

/**
 * make Digest instance, ready to digest a stream
 *
 * The original stream gets consumed during this operation,
 * i.e. it gets read to the very end.
 */
module.exports = (createHash, format) => async readableStream => {
  // add more streams to the pipe
  const ht = hashThrough(createHash);
  const devnull = devNull();

  // consume it all
  readableStream.pipe(ht).pipe(devnull);

  // wait for streaming to finish
  await eventPromise(ht, 'finish');

  // extract the digest value
  return ht.digest(format);
};

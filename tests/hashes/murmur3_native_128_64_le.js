const murmur = require('murmurhash-native/stream');

function createHash() {
  // algorithm, seed and endianness - do affect the results!
  return murmur.createHash('murmurHash128x64', {
    seed: 0,
    endianness: 'LE',
  });
}

module.exports = createHash;

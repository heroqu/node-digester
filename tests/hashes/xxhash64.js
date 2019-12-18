const { XXHash64 } = require('xxhash');

const SEED = 0x00000000;

module.exports = () => new XXHash64(SEED);

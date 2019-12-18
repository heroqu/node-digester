const { MetroHash128 } = require('metrohash');

const SEED = 0;

module.exports = () => new MetroHash128(SEED);

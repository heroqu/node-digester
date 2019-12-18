const { Writable } = require('readable-stream');

/**
 * if setImmediate is not available in global context,
 * use the surrogate
 */
const setImmediateFn = setImmediate || (fn => setTimeout(fn, 0));

/**
 * A sink or a black hole for consuming streams
 */
module.exports = opts => {
  const ws = new Writable(opts);

  /* eslint no-underscore-dangle: ["error", { "allow": ["_write"] }] */
  ws._write = (chunk, options, cb) => {
    setImmediateFn(cb);
  };

  return ws;
};

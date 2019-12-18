/**
 * Wrap an event emmiting object event handler in such a way,
 * that when the event is detected, the promise get resolved.
 */
module.exports = async (emitter, eventName) =>
  new Promise(resolve => {
    emitter.on(eventName, (...args) => {
      resolve(args);
    });
  });

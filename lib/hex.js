/**
 * Same factories but with 'hex' digest format preselected
 */
const fileDigesterFull = require('./file');
const streamDigesterFull = require('./stream');

module.exports = {
  fileDigester: createHash => fileDigesterFull(createHash, 'hex'),
  streamDigester: createHash => streamDigesterFull(createHash, 'hex'),
};

/**
 * Same factories but with 'hex' digest format preselected
 */
const fileDigesterFull = require('./../lib/file');
const streamDigesterFull = require('./../lib/stream');

module.exports = {
  fileDigester: createHash => fileDigesterFull(createHash, 'hex'),
  streamDigester: createHash => streamDigesterFull(createHash, 'hex'),
};

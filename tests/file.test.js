const path = require('path');
const { createHash } = require('crypto');
const { fileDigester } = require('../lib/hex');

const EMPTY_FILE = path.resolve(__dirname, './samples/empty.txt');
const SAMPLE_FILE = path.resolve(__dirname, './samples/sample.txt');

describe('File Digester', () => {
  it('should work with empty file & sha256 algorithm', async () => {
    // make a stream digester instance
    const digester = fileDigester(() => createHash('sha256'));

    // wait for the digest
    const result = await digester(EMPTY_FILE);
    const expected =
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    expect(result).toEqual(expected);
  });

  it('should work with sample file & sha256 algorithm', async () => {
    // make a stream digester instance
    const digester = fileDigester(() => createHash('sha256'), 'hex');

    // wait for the digest
    const result = await digester(SAMPLE_FILE);
    const expected =
      '1b84ae5fc0f2813dba68d20b159f8e0635a75c1d8cf175275da2daac40b131bd';

    expect(result).toEqual(expected);
  });

  it('should work with sample stream & ripemd160 algorithm', async () => {
    // make a stream digester instance
    const digester = fileDigester(() => createHash('ripemd160'));

    // wait for the digest
    const result = await digester(SAMPLE_FILE);
    const expected = '4fff5196ef6058c0af1ef4a2b82b75ea3afc3e1b';

    expect(result).toEqual(expected);
  });

  it('should work with sample stream & md5 algorithm', async () => {
    // make a stream digester instance
    const digester = fileDigester(() => createHash('md5'));

    // wait for the digest
    const result = await digester(SAMPLE_FILE);
    const expected = '6bf0a10e36481c130fb71d6c36a93da5';

    expect(result).toEqual(expected);
  });
});

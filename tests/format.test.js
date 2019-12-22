const { Readable } = require('stream');
const { createHash } = require('crypto');
const { streamDigester } = require('../lib');

const CREATE_HASH_FN = () => createHash('sha1');

const sampleText = 'On 25 March an unusually strange event occurred';

describe('Stream Digester', () => {
  describe(`with crypto.createHash('sha1') algorithm`, () => {
    it(`should work with 'hex' format`, async () => {
      // make a stream digester instance
      const digester = streamDigester(CREATE_HASH_FN, 'hex');

      // make a sample readable stream
      const rs = Readable.from([]);

      // wait for the digest
      const result = await digester(rs);
      const expected = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

      expect(result).toEqual(expected);
    });

    it(`should work with 'base64' format`, async () => {
      // make a stream digester instance
      const digester = streamDigester(CREATE_HASH_FN, 'base64');

      // make a sample readable stream
      const rs = Readable.from(sampleText);

      // wait for the digest
      const result = await digester(rs);
      const expected = 'ld9K0PKq1gTfQIGzYMoNy2bw4xg=';

      expect(result).toEqual(expected);
    });

    it(`should work with 'latin1' format`, async () => {
      // make a stream digester instance
      const digester = streamDigester(CREATE_HASH_FN, 'latin1');

      // make a sample readable stream
      const rs = Readable.from(sampleText);

      // wait for the digest
      const result = await digester(rs);

      expect(typeof result).toEqual('string');
      expect(Buffer.from(result, 'utf-8')).toEqual(
        Buffer.from([
          194,
          149,
          195,
          159,
          74,
          195,
          144,
          195,
          178,
          194,
          170,
          195,
          150,
          4,
          195,
          159,
          64,
          194,
          129,
          194,
          179,
          96,
          195,
          138,
          13,
          195,
          139,
          102,
          195,
          176,
          195,
          163,
          24,
        ]),
      );
    });

    it(`should return a Buffer if used without format`, async () => {
      // make a stream digester instance
      const digester = streamDigester(CREATE_HASH_FN);

      // make a sample readable stream
      const rs = Readable.from(sampleText);

      // wait for the digest
      const result = await digester(rs);
      const expected = Buffer.from([
        149,
        223,
        74,
        208,
        242,
        170,
        214,
        4,
        223,
        64,
        129,
        179,
        96,
        202,
        13,
        203,
        102,
        240,
        227,
        24,
      ]);

      expect(result).toEqual(expected);
    });
  });
});

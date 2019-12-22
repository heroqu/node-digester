const { Readable } = require('stream');
const { createHash } = require('crypto');
const { streamDigester } = require('../hex');

// non-cryptographic hash algorothms
const metrohash = require('./hashes/metrohash');
const xxhash64 = require('./hashes/xxhash64');
const murmur3_native_128_86_le = require('./hashes/murmur3_native_128_86_le');
const murmur3_native_128_64_le = require('./hashes/murmur3_native_128_64_le');

const sampleText = 'On 25 March an unusually strange event occurred';

describe('Stream Digester with hex format preselected', () => {
  describe('with Node.crypto hashes', () => {
    it('should work with zero length stream & sha256 algorithm', async () => {
      // make a stream digester instance
      const digester = streamDigester(() => createHash('sha256'));

      // make a sample readable stream
      const rs = Readable.from([]);

      // wait for the digest
      const result = await digester(rs);
      const expected =
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

      expect(result).toEqual(expected);
    });

    it('should work with sample stream & sha256 algorithm', async () => {
      // make a stream digester instance
      const digester = streamDigester(() => createHash('sha256'));

      // make a sample readable stream
      const rs = Readable.from(sampleText);

      // wait for the digest
      const result = await digester(rs);
      const expected =
        'bf857bed36e6bdd0dc702b9dc8f0db2911954b37c05ec879d4c0634d4bd58aab';

      expect(result).toEqual(expected);
    });

    it('should work with sample stream & ripemd160 algorithm', async () => {
      // make a stream digester instance
      const digester = streamDigester(() => createHash('ripemd160'));

      // make a sample readable stream
      const rs = Readable.from(sampleText);

      // wait for the digest
      const result = await digester(rs);
      const expected = '6b05e371e293ec40ad02f064351aa115bf201872';

      expect(result).toEqual(expected);
    });

    it('should work with sample stream & md5 algorithm', async () => {
      // make a stream digester instance
      const digester = streamDigester(() => createHash('md5'));

      // make a sample readable stream
      const rs = Readable.from(sampleText);

      // wait for the digest
      const result = await digester(rs);
      const expected = 'f291989216ac5760078e1ae111be4541';

      expect(result).toEqual(expected);
    });
  });

  describe('with non-cryptographic hashes', () => {
    describe('metrohash128 algorithm', () => {
      it('should work with empty stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(metrohash);

        // make a sample readable stream
        const rs = Readable.from([]);

        // wait for the digest
        const result = await digester(rs);
        const expected = 'cbd1413dcaf30500b65fc68446b10646';

        expect(result).toEqual(expected);
      });

      it('should work with sample stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(metrohash);

        // make a sample readable stream
        const rs = Readable.from(sampleText);

        // wait for the digest
        const result = await digester(rs);
        const expected = '23c68920f355a4aa8ed035ed7ddcbe8f';

        expect(result).toEqual(expected);
      });
    });

    describe('xxhash64 algorithm', () => {
      it('should work with empty stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(xxhash64);

        // make a sample readable stream
        const rs = Readable.from([]);

        // wait for the digest
        const result = await digester(rs);
        const expected = '99e9d85137db46ef';

        expect(result).toEqual(expected);
      });

      it('should work with sample stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(xxhash64);

        // make a sample readable stream
        const rs = Readable.from(sampleText);

        // wait for the digest
        const result = await digester(rs);
        const expected = 'f2f83c82a419374d';

        expect(result).toEqual(expected);
      });
    });

    describe('murmur3_native_128_86_le algorithm', () => {
      it('should work with empty stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(murmur3_native_128_86_le);

        // make a sample readable stream
        const rs = Readable.from([]);

        // wait for the digest
        const result = await digester(rs);
        const expected = '00000000000000000000000000000000';

        expect(result).toEqual(expected);
      });

      it('should work with sample stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(murmur3_native_128_86_le);

        // make a sample readable stream
        const rs = Readable.from(sampleText);

        // wait for the digest
        const result = await digester(rs);
        const expected = '1b7fa7ff986f418be95187ad180c9125';

        expect(result).toEqual(expected);
      });
    });

    describe('murmur3_native_128_64_le algorithm', () => {
      it('should work with sample stream', async () => {
        // make a stream digester instance
        const digester = streamDigester(murmur3_native_128_64_le);

        // make a sample readable stream
        const rs = Readable.from(sampleText);

        // wait for the digest
        const result = await digester(rs);
        const expected = '104fb86ca411ef38e7cd2f1681253788';

        expect(result).toEqual(expected);
      });
    });
  });
});

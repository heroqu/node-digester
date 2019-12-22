# Digester

Digester is a little library to compute hash digests from readable streams or files.

Reads files as streams, hence large files are supported.

Use any hash algorithms of your choice, including non-cryptographic ones.

## Usage

To get the digest of a file:

```javascript
const { fileDigester } = require('digester');
const digester = fileDigester(someCreateHashFunc, format);

// or, for most common 'hex' format there is a curried version
// with 'hex' pre-selected:
const { fileDigester } = require('digester/hex');
const digester = fileDigester(someCreateHashFunc);

// and then
const digestPromise = digester(filePath);
```

Similarly, to digest a stream:

```javascript
const { streamDigester } = require('digester');
const digester = streamDigester(someCreateHashFunc, format);

// or, with pre-selected 'hex' format:
const { streamDigester } = require('digester/hex');
const digester = streamDigester(someCreateHashFunc);

const digestPromise = digester(someReadableStream);
```

## Full working examples

### Digesting files

We have to prepare some hashing function in advance. For the sake of an example let's use one of the algorithms from Node.crypto module, but that is not at all required - any hashing algorithm would do, see [Hash algorithms section](#hash-algorithms) below for details:

```javascript
const { fileDigester } = require('digester/hex');

// use md5 hash algorithm from Node.crypto as an example
const { createHash } = require('crypto');
const createHashFn = () => createHash('md5');

// create a digester instance
const digester = fileDigester(createHashFn);

// use current script file as an example
const filePath = __filename;

// Now `digester(filePath)` will return a promise of digest value,
// so we can consume it as any other promise
digester(filePath).then(digest => {
  console.log(digest);
  // output something like:
  // f291989216ac5760078e1ae111be4541
});
```

The time needed for this promise to resolve depends on file system and I/O speed, naturally. But as we read the file as stream under the hood, the memory consumption is going to be minimal.

### Digesting streams

Is almost identical:

```javascript
const { streamDigester } = require('digester/hex');

const { createHash } = require('crypto');
const createHashFn = () => createHash('sha256');

const digester = streamDigester(createHashFn);

const { Readable } = require('stream');
const rs = Readable.from('Make a sample readable stream from this text');

digester(rs).then(console.log);

// output:
// acdc094f7e69cf861abe8aea7730ebc7084f6278c55d5f858ad87df6f7b8aef8
```

### Why waste original stream?

Needless to say that the original stream is going to be consumed in this digesting procedure.

If for some reason that is not desirable, one might consider a **slightly different approach**: compute the hash digest _on the fly_, while it is being naturally consumed as it was implied by application logic. To do that one can use [hash-through](http://nodejs.com/heroqu/hash-through) module, the one that is actually being used by the Digester under the hood.

Consider an example:

```javascript
const hashThrough = require('hash-through');

const { createHash } = require('crypto');
const createHashFn = () => createHash('sha256');

const ht = hashThrough(createHashFn);

// just created a PassThrough stream able to digest the data traffic
// on the fly, while application does consume it:

// .pipe(ht) acts like man-in-the-middle
someSrc.pipe(ht).pipe(someDest);

const digestPromise = new Promise(resolve => {
  ht.on('finish', () => {
    resolve(ht.digest('hex'));
  });
});

digestPromise.then(digest => {
  // and we got the digest here
  console.log(digest);
  // output:
  // acdc094f7e69cf861abe8aea7730ebc7084f6278c55d5f858ad87df6f7b8aef8
});
```

Imagine you receive audio stream from one remote and pass it through to some other remote. With this approach you just tap and when the streaming is over you got the hash digest ready. You application logic doesn't suffer.

## Hash algorithms

One has to prepare `createHash` function in advance, but that is not difficult. Here are some examples:

### Algorithms from Node.crypto

That is the easiest:

```javascript
const { createHash } = require('crypto');

const createHashFn = () => createHash(<algorithm name>);
```

To see the list of currently supported algorithms do:

```javascript
const { getHashes } = require('crypto');
console.log(getHashes());
```

That will print out a long list (at the time of writing):

```shell
[
  'RSA-MD4',
  'RSA-MD5',
  'RSA-MDC2',
  'RSA-RIPEMD160',
  'RSA-SHA1',
  'RSA-SHA1-2',
  'RSA-SHA224',
  'RSA-SHA256',
  'RSA-SHA3-224',
  'RSA-SHA3-256',
  'RSA-SHA3-384',
  'RSA-SHA3-512',
  'RSA-SHA384',
  'RSA-SHA512',
  'RSA-SHA512/224',
  'RSA-SHA512/256',
  'RSA-SM3',
  'blake2b512',
  'blake2s256',
  'id-rsassa-pkcs1-v1_5-with-sha3-224',
  'id-rsassa-pkcs1-v1_5-with-sha3-256',
  'id-rsassa-pkcs1-v1_5-with-sha3-384',
  'id-rsassa-pkcs1-v1_5-with-sha3-512',
  'md4',
  'md4WithRSAEncryption',
  'md5',
  'md5-sha1',
  'md5WithRSAEncryption',
  'mdc2',
  'mdc2WithRSA',
  'ripemd',
  'ripemd160',
  'ripemd160WithRSA',
  'rmd160',
  'sha1',
  'sha1WithRSAEncryption',
  'sha224',
  'sha224WithRSAEncryption',
  'sha256',
  'sha256WithRSAEncryption',
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'sha384',
  'sha384WithRSAEncryption',
  'sha512',
  'sha512-224',
  'sha512-224WithRSAEncryption',
  'sha512-256',
  'sha512-256WithRSAEncryption',
  'sha512WithRSAEncryption',
  'shake128',
  'shake256',
  'sm3',
  'sm3WithRSAEncryption',
  'ssl3-md5',
  'ssl3-sha1',
  'whirlpool'
]
```

and all of them are ready to be used here.

### Other algorithms

There are many other libraries that provide hashing algorithms, but to plug then in here we have to make sure they are in a form of createHash function. Such a function should return a so called Hash object, an object similar to how it is made in Node.crypto (see [Hash class in Node docs](https://nodejs.org/api/crypto.html#crypto_class_hash)). Basically, Hash should be a Transform stream and support `update(chunk)` and `digest(format)` methods.

Good news is that many existing implementations are able to produce that out-of-the-box or with little tinkering.

Let's try to plug in [metrohash npm module](https://www.npmjs.com/package/metrohash) as an example. As stated on its site, the module is a "wrapper around [MetroHash algorithm](https://github.com/jandrewrogers/MetroHash)", which is a non-cryptographic hashing algorithm by the way.

Here we are:

```javascript
const { MetroHash128 } = require('metrohash');
// need some seed, use zero for simplicity
const SEED = 0;
const createHashMetro = () => new MetroHash128(SEED);
```

And we are done. Now we can use it:

```javascript
const { streamDigester } = require('digester');
const digester = streamDigester(createHashMetro);
// and so on
```

A few more implementation examples can be found in the [tests directory](https://github.com/heroqu/node-digester/tree/master/tests).

## Digest formats

If we use main constructor, then we are free to either specify `format` parameter explicitly:

```javascript
const { fileDigester } = require('digester');
const digester = streamDigester(createHashFunc, <format>);
// or
const { streamDigester } = require('digester');
const digester = streamDigester(createHashFunc, <format>);
```

or even  omit it, in some cases.

The point is, it is `createHashFunc` that is responsible for producing a so called Hash object with its `Hash.digest(format)` method. Therefore the question of what formats are supported and if we can safely omit it - depends solely on that Hash implementation.

### Formats for Node.crypto hashes

E.g. if we choose an algorithm implementation from Node.crypto module (`const createHashFunc = () => crypto.createHash(<format>)`), then:

1. if format parameter is omitted, then bare `Buffer` is returned as digest value.

Consider an example:

```javascript
const { fileDigester } = require('digester');
const { createHash } = require('crypto');
const createHashFn = () => createHash('ripemd160');
const digester = fileDigester(createHashFn); // format parameter is omitted
digester(__filename).then(console.log);
// output:
// <Buffer 72 e9 3e ce 63 e1 5d 5d ca f3 da 62 d8 cd f9 67 87 3c 56 34>
```

2. if format parameter is there, then `Buffer.toString(format)` is going to be called internally, so one can use any format value `Buffer.toString` method does support:

```
'hex'
'utf8'
'ascii'
'base64'
'latin1' 
'binary' (alias to 'latin1')
```

See [Node official docs](https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end) for details.

### Formats for other hashes

With other hash algorithm implementations one has to examine digest(format) method of Hash object, that particular createHashFunc is supposed to return.

### Pre-selected HEX format

As already mentioned, one can take advantage of curried version of the lib with 'hex' preselected:

```javascript
const { ... } = require('digester/hex');
```

Just be sure the Hash object that is returned from particular createHashFunc implementation does indeed support this format, i.e. Hash.digest('hex') does not break. If it does, then switch back to non-curried version.

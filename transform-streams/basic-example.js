import { Transform } from 'stream';

class TransformStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    console.log('Writable: Make some side effect with ', chunk);
    this.push(chunk);
    callback();
  }

  // optional method
  _flush(callback) {
    callback && callback();
  }
}

const ts = new TransformStream();

ts.on('data', (chunk) => {
  console.log('Readable > ', chunk);
});

ts.write({ item: '1' }, 'utf8');
ts.write({ item: '2' }, 'utf8');
ts.write({ item: '3' }, 'utf8');
ts.end();

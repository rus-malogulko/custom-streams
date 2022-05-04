import { Duplex } from 'stream';

class DuplexStream extends Duplex {
  constructor(options) {
    super({ ...options, objectMode: true, close: false });
    this.data = [];
  }

  _read() {
    if (!this.data.length) {
      return this.push(null);
    }
    this.push(this.data.shift());
  }

  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    console.log('Writable: Make some side effect with ', chunk);
    callback();
  }
}

const ds = new DuplexStream();

ds.on('data', (chunk) => {
  console.log('Readable > ', chunk);
});

ds.write({ item: '1' }, 'utf8');
ds.write({ item: '2' }, 'utf8');
ds.write({ item: '3' }, 'utf8');
ds.end();

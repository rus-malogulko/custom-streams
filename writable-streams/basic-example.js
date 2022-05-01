import { Writable } from 'stream';

class WritableStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.data = [];
  }
  async _write(chunk, encoding, callback) {
    await this.data.push(chunk);
    console.log('Make some side effect with: ', chunk);
    callback();
  }
}

const ws = new WritableStream();
ws.on('finish', () => {
  console.log('Finish writing stream');
  console.log('Written records: ', ws.data.length);
});

ws.write({ item: '1' }, 'utf8', () => console.log('Callback > 1'));
ws.write({ item: '2' }, 'utf8', () => console.log('Callback > 2'));
ws.write({ item: '3' }, 'utf8', () => console.log('Callback > 3'));
ws.end();
// ws.write({ item: '4' }, 'utf8', () => console.log('Callback > 3')); // >> Error: write after end

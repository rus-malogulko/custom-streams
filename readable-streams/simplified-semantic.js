import { Readable } from 'stream';

class ReadableStream extends Readable {
  constructor(data) {
    super();
    this.data = data;
  }
  _read() {
    this.push(this.data.shift());
    if (!this.data.length) {
      this.push(null);
    }
  }
}
const rs1 = new ReadableStream(['a', 'b', 'c']);

// is equal to:

const data = ['a', 'b', 'c'];
const rs2 = new Readable({
  read() {
    this.push(data.shift());
    if (!data.length) {
      this.push(null);
    }
  }
})

// RESULTS:
rs1.pipe(process.stdout);
rs2.pipe(process.stdout);

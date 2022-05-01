import { Readable } from 'stream';

const data1 = new Array(10000).fill(0).map((_, i) => String(i));
const data2 = new Array(10000).fill(0).map((_, i) => String(i));

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

// NON-FLOWING MODE (manually calling read)
const rs = new ReadableStream(data1).on('readable', () => {
  let chunk;
  while (null !== (chunk = rs.read('utf8'))) {
    console.log(chunk.toString());
  }
});

// FLOWING MODE (automatic read)
new ReadableStream(data2).on('data', chunk => {
  console.log(chunk.toString());
});

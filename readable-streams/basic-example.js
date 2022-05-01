import { Readable } from 'stream';

let data = [];
for (let i = 0; i < 10000; i++) {
  data.push(String(i));
}

class ReadableStream extends Readable {
  _read() {
    this.push(data.shift());
    if (!data.length) {
      this.push(null);
    }
  }
}

export default ReadableStream;

const rs = new ReadableStream('utf8');
rs.on('readable', () => {
  let chunk;
  while (null !== (chunk = rs.read('utf8'))) {
    console.log(chunk.toString(), '-');
  }
});

import { Readable, Writable, Transform } from 'stream';

function concatItems(files) {
  return new Promise((resolve, reject) => {
    const destStream = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        console.log('Writing', chunk);
        callback();
      },
     });

    Readable.from(files)
      .pipe(new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
          const src = new Readable(
            { objectMode: true, read() { new Array(3).fill('').forEach(() => this.push('test')); this.push(null); } }
          );
          console.log('Transform:', chunk);
          src
            .pipe(destStream, { end: false });
          src.on('error', callback);
          src.on('end', callback);
        }
      }))
      .on('error', error => {
        console.log('error', error)
        reject();
      })
      .on('finish', () => {
        destStream.end();
        console.log('Destination stream ended');
        resolve();
      });
  })
}

concatItems([1, 2, 3, 4, 5]).then(() => console.log('Promise resolved after all files were processed'));

// RESULT:

// Writing test
// Writing test
// Writing test
// Transform: 2
// Writing test
// Writing test
// Writing test
// Transform: 3
// Writing test
// Writing test
// Writing test
// Transform: 4
// Writing test
// Writing test
// Writing test
// Transform: 5
// Writing test
// Writing test
// Writing test
// Destination stream ended
// Promise resolved after all files were processed

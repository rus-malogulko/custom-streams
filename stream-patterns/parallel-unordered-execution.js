import { Transform, Readable } from 'stream';

console.time('timer');
class ParallelStream extends Transform {
  constructor(userTransform, options) {
    super({ ...options, objectMode: true });

    this.userTransform = userTransform;
    this.counter = 0;
    this.terminator = null;
  }

  _transform(chunk, encoding, callback) {
    this.counter++;
    this.userTransform(
      chunk,
      encoding,
      this.push.bind(this),
      this._onComplete.bind(this)
    )
    callback();
  }

  _flush(done) {
    if (this.counter > 0) {
      this.terminator = done;
    } else {
      done();
    }
  }

  _onComplete() {
    this.counter--;

    if (this.counter === 0) {
      this.terminator();
      console.timeLog('timer', 'FINISH');
    }
  }
}

Readable.from(['a', 'b', 'c', 'd', 'e', 'f'])
  .pipe(new ParallelStream((chunk, encoding, push, done) => {
    setTimeout(() => {
      console.timeLog('timer', chunk);
      push(chunk);
      done();
    }, 1000);
  }));

// RESULT:

// timer: 1.014s a
// timer: 1.015s b
// timer: 1.015s c
// timer: 1.015s d
// timer: 1.015s e
// timer: 1.015s f
// timer: 1.015s FINISH

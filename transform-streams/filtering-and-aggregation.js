import { Transform } from 'stream';

class FilterStream extends Transform {
  constructor(predicate, options) {
    super({ ...options, objectMode: true });
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    this.predicate = predicate;
    this.data = [];
  }

  _transform(chunk, encoding, callback) {
    this.data = chunk.toString().split(',');
    if (this.data.length) {
      this.data.forEach(item => {
        if (this.predicate(item)) {
          this.push(item);
        }
      })
    }
    callback && callback();
  }
}

class AggregationStream extends Transform {
  constructor(aggregator, options) {
    super({ ...options, objectMode: true });
    if (typeof aggregator !== 'function') {
      throw new TypeError('aggregator must be a function');
    }
    this.aggregator = aggregator;
    this.data = [];
  }

  _transform(chunk, encoding, callback) {
    this.data.push(chunk);
    callback && callback();
  }

  _flush(callback) {
    this.push(this.aggregator(this.data));
    callback && callback();
  }
}

const filter = new FilterStream(chunk => chunk.startsWith('a'));
const aggregation = new AggregationStream(chunks => chunks.join(', '));

process.stdin
  .pipe(filter)
  .pipe(aggregation)
  .pipe(process.stdout);

// echo "ambassador,absence,bottle,drink" | node ./transform-streams/filtering-and-aggregation.js

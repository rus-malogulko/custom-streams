import { Readable } from 'stream';

const data = new Array(10000).fill(0).map((_, i) => String(i));

const rs = Readable.from(data);

rs.pipe(process.stdout);

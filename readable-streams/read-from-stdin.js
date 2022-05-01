process.stdin
  .on('data', function(chunk) {
    console.log(chunk.toString());
  })
  .on('end', function() {
    console.log('End reading stream');
  });


  // (shell) ls -lah | node read-from-stdin.js

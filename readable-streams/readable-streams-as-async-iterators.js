async function main() {
  for await (const chunk of process.stdin) {
    console.log(chunk.toString());
  }
  console.log('End reading stream');
}

main();

// (shell) ls -lah | node readable-streams-as-async-iterators.js

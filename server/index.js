// import DiffMatchPatch from 'diff-match-patch';

// const dmp = new DiffMatchPatch();
// const diff = dmp.diff_main('dogs bark', 'cats bark');
// dmp.diff_cleanupSemantic(diff);
 
// // You can also use the following properties:
// DiffMatchPatch.DIFF_DELETE = -1;
// DiffMatchPatch.DIFF_INSERT = 1;
// DiffMatchPatch.DIFF_EQUAL = 0;

// const patches = dmp.patch_make(diff);

// const results = dmp.patch_apply(patches, 'dogs bark');

// console.log(results[0]);
// console.log("diff", JSON.stringify(diff), JSON.stringify(patches), JSON.stringify(results));

const io = require('socket.io')();

io.on('connection', (socket) => {
  socket.on('subscribeToTimer', (interval) => {
    console.log('socket is subscribing to timer with interval ', interval);
    setInterval(() => {
      socket.emit('timer', new Date());
    }, interval);
  });

  socket.on('message', (msg) => {
    console.log(msg);
    io.emit('broadcast', msg);
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
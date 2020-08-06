import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

const io = require('socket.io')();

let text = "dog's bark";

io.on('connection', (socket) => {
  socket.on('subscribeToText', () => {
    console.log('socket is subscribing to text');
    setTimeout(() => {
      socket.emit('init', text);
    }, 0);
  });
  
  socket.on('message', (msg) => {
    console.log(msg);
    text = msg;
    
    const diff = dmp.diff_main(text, msg);
    // dmp.diff_cleanupSemantic(diff);
    const patches = dmp.patch_make(diff);
    const results = dmp.patch_apply(patches, text);

    text = results[0]

    io.emit('broadcast', text);
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
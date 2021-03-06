import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

const io = require('socket.io')();

let text = `hola
chao`;

io.on('connection', (socket) => {
  socket.on('subscribeToText', () => {
    console.log('socket is subscribing to text');
    setTimeout(() => {
      socket.emit('init', text);
    }, 0);
  });
  
  socket.on('message', ({ message, previousMessage }) => {
    const oldText = text;

    var diff = dmp.diff_main(previousMessage, message, true);

    var patch_list = dmp.patch_make(previousMessage, message, diff);
    var patch_text = dmp.patch_toText(patch_list);
    var patches = dmp.patch_fromText(patch_text);
    var results = dmp.patch_apply(patches, text);
    
    text = results[0];
    console.log("previousMsg", previousMessage);
    
    console.log(
      "\nmsg", "\n--final--\n",
      results[0],
      "\n--previous--\n",
      oldText,
      "\n--msg--\n",
      message,
      "\n--previousMessage--\n",
      previousMessage,
      "\n--\n",
    );
    io.emit('broadcast', results[0]);
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
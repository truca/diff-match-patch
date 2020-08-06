import openSocket from 'socket.io-client';

function subscribe(cb: Function) {
  const  socket = openSocket('http://localhost:8000');
  socket.on('init', (text: string) => cb(null, text));
  socket.emit('subscribeToText');

  return socket;
}

export { subscribe };
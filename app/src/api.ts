import openSocket from 'socket.io-client';

function subscribeToTimer(delay: number) {
  const  socket = openSocket('http://localhost:8000');
  // socket.on('timer', (timestamp: Date) => cb(null, timestamp));
  socket.emit('subscribeToTimer', delay);

  return socket;
}

export { subscribeToTimer };
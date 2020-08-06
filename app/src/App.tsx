import React, { useEffect, useState, useCallback } from 'react';
import openSocket from 'socket.io-client';
import _ from 'lodash';
import dayjs from 'dayjs';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';

function Textbox() {
  const [time, setTime] = useState<Date>(new Date());
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [text, setText] = useState('');
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    const socketAPI = openSocket('http://7d3c89f7a226.ngrok.io');
    setSocket(socketAPI);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('init', (text: string) => setText(text));
      socket.emit('subscribeToText');
  
      socket.off('broadcast');
      socket.on('broadcast', (msg: string) => {
        console.log('broadcast', debouncing, "msg", msg, "text", text);
        if (!debouncing) {
          setText(msg);
          setTime(new Date());
        }
      });
    }
  }, [socket, debouncing, text, setText]);

  const updateBackend = useCallback(_.debounce((text: string) => {
    socket?.emit('message', text);
    setDebouncing(false);
    console.log('called');
  }, 1000), [socket]);

  return (
    <div style={{}}>
      <TextareaAutosize 
        style={{ fontSize: 20 }}
        aria-label="minimum height"
        rowsMin={3}
        placeholder="Type something"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setDebouncing(true);
          // only the message to the socket is debounced
          updateBackend(e.target.value);
        }}
      />
      <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
        <p className="App-intro" style={{ fontSize: 14 }}>
          Latest update: {dayjs(time).format('HH:mm:ss')}
        </p>
        <Button variant="contained" color="primary">
          Send
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center',
          width: '60%',
          justifyContent: 'space-around',
          marginTop: 30 
        }}>
          <Textbox />
          <Textbox />
        </div>
      </header>
    </div>
  );
}

export default App;

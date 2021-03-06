import React, { useEffect, useState, useCallback, useRef } from 'react';
import openSocket from 'socket.io-client';
import _ from 'lodash';
import dayjs from 'dayjs';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import logo from './logo.svg';
import './App.css';

function Textbox() {
  const [time, setTime] = useState<Date>(new Date());
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [text, setText] = useState('');
  const [previousText, setPreviousText] = useState('');
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    const socketAPI = openSocket('http://0d5f10631397.ngrok.io');
    socketAPI.on('init', (msg: string) => { setText(msg); setPreviousText(msg); });
    socketAPI.emit('subscribeToText');
    setSocket(socketAPI);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.off('broadcast');
      socket.on('broadcast', (msg: string) => {
        console.log('broadcast', debouncing, "msg", msg, "text", text);
        if (!debouncing) {
          setText(msg);
          setPreviousText(msg);
          setTime(new Date());
        }
      });
    }
  }, [socket, debouncing, text, setText]);

  const updateBackend = useCallback(_.debounce((message: string, previousMessage: string) => {
    console.log('message', { message, previousMessage });
    socket?.emit('message', { message, previousMessage });
    setDebouncing(false);
  }, 1000), [socket]);

  return (
    <div style={{}}>
      <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
        <p className="App-intro" style={{ fontSize: 14 }}>
          Latest update: {dayjs(time).format('HH:mm:ss')}
        </p>
      </div>
      <TextareaAutosize 
        style={{ fontSize: 20 }}
        aria-label="minimum height"
        rowsMin={8}
        placeholder="Type something"
        value={text}
        onChange={(e) => {
          setDebouncing(true);
          setText(e.target.value);
          // only the message to the socket is debounced
          updateBackend(e.target.value, previousText);
        }}
      />
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

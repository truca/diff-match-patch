import React, { useEffect, useState, useCallback, useRef } from 'react';
import openSocket from 'socket.io-client';
import _ from 'lodash';
import dayjs from 'dayjs';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';

function usePrevious(value: any) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  return ref.current;
}

function Textbox() {
  const [time, setTime] = useState<Date>(new Date());
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [text, setText] = useState('');
  const [previousText, setPreviousText] = useState('');
  const [debouncing, setDebouncing] = useState(false);
  const previousDebouncing = usePrevious(debouncing);

  useEffect(() => {
    const socketAPI = openSocket('http://df4078feeb8f.ngrok.io');
    socketAPI.on('init', (text: string) => setText(text));
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
          setTime(new Date());
        }
      });
    }
  }, [socket, debouncing, text, setText]);

  useEffect(() => {
    if (previousDebouncing !== debouncing && debouncing) {
      setPreviousText(text);
      console.log('setPreviousText', text);
    }
    if(previousDebouncing === debouncing && !debouncing) {
      setPreviousText(text);
    }
  }, [debouncing, text, setPreviousText]);

  const updateBackend = useCallback(_.debounce((text: string) => {
    console.log('message', { message: text, previousMessage: previousText });
    socket?.emit('message', { message: text, previousMessage: previousText });
    setDebouncing(false);
    console.log('called');
  }, 1000), [socket, text, previousText]);

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
        rowsMin={3}
        placeholder="Type something"
        value={text}
        onChange={(e) => {
          setDebouncing(true);
          setText(e.target.value);
          // only the message to the socket is debounced
          updateBackend(e.target.value);
        }}
      />
      <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="contained">
          Lock
        </Button>
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

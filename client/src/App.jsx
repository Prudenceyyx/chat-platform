import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { withCredentials: true });

const Chat = (props) => {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputRef.current.value) {
      socket.emit('message', inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prevState) => [...prevState, msg]);
    });
    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <div>
      <div className="history">
        <div>history</div>
        <ul className="messages">
          {messages.map((m, index) => {
            return <li key={index}>{m}</li>;
          })}
        </ul>
      </div>
      <input ref={inputRef} type="text" />
      <button ref={buttonRef} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chat;

import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { socket } from '../App';

const ChatInput = (props) => {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputRef.current.value) {
      socket.emit('message', inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button className="text-white" ref={buttonRef} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;

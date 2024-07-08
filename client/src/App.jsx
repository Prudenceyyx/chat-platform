import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Nav from './components/nav';
import Side from './components/side';
import ChatChannels from './components/chat-channel';
import './style.scss';

const socket = io('http://localhost:3000', { withCredentials: true });

const App = (props) => {
  return (
    <>
      <Nav />
      <main className="flex">
        <Side />
        <ChatChannels />
      </main>
    </>
  );
};

export default App;
export { socket };

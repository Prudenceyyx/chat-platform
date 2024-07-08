import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Nav from "./components/nav";
import Side from "./components/side";
import ChatChannels from "./components/chat-channel";
import "./style.scss";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const socket = io("http://localhost:3000", 
  // { withCredentials: true }
);

const queryClient = new QueryClient();
const App = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
    <>
      <Nav />
      <main className="flex h-[calc(100vh-70px)]">
        <Side />
        <ChatChannels />
      </main>
      </>
   </QueryClientProvider>
  );
};

export default App;
export { socket };

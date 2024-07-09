import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Nav from "./components/nav";
import Side from "./components/side";
import ChatPage from "./components/chat-page";
import "./style.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./utils/chance.min.js";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

const client = new Client({
  url: "http://localhost:3000/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const socket = io(
  "http://localhost:3000"
  // { withCredentials: true }
);

// const queryClient = new QueryClient();
const App = (props) => {
  const chance = new Chance();

  const usernameKey = "chat_username";
  const username = localStorage.getItem(usernameKey);
  if (username) {
    // The user has visited before
    console.log("User login:", username);
  } else {
    // This is a unique visit
    const name = chance.name();
    console.log("User generated:", name);
    localStorage.setItem(usernameKey, name);
  }

  return (
    <Provider value={client}>
      <Nav />
      <main className="flex h-[calc(100vh-70px)]">
        <Side />
        <ChatPage />
      </main>
    </Provider>
  );
};

export default App;
export { socket };

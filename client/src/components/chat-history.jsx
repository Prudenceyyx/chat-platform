import React, { useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import clsx from "clsx";
import { socket } from "../App";
import { gql, useQuery, useMutation } from "urql";
import { Button } from "@headlessui/react";

import ChatMessage from './chat-message'

const MessagesQuery = gql`
  query GetMessages($channelID: String!) {
    messages(channelID: $channelID) {
      _id
      content
      sender
      quoteID
      quotedMessageContent
      createdAt
    }
  }
`;

const ChatHistory = (props) => {
  const { channelID, onQuoted } = props;
  const [result, reexecuteQuery] = useQuery({
    query: MessagesQuery,
    variables: {
      channelID: channelID,
    },
  });

  const { data, fetching, error } = result;

  const [messages, setMessages] = useState([]);
  const ref = useRef(null);

  const usernameKey = "chat_username";
  const username = localStorage.getItem(usernameKey);

  useEffect(() => {
    setMessages([]);
    socket.on(`message:${channelID}`, (msg) => {
      setMessages((prev) => {
        return [...prev, msg];
      });
    });

    socket.on(`message-delete:${channelID}`, (messageID) => {
      setMessages((prev) => {
        return [...prev].filter((m) => m._id !== messageID);
      });
    });

    return () => {
      socket.off(`message:${channelID}`);
      socket.off(`message-delete:${channelID}`);
    };
  }, [channelID]);

  useEffect(() => {
    if (!fetching) {
      setMessages(data.messages);
    }
  }, [fetching, channelID]);

  useEffect(() => {
    /** @type {HTMLElement} */
    const element = ref.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, channelID]);

  if (fetching) return <div>Loading...</div>;
  if (error) return "An error has occurred: " + error.message;

  return (
    <ul className="h-full overflow-y-auto p-[20px]" ref={ref}>
      {messages.map((msg, index) => {
        return (
          <ChatMessage
            key={msg._id}
            message={msg}
            isUser={msg.sender === username}
            handleQuote={() => {onQuoted(msg)}}
            onDelete={(messageID) => {
              setMessages((prev) => {
                return [...prev].filter((m) => m._id !== messageID);
              });
              if (msg.sender === username) {
                socket.emit(`message-delete`, messageID, channelID);
              }
            }}
          />
        );
      })}
    </ul>
  );
};

export default ChatHistory;

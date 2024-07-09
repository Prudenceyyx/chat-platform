import React, { useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import clsx from "clsx";
import { socket } from "../App";
import { gql, useQuery } from "urql";

const MessagesQuery = gql`
  query GetMessages($channelID: String!) {
    messages(channelID: $channelID) {
      _id
      content
      sender
      createdAt
    }
  }
`;

const ChatMessage = (props) => {
  const { message, isUser } = props;

  return (
    <li
      className={clsx("flex mb-[30px]", {
        "justify-end": isUser,
      })}
    >
      <Avatar
        name={message.sender}
        className={clsx("shrink-0", {
          "order-2 ml-[10px]": isUser,
          "mr-[10px]": !isUser,
        })}
      />
      <div className="max-w-[500px]">
        <div
          className={clsx({
            "text-right": isUser,
          })}
        >
          <span className="text-xs font-medium text-[#C9C7D0]">
            {message.sender}
          </span>
          <span className="text-xs font-medium text-[#7B798F] ml-[10px]">
            {message.createdAt}
          </span>
        </div>
        <div
          className={clsx(
            "p-[15px] rounded-lg font-medium text-base leading-6",
            {
              "rounded-tl-none bg-[#454451] text-white ": !isUser,
              "rounded-tr-none bg-[#82d8be]": isUser,
            }
          )}
        >
          {message.content}
        </div>
      </div>
    </li>
  );
};

const ChatHistory = (props) => {
  const { channelID } = props;
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
      console.log(msg);
      setMessages((prev) => {
        return [...prev, msg];
      });
    });

    return () => {
      socket.off(`message:${channelID}`);
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
          />
        );
      })}
    </ul>
  );
};

export default ChatHistory;

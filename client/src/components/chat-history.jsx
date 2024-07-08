import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "./avatar";
import clsx from "clsx";
import { socket } from "../App";
import { timeDifference } from "../utils";

function useChannelMessages(channelID) {
  return useQuery({
    queryKey: ["channel-messages" + channelID],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:3000/channel-messages",
        {
          params: {
            channelID: channelID,
          },
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3001",
          },
        }
      );
      return data;
    },
  });
}

const ChatMessage = (props) => {
  const { message, isUser } = props;
  const now = new Date();
  const timediff =  timeDifference(now, new Date(message.createdAt))

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
            {timediff}
          </span>
        </div>
        <div
          className={clsx(
            "p-[15px] rounded-lg font-medium text-base leading-6",
            {
              "rounded-tl-none bg-[#454451] text-white ": !isUser,
              "rounded-tr-none bg-[#04B17D]": isUser,
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
  const { data, isLoading, error } = useChannelMessages(channelID);
  const [messages, setMessages] = useState([]);
  const ref = useRef(null);

  const usernameKey = "chat_username";
  const username = localStorage.getItem(usernameKey);
  console.log(username)

  useEffect(() => {
    setMessages([]);
    socket.on(`message:${channelID}`, (msg) => {
      // console.log(msg);
      setMessages((prev) => {
        return [...prev, msg];
      });
    });

    return () => {
      socket.off(`message:${channelID}`);
    };
  }, [channelID]);

  useEffect(() => {
    if (!isLoading) {
      setMessages(data.data);
    }
  }, [isLoading, channelID]);

  useEffect(() => {
    /** @type {HTMLElement} */
    const element = ref.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, channelID]);
  // console.log(channelID, messages, isLoading);

  if (isLoading) return <div>Loading...</div>;

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

import React, { useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import clsx from "clsx";
import { socket } from "../App";
import { gql, useQuery, useMutation } from "urql";
import { Button } from "@headlessui/react";

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

const DELETE_MESSAGE_MUTATION = `
  mutation DeleteMessage($_id: ID!) {
    deleteMessage(_id: $_id) {
      _id
      success
      message
    }
  }
`;

const ChatMessage = (props) => {
  const { message, isUser, onDelete } = props;

  const [result, deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION);

  const handleDelete = (messageID) => {
    deleteMessage({ _id: messageID });
  };

  useEffect(() => {
    console.log(message._id, result);
    if (result.data && result.data.deleteMessage.success) {
      onDelete?.(result.data.deleteMessage._id);
    }
  }, [result]);

  return (
    <li
      className={clsx("message flex mb-[30px]", {
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
      <div className="message__content max-w-[500px]">
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
        <div className={clsx("flex items-start", isUser && "justify-end")}>
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
          <div
            className={clsx(
              "message__content__icons",
              "shrink-0 rounded-[10px] border flex mx-[7.5px] p-[5px] gap-[5px] opacity-0 transition-opacity duration-100",
              isUser && "order-first"
            )}
            style={{ borderColor: "#FFFFFF10" }}
          >
            <Button className="h-9 w-9 flex items-center justify-center data-[hover]:bg-gray-600 rounded-md transition-bg duration-100">
              <img src="/assets/icons/quote.svg" className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleDelete(message._id)}
              className="h-9 w-9 flex items-center justify-center data-[hover]:bg-gray-600 rounded-md transition-bg duration-100"
            >
              <img src="/assets/icons/delete.svg" className="h-4 w-4" />
            </Button>
          </div>
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
      setMessages((prev) => {
        return [...prev, msg];
      });
    });

    socket.on(`message-delete:${channelID}`, (messageID) => {
      console.log(messageID);
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

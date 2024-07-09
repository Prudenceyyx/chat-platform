import React, { useEffect } from "react";
import {gql, useMutation } from "urql";
import clsx from "clsx";
import {Button} from '@headlessui/react'
import Avatar from "./avatar";

const DELETE_MESSAGE_MUTATION = gql`
  mutation DeleteMessage($_id: ID!) {
    deleteMessage(_id: $_id) {
      _id
      success
      message
    }
  }
`;

const ChatMessage = (props) => {
  const { message, isUser, onDelete, handleQuote } = props;

  const [result, deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION);

  const handleDelete = (messageID) => {
    deleteMessage({ _id: messageID });
  };

  useEffect(() => {
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
            <Button
              onClick={() => handleQuote(message._id)}
              className="h-9 w-9 flex items-center justify-center data-[hover]:bg-gray-600 rounded-md transition-bg duration-100"
            >
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
        {message.quoteID && (
          <div
            className={clsx(
              "rounded-[10px] p-[10px] w-fit max-w-[350px] truncate bg-[#35343E] mt-[5px]",
              isUser && "ml-auto"
            )}
          >
            <div className="h-[20px] w-[2px] bg-[#04B17D] mr-[10px] inline-block align-middle"></div>
            <span className="text-[#7B798F] leading-[20px] align-middle">
              {message.quotedMessageContent}
            </span>
          </div>
        )}
      </div>
    </li>
  );
};

export default ChatMessage;

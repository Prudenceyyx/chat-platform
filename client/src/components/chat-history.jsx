import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "./avatar";
import clsx from "clsx";

function useChannelMessages(channelID) {
  return useQuery({
    queryKey: ["channel-messages"],
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
  return (
    <li className={clsx("flex mb-[30px]", {
        'justify-end': isUser
    })}>
      <Avatar
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
            { "rounded-tl-none bg-[#454451] text-white ": !isUser, "rounded-tr-none bg-[#04B17D]": isUser }
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
  const { data, isPending, error } = useChannelMessages(channelID);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  //   console.log(data)

  return (
    <ul className="h-full overflow-y-auto p-[20px]">
      {(data.data || []).map((msg, index) => {
        return (
          <ChatMessage
            key={msg._id}
            message={msg}
            isUser={msg.sender === "me"}
          />
        );
      })}
    </ul>
  );
};

export default ChatHistory;

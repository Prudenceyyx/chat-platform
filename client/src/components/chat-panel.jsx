import React from "react";
import ChatHistory from "./chat-history";
import ChatInput from "./chat-input";

const ChatPanel = (props) => {
  const { channel } = props;
  return (
    <>
      <div
        className="h-16 shrink-0 flex items-center font-semibold text-lg text-white px-[20px]"
        style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
      >
        {channel.name}
      </div>
      <ChatHistory channelID={channel.id} />
      <ChatInput channelID={channel.id} />
    </>
  );
};

export default ChatPanel;

import React, { useRef } from "react";
import ChatHistory from "./chat-history";
import ChatInput from "./chat-input";

const ChatPanel = (props) => {
  const { channel } = props;

  const inputRef = useRef(null);

  const onQuoted = (msg) => {
    inputRef.current.quote(msg)
  }

  return (
    <>
      <div
        className="h-16 shrink-0 flex items-center font-semibold text-lg text-white px-[20px]"
        style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
      >
        {channel.name}
      </div>
      <ChatHistory channelID={channel.id} onQuoted={onQuoted} />
      <ChatInput channelID={channel.id} ref={inputRef} />
    </>
  );
};

export default ChatPanel;

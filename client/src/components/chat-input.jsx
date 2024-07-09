import React, { useEffect, useRef, useState } from "react";
import { socket } from "../App";
import { Field, Textarea } from "@headlessui/react";
import clsx from "clsx";

const ChatInput = (props) => {
  const { channelID, quotingMessage } = props;
  const inputRef = useRef(null);

  const usernameKey = "chat_username";
  const username = localStorage.getItem(usernameKey);

  const sendMessage = () => {
    if (inputRef.current.value) {
      const newMessage = {
        content: inputRef.current.value,
        sender: username,
        channelID,
        createdAt: new Date()
      };
      // console.log(channelID)
      socket.emit("message", newMessage);
      inputRef.current.value = "";
    }
  };

  const lineBreak = () => {
    inputRef.current.value += "\n";
  };

  const onKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      // Allow default action (insert new line)
      // console.log("Ctrl+Enter key pressed!");
      lineBreak();
    } else if (event.key === "Enter") {
      event.preventDefault();
      // console.log("Enter key pressed!");
      sendMessage();
    }
  };

  return (
    <div className="min-h-[100px] border-t border-solid mt-3 " style={{borderColor: '#ffffff10'}}>
      <Field>
        <Textarea
          ref={inputRef}
          className={clsx(
            "block w-full resize-none w-full bg-[#26252D] rounded-lg border-none py-1.5 px-3 text-sm/6 text-white",
            "focus:outline-none "
          )}
          placeholder="Press Enter to send. Press Ctrl+Enter to break the line."
          onKeyDown={onKeyDown}
        />
        {/* <button className="text-white" ref={buttonRef} onClick={sendMessage}>
        Send
      </button> */}
      </Field>
    </div>
  );
};

export default ChatInput;

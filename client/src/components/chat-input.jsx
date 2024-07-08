import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { socket } from "../App";
import { Field, Textarea } from "@headlessui/react";
import clsx from "clsx";

const ChatInput = (props) => {
  const { channelID } = props;
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const sendMessage = () => {
    if (inputRef.current.value) {
      const newMessage = {
        content: inputRef.current.value,
        sender: "me",
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
      console.log("Ctrl+Enter key pressed!");
      lineBreak();
    } else if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed!");
      sendMessage();
    }
  };

  return (
    <div className="min-h-[100px]">
      <Field>
        <Textarea
          ref={inputRef}
          className={clsx(
            "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
          )}
          rows={3}
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

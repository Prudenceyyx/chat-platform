import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { socket } from "../App";
import { Field, Textarea } from "@headlessui/react";
import clsx from "clsx";
import ChatQuote from "./chat-quote";

const ChatInput = (props, ref) => {
  const { channelID, quotingMessage } = props;
  const [quotation, setQuotation] = useState(undefined);

  useImperativeHandle(ref, () => ({
    quote: (msg) => {
      setQuotation(msg);
    },
  }));

  const inputRef = useRef(null);

  const usernameKey = "chat_username";
  const username = localStorage.getItem(usernameKey);

  const sendMessage = useCallback(() => {
    if (inputRef.current.value) {
      const newMessage = {
        content: inputRef.current.value,
        sender: username,
        channelID,
        createdAt: new Date(),
        quoteID: quotation._id ? quotation._id : null,
      };

      socket.emit("message", newMessage);
      inputRef.current.value = "";
      setQuotation(null)
    }
  }, [quotation]);

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
    <div
      className="min-h-[100px] border-t border-solid mt-3 "
      style={{ borderColor: "#ffffff10" }}
    >
      <Field>
        <Textarea
          ref={inputRef}
          className={clsx(
            "block w-full resize-vertical w-full bg-[#26252D] rounded-lg border-none py-1.5 px-5 text-sm/6 text-white",
            "focus:outline-none h-fit "
          )}
          rows="1"
          maxLength={2000}
          placeholder="Press Enter to send. Press Ctrl+Enter to break the line."
          onKeyDown={onKeyDown}
        />
        {quotation && (
          <ChatQuote
            className="ml-[20px]"
            content={quotation.content}
            isUser={false}
            closable={true}
            onClose={() => {
              setQuotation(null);
            }}
          />
        )}
        {/* <button className="text-white" ref={buttonRef} onClick={sendMessage}>
        Send
      </button> */}
      </Field>
    </div>
  );
};

export default React.forwardRef(ChatInput);

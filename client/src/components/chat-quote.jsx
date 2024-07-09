import React from "react";
import clsx from "clsx";

const ChatQuote = (props) => {
  const { content, isUser, className, closable, onClose=() => {} } = props;

  return (
    <div className={clsx(className, 'flex', 'align-center', 'mt-[5px]')}>
      <div
        className={clsx(
          "shrink-0 rounded-[10px] p-[10px] w-fit max-w-[350px] truncate bg-[#35343E] cursor-pointer",
          isUser && "ml-auto"
        )}
      >
        <div className="h-[20px] w-[2px] bg-[#04B17D] mr-[10px] inline-block align-middle "></div>
        <span className="text-[#7B798F] leading-[20px] align-middle">
          {content}
        </span>
      </div>
      {closable && <img onClick={onClose} src={'/assets/icons/closed.svg'} className='ml-[5px] cursor-pointer'/>}
    </div>
  );
};

export default ChatQuote;

import clsx from "clsx";
import React from "react";
import { RandomAvatar } from "react-random-avatars";

const Avatar = (props) => {
  const { className, name,...otherProps } = props;
  return (
    <div
      className={clsx("rounded-full h-[40px] w-[40px] bg-white", className)}
      {...otherProps}>
      <RandomAvatar name={name} size={40} mode="pattern" />
    </div>
  );
};

export default Avatar;

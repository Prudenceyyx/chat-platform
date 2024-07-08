import clsx from "clsx";
import React from "react";

const Avatar = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div
      className={clsx("rounded-full h-[40px] w-[40px] bg-white", className)}
      {...otherProps}
    ></div>
  );
};

export default Avatar;

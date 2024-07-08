import React from "react";
import Search from './search'
import Avatar from './avatar';

const Nav = (props) => {
const username = localStorage.getItem('chat_username')

  return (
    <nav className="w-full h-[70px] bg-[#0C0E13] text-white flex justify-between items-center pl-5 pr-5">
      <div className="flex items-center">
        <img src="/assets/icon.svg" />
        <div className="font-bold pl-5 text-sm">Gradual Community</div>
      </div>
      <div className="flex items-center">
        <Search />
        <div className="flex ml-[20px] shrink-0">
          <img className="h-[24px] w-[24px]" src="/assets/icons/globe.svg" />
          <div className="ml-2 shrink-0">UTC-Chicago</div>
        </div>

        <img
          className="h-[24px] w-[24px] ml-[20px]"
          src="/assets/icons/bell.svg"
        />
        <img
          className="h-[24px] w-[24px] ml-[20px]"
          src="/assets/icons/help.svg"
        />
        <Avatar className="shrink-0 ml-[20px]" name={username} />

      </div>
    </nav>
  );
};

export default Nav;

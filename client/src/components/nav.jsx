import React from "react";
import Search from './search'

const Nav = (props) => {
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
        <div className="h-[40px] w-[40px] ml-[20px] shrink-0 rounded-full bg-white"></div>
      </div>
    </nav>
  );
};

export default Nav;

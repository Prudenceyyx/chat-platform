import React from "react";
import Search from "./search";
import Avatar from "./avatar";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const Nav = (props) => {
  const username = localStorage.getItem("chat_username");

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
        <Popover data-open>
          <PopoverButton className="data-[closed]:border-none">
            <Avatar className="shrink-0 ml-[20px]" name={username} />
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="bottom"
            className="w-fit divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
          >
            <div className="p-3">
                <p className="font-semibold text-white text-nowrap">{username}</p>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </nav>
  );
};

export default Nav;

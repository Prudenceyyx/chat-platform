import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";

const menus = [
  {
    name: "Engage",
    children: [
      { name: "Forum", icon: "forum.svg" },
      { name: "Chat", icon: "chat.svg" },
      { name: "Matches", icon: "matches.png" },
    ],
  },
  {
    name: "People",
    children: [
      { name: "Members", icon: "members.svg" },
      { name: "Contributors", icon: "contributors.png" },
    ],
  },
];

const Side = (props) => {
  return (
    <TabGroup className="side w-[225px] shrink-0">
      <TabList className="side text-white pt-4">
        {menus.map(({ name, children }, index) => (
          <div
            key={name}
            className={clsx('pt-[30px]',  index !== 0 && "border-t border-1 border-[#26252D]")}
          >
            <div className="text-sm text-[#797B85] pl-7 pt-[15px] pb-[15px]">{name}</div>
            {(children || []).map((child, childIndex) => {
              return (
                <Tab
                  key={child.name}
                  className="side-tab w-full pt-[15px] pb-[15px] flex items-center pl-7 pr-7"
                >
                  <div className="side-tab__icon h-[40px] w-[40px] rounded-full bg-[#26252D] flex justify-center items-center">
                    <img
                      className="h-[24px] w-[24px] object-contain"
                      src={"/assets/" + child.icon}
                    />
                  </div>
                  <div className="side-tab__text text-lg text-[#929699] pl-4">
                    {child.name}
                  </div>
                </Tab>
              );
            })}
          </div>
        ))}
        {/* <TabList className="w-1/3">
        {menus.map(({ name, index }) => (
          <Tab
            key={name}
            className="block w-full py-4 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
            // onClick={() => setSelectedTab(index)}
          >
            {name}
          </Tab>
        ))}
      </TabList> */}
      </TabList>
    </TabGroup>
  );
};

export default Side;

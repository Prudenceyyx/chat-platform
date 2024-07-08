import React from "react";
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

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
    <div className="side text-white pt-[30px] pl-7">
      {menus.map(({ name, children, index }) => (
        <div key={name} className="border-top border-1 border-[#26252D] pt-[30px]">
          <div className="text-sm text-[#797B85] mb-[30px]">{name}</div>
          {(children || []).map((child, childIndex) => {
            return (
              <div key={child.name} className="h-[40px] mb-[30px] flex items-center">
                <div className="h-[40px] w-[40px] rounded-full bg-[#26252D] flex justify-center items-center">
                  <img className="h-[24px] w-[24px] object-contain"  src={'/assets/'+child.icon} />
                </div>
                <div className="text-lg text-[#929699] pl-4">{child.name}</div>
              </div>
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
    </div>
  );
};

export default Side;

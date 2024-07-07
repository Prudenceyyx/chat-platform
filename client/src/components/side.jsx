import React from 'react';
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

const menus = [
  {
    name: 'Engage',
    children: [{ name: 'Forum' }, { name: 'Chat' }, { name: 'Matches' }],
  },
  {
    name: 'People',
    children: [{ name: 'Members' }, { name: 'Contributors' }],
  },
];

const Side = (props) => {
  return (
    <div className="side text-white">
      {menus.map(({ name, children, index }) => (
        <div key={name}>
          <div>{name}</div>
          {(children || []).map((child, childIndex) => {
            return <div key={child.name}>{child.name}</div>;
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

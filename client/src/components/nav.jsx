import React from 'react';
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

const Nav = (props) => {
  return (
    <nav className="w-full h-[70px] bg-[#0C0E13] text-white flex justify-between items-center pl-5">
      <div className='flex items-center'>
        <img src="/assets/icon.svg" />
        <div className='font-bold pl-5 text-sm'>Gradual Community</div>
      </div>
      <div className="flex">
        <div>Search</div>
        <div>UTC-Chicago</div>

        <div>icon</div>
        <div>avatar</div>
      </div>
    </nav>
  );
};

export default Nav;

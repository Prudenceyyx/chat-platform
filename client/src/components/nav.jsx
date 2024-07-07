import React from 'react';
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

const Nav = (props) => {
  return (
    <nav className="w-full bg-black text-white flex justify-between">
      <div>
        <div>Gradual Community</div>
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

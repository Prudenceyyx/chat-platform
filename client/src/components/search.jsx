import React from "react";
import { Input, Field, Label, Description } from "@headlessui/react";
import clsx from 'clsx';

const Search = (props) => {
  return (
    <Field className="w-full">
      {/* <Label className="text-sm/6 font-medium text-white">Name</Label>
      <Description className="text-sm/6 text-white/50">
        Use your real name so people will recognize you.
      </Description> */}
      <Input
        className={clsx(
          "block w-full h-[38px] border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white rounded-[10px]",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
        )}
        placeholder="Search"
      />
    </Field>
  );
};

export default Search;

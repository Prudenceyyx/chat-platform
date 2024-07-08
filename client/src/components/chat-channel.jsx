import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import ChatInput from "./chat-input";
import { socket } from "../App";
import Search from "./search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatHistory from "./chat-history";
import Avatar from "./avatar";

function useChannels() {
  return useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/channels", {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3001",
        },
      });
      return data;
    },
  });
}

const channelList = [
  { name: "a" },
  { name: "b" },
  { name: "c" },
  { name: "d" },
];

const messageHistory = {
  a: [{ id: 0, content: "hi", time: Date().toString() }],
  b: [],
  c: [],
  d: [],
};

const ChatChannels = (props) => {
  const { data, isPending, error } = useChannels();
  // const [messages, setMessages] = useState(messageHistory);
  // const [selectedTab, setSelectedTab] = useState(channelList[0].name);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  // useEffect(() => {
  //   socket.on("message", (msg) => {
  //     const newMessage = {
  //       content: msg,
  //       time: Date().toString(),
  //       channel: selectedTab,
  //     };
  //     // console.log(selectedTab, messageHistory[selectedTab]);
  //     setMessages((prevState) => {
  //       return {
  //         ...prevState,
  //         [selectedTab]: [...messages[selectedTab], newMessage],
  //       };
  //     });
  //   });
  //   return () => {
  //     socket.off("message");
  //   };
  // }, [selectedTab, messages]);

  return (
    <TabGroup className="flex w-full h-full grow">
      <TabList className="w-[340px] h-full shrink-0 bg-[#1D1C21]">
        <div
          className="h-16 flex items-center"
          style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
        >
          <Search />
        </div>
        {data.data.map(({ _id, name }, index) => (
          <Tab
            key={_id}
            className="block w-full h-[75px] py-[16px] px-[20px] flex focus:outline-none data-[selected]:bg-[#26252D] data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10"
            // onClick={() => setSelectedTab(index)}
          >
            <Avatar className="shrink-0" />
            <div className="w-full px-[10px] ">
              <div className="flex justify-between w-full items-center">
                <div className="text-sm/6 font-medium text-[#C9C7D0]">
                  {name}
                </div>
                <div className="text-xs font-medium text-[#7B798F]">22:04</div>
              </div>
              <div className="text-xs font-medium text-[#7B798F] text-left">
                Alien: [Photo]
              </div>
            </div>
          </Tab>
        ))}
      </TabList>
      <TabPanels className="grow h-full">
        {data.data.map(({ _id, name }, index) => {
          return <TabPanel
            key={_id}
            className="h-full flex flex-col justify-between bg-[#26252D]"
          >
            <div
              className="h-16 shrink-0 flex items-center font-semibold text-lg text-white px-[20px]"
              style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
            >
              {name}
            </div>
            <ChatHistory channelID={_id} />
            <ChatInput channelID={_id} />
          </TabPanel>;
        })}
      </TabPanels>
    </TabGroup>
  );
};

export default ChatChannels;

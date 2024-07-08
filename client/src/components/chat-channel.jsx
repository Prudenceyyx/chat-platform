import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import ChatInput from "./chat-input";
import { socket } from "../App";
import Search from "./search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useChannels(channelID) {
  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/channels", {
        params: {
          channelID: channelID,
        },
        // withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3001",
        },
      });
      return data;
    },
  });
}

// const categories = [
//   {
//     name: 'Recent',
//     posts: [
//       {
//         id: 1,
//         title: 'Does drinking coffee make you smarter?',
//         date: '5h ago',
//         commentCount: 5,
//         shareCount: 2,
//       },
//       {
//         id: 2,
//         title: "So you've bought coffee... now what?",
//         date: '2h ago',
//         commentCount: 3,
//         shareCount: 2,
//       },
//     ],
//   },
//   {
//     name: 'Popular',
//     posts: [
//       {
//         id: 1,
//         title: 'Is tech making coffee better or worse?',
//         date: 'Jan 7',
//         commentCount: 29,
//         shareCount: 16,
//       },
//       {
//         id: 2,
//         title: 'The most innovative things happening in coffee',
//         date: 'Mar 19',
//         commentCount: 24,
//         shareCount: 12,
//       },
//     ],
//   },
//   {
//     name: 'Trending',
//     posts: [
//       {
//         id: 1,
//         title: 'Ask Me Anything: 10 answers to your questions about coffee',
//         date: '2d ago',
//         commentCount: 9,
//         shareCount: 5,
//       },
//       {
//         id: 2,
//         title: "The worst advice we've ever heard about coffee",
//         date: '4d ago',
//         commentCount: 1,
//         shareCount: 2,
//       },
//     ],
//   },
// ];

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
  const [messages, setMessages] = useState(messageHistory);
  const [selectedTab, setSelectedTab] = useState(channelList[0].name);

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
        {data.channels.map(({ name, index }) => (
          <Tab
            key={name}
            className="block w-full h-[75px] py-[16px] px-[20px] flex focus:outline-none data-[selected]:bg-[#26252D] data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10"
            onClick={() => setSelectedTab(index)}
          >
            <div className="rounded-full h-[40px] w-[40px] bg-white shrink-0"></div>
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
        {Object.entries(messages).map(([channelID, chatList], index) => (
          <TabPanel
            key={channelID}
            className="h-full flex flex-col justify-between bg-[#26252D] p-3"
          >
            <div
              className="h-16 flex items-center font-semibold text-lg text-white px-[20px]"
              style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
            >
              {data.channels[index].name}
            </div>
            <ul className="h-full overflow-y-auto">
              {chatList.map((msg, index) => {
                return (
                  <li
                    key={index}
                    className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
                  >
                    <div className="font-semibold text-white">
                      {msg.content}
                    </div>
                    <ul className="flex gap-2 text-white/50" aria-hidden="true">
                      <li>{msg.time}</li>
                      <li>{msg.channel}</li>
                    </ul>
                  </li>
                );
              })}
              {/* {posts.map((post) => (
                    <li key={post.id} className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                      <a href="#" className="font-semibold text-white">
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                      <ul className="flex gap-2 text-white/50" aria-hidden="true">
                        <li>{post.date}</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{post.commentCount} comments</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{post.shareCount} shares</li>
                      </ul>
                    </li>
                  ))} */}
            </ul>
            <ChatInput />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default ChatChannels;

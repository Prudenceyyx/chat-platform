import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import ChatInput from "./chat-input";
import Search from "./search";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import ChatHistory from "./chat-history";
import Avatar from "./avatar";
import { gql, useQuery } from "urql";

// function useChannels() {
//   return useQuery({
//     queryKey: ["channels"],
//     queryFn: async () => {
//       const { data } = await axios.get("http://localhost:3000/channels", {
//         headers: {
//           "Access-Control-Allow-Origin": "http://localhost:3001",
//         },
//       });
//       return data;
//     },
//   });
// }

const ChannelsQuery = gql`
  query {
    channels {
      id
      name
    }
  }
`;

const ChatChannels = (props) => {
  const [result, reexecuteQuery] = useQuery({
    query: ChannelsQuery,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <TabGroup className="flex w-full h-full grow">
      <TabList className="w-[340px] h-full shrink-0 bg-[#1D1C21]">
        <div
          className="h-16 flex items-center"
          style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
        >
          <Search />
        </div>
        {data.channels.map(({ id, name }, index) => (
          <Tab
            key={id}
            className="block w-full h-[75px] py-[16px] px-[20px] flex focus:outline-none data-[selected]:bg-[#26252D] data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10"
          >
            <Avatar className="shrink-0" name={name} />
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
        {data.channels.map(({ id, name }, index) => {
          return (
            <TabPanel
              key={id}
              className="h-full flex flex-col justify-between bg-[#26252D]"
            >
              <div
                className="h-16 shrink-0 flex items-center font-semibold text-lg text-white px-[20px]"
                style={{ boxShadow: "0px 1px 0px 0px #FFFFFF1A" }}
              >
                {name}
              </div>
              <ChatHistory channelID={id} />
              <ChatInput channelID={id} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </TabGroup>
  );
};

export default ChatChannels;

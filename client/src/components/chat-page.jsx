import React, { useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Search from './search';
import ChatPanel from './chat-panel';
import Avatar from './avatar';
import { gql, useQuery } from 'urql';
import { socket } from '../App';

const ChannelsQuery = gql`
  query {
    channels {
      id
      name
      lastMessage {
        _id
        id
        sender
        content
      }
    }
  }
`;

const ChatPage = (props) => {
  const [result, reexecuteQuery] = useQuery({
    query: ChannelsQuery,
  });

  const { data, fetching, error } = result;

  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    if (!fetching) {
      setChannelData(data.channels);
    }
  }, [data]);

  useEffect(() => {
    let channelIDs = [];
    if (data) {
      data.channels.forEach((channel) => {
        channelIDs.push(channel.id);

        socket.on(`message:${channel.id}`, (msg) => {
          setChannelData((prev) => {
            const result = prev.map((prevChannelData) => {
              if (prevChannelData.id === channel.id) {
                return { ...prevChannelData, lastMessage: msg };
              } else {
                return prevChannelData;
              }
            });
            return result;
          });
        });
      });
    }

    return () => {
      if (channelIDs) {
        channelIDs.forEach((channelID) => {
          return socket.off(`message:${channelID}`);
        });
      }
    };
  }, [data]);

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <TabGroup className="flex w-full h-full grow">
      <TabList className="w-[340px] h-full shrink-0 bg-[#1D1C21]">
        <div className="h-16 flex items-center" style={{ boxShadow: '0px 1px 0px 0px #FFFFFF1A' }}>
          <Search />
        </div>
        {channelData.map((channel, index) => {
          const { lastMessage } = channel;
          return (
            <Tab
              key={channel.id}
              className="block w-full h-[75px] py-[16px] px-[20px] flex focus:outline-none data-[selected]:bg-[#26252D] data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10"
            >
              <Avatar className="shrink-0" name={channel.name} />
              <div className="w-full px-[10px] ">
                <div className="flex justify-between w-full items-center">
                  <div className="text-sm/6 font-medium text-[#C9C7D0]">{channel.name}</div>
                  <div className="text-xs font-medium text-[#7B798F]">22:04</div>
                </div>
                {lastMessage && (
                  <div className="text-xs font-medium text-[#7B798F] text-left">
                    {lastMessage.sender}: {lastMessage.content}
                  </div>
                )}
              </div>
            </Tab>
          );
        })}
      </TabList>
      <TabPanels className="grow h-full">
        {data.channels.map((channel, index) => {
          return (
            <TabPanel key={channel.id} className="h-full flex flex-col justify-between bg-[#26252D]">
              <ChatPanel channel={channel} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </TabGroup>
  );
};

export default ChatPage;

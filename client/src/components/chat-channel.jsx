import React, { useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import ChatInput from './chat-input';
import { io } from 'socket.io-client';
import { socket } from '../App';

const categories = [
  {
    name: 'Recent',
    posts: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
  },
  {
    name: 'Popular',
    posts: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
    ],
  },
  {
    name: 'Trending',
    posts: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
];

const channelList = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }];

const messageHistory = {
  a: [{ id: 0, content: 'hi', time: Date().toString() }],
  b: [],
  c: [],
  d: [],
};

const ChatChannels = (props) => {
  const [messages, setMessages] = useState(messageHistory);
  const [selectedTab, setSelectedTab] = useState(channelList[0].name);

  useEffect(() => {
    socket.on('message', (msg) => {
      const newMessage = { content: msg, time: Date().toString(), channel: selectedTab };
      // console.log(selectedTab, messageHistory[selectedTab]);
      setMessages((prevState) => {
        return { ...prevState, [selectedTab]: [...messages[selectedTab], newMessage] };
      });
    });
    return () => {
      socket.off('message');
    };
  }, [selectedTab, messages]);

  return (
    <div className="h-screen w-full px-4">
      <div className="w-full">
        <TabGroup className="flex">
          <TabList className="w-1/3">
            {channelList.map(({ name, index }) => (
              <Tab
                key={name}
                className="block w-full py-4 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                onClick={() => setSelectedTab(index)}
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="w-2/3">
            {Object.entries(messages).map(([channelID, chatList]) => (
              <TabPanel key={channelID} className="rounded-xl bg-white/5 p-3">
                <ul>
                  {chatList.map((msg, index) => {
                    return (
                      <li key={index} className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                        <div className="font-semibold text-white">{msg.content}</div>
                        <ul className="flex gap-2 text-white/50" aria-hidden="true">
                          {/* <li>5h ago</li> */}
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
      </div>
    </div>
  );
};

export default ChatChannels;

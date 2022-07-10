import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import config from 'config';

interface IProps {
  data?: any;
}

function Chat({ data }: IProps) {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [chats, setChats] = useState([] as any);

  useEffect(() => {
    const username: any = window.prompt('Username: ', 'Anonymous');
    setUsername(username);

    const pusher = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
      encrypted: true,
    } as any);
    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: any) => {
      setChats([...chats, data]);
      setText('');
    });
  }, []);

  const handleTextChange = (e: any) => {
    console.log(33, config);
    if (e.keyCode === 13) {
      const payload = {
        username,
        message: text,
      };
      // axios.post(`${config.apiUrl}/api/message`, payload);
      axios.post(
        `https://2023-nextjs-with-redux.vercel.app/api/message`,
        payload
      );
    } else {
      setText(e.target.value);
    }
  };

  return (
    <div className="Chat">
      <div>
        <ChatList chats={chats} />
        <ChatBox
          text={text}
          username={username}
          handleTextChange={handleTextChange}
        />
      </div>
    </div>
  );
}

export default Chat;

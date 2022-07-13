import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import config from 'config';
import request, { ChatUrls } from 'request';

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
    if (e.keyCode === 13) {
      const payload = {
        username,
        message: text,
      };
      request({
        method: 'POST',
        url: ChatUrls.createChat,
        data: payload,
      });
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

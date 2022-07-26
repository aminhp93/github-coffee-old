import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import config from 'config';
import { ChatService } from 'services/chat';

function Chat() {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('test username');
  const [chats, setChats] = useState([] as any);

  const getChat = async () => {
    try {
      const res = await ChatService.getChatList();
      setChats(res.data)
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    // const username: any = window.prompt('Username: ', 'Anonymous');
    // setUsername(username);

    const pusher = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
      encrypted: true,
    } as any);
    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: any) => {
      setChats((old: any) => {
        return [...old, data];
      });
      setText('');
    });
  }, []);

  const handleTextChange = async (e: any) => {
    if (e.keyCode === 13) {
      const payload = {
        message: text,
      };
      // await ChatService.getChatList();
      const res = await ChatService.createChat(payload)
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

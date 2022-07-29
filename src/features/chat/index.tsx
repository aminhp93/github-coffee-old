import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import config from 'config';
import { ChatService } from 'services/chat';
import request from 'request';
import { channel } from 'diagnostics_channel';
import { Row, Col } from 'antd';

function Chat() {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('test username');
  const [chats, setChats] = useState([] as any);
  const [users, setUsers] = useState({} as any);

  const getChat = async () => {
    try {
      const res = await ChatService.getChatList();
      setChats(res.data);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const getPusherToken = (channel: string, socketId: string) => {
    return request({
      method: 'POST',
      data: {
        channel_name: channel,
        socket_id: socketId,
      },
      url: 'http://localhost:8000/api/chats/pusher/auth/',
    });
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
      authorizer: (channel: any) => {
        console.log(48, channel);
        return {
          authorize: async (socketId: any, cb: any) => {
            try {
              const res: any = await getPusherToken(channel.name, socketId);
              console.log('authSuccess', res);
              cb(false, res.data);
            } catch (e) {
              cb(true, e);
            }
          },
        };
      },
    } as any);
    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: any) => {
      setChats((old: any) => {
        return [...old, data];
      });
      setText('');
    });

    const presence_members_channel = pusher.subscribe('presence-members');

    presence_members_channel.bind(
      'pusher:subscription_succeeded',
      (data: any) => {
        console.log('subscription_succeeded', data);
        setUsers(data.members);
      }
    );

    presence_members_channel.bind('pusher:member_added', (data: any) => {
      console.log('member_added', data);
      const newUsers: any = { ...users };
      newUsers[data.id] = data.info;
      setUsers(newUsers);
    });

    presence_members_channel.bind('pusher:member_removed', (data: any) => {
      console.log('member_removed', data);
      const newUsers: any = { ...users };
      delete newUsers[data.id];
      setUsers(newUsers);
    });

    presence_members_channel.bind('pusher:subscription_error', (data: any) => {
      console.log('subscription_error', data);
    });
  }, []);

  const handleTextChange = async (e: any) => {
    if (e.keyCode === 13) {
      const payload = {
        message: text,
      };
      // await ChatService.getChatList();
      const res = await ChatService.createChat(payload);
    } else {
      setText(e.target.value);
    }
  };

  return (
    <div className="Chat">
      <Row>
        <Col span={12}>
          <div>
            <ChatList chats={chats} />
            <ChatBox
              text={text}
              username={username}
              handleTextChange={handleTextChange}
            />
          </div>
        </Col>
        <Col span={12}>
          <div>
            <div>All online users</div>
            <div>
              {Object.keys(users).map((i: any) => {
                return <div>{users[i].username}</div>;
              })}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Chat;

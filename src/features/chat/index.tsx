import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import ChatMessageList from './ChatMessageList';
import ChatBox from './ChatBox';
import ChatUserList from './ChatUserList';
import config from 'config';
import { ChatService } from 'services/chat';
import { Row, Col } from 'antd';

function Chat() {
  const [text, setText] = useState('');
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

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
      encrypted: true,
      authorizer: (channel: any) => {
        console.log(48, channel);
        return {
          authorize: async (socketId: any, cb: any) => {
            try {
              const res: any = await ChatService.getPusherToken(
                channel.name,
                socketId
              );
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
      console.log('member_added', data, users);

      setUsers((prevNewUsers: any) => {
        const newUsers: any = { ...prevNewUsers };
        newUsers[data.id] = data.info;
        return newUsers;
      });
    });

    presence_members_channel.bind('pusher:member_removed', (data: any) => {
      console.log('member_removed', data);
      setUsers((prevNewUsers: any) => {
        const newUsers: any = { ...prevNewUsers };
        delete newUsers[data.id];
        return newUsers;
      });
    });

    presence_members_channel.bind('pusher:subscription_error', (data: any) => {
      console.log('subscription_error', data);
    });
  }, []);

  const handleCb = async (data: any) => {
    const payload = {
      message: data.message,
    };
    await ChatService.createChat(payload);
  };

  return (
    <div className="Chat">
      <Row style={{ height: '100%' }}>
        <Col xs={0} sm={0} md={4}>
          <ChatUserList users={Object.values(users)} />
        </Col>
        <Col xs={24} sm={24} md={20} style={{ height: '100%' }}>
          <div className="ChatListMessagesContainer">
            <div style={{ flex: 1, overflow: 'auto' }}>
              <ChatMessageList chats={chats} />
            </div>
            <div>
              <ChatBox cb={handleCb} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Chat;

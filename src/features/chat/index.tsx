import { Box } from '@mui/material';
import { Col, Row } from 'antd';
import config from 'config';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { ChatService } from 'services/chat';
import ChatBox from './ChatBox';
import ChatMessageList from './ChatMessageList';
import ChatUserList from './ChatUserList';

interface IProps {
  hideOnlineUsers?: boolean;
}

const Chat = ({ hideOnlineUsers }: IProps) => {
  const [chats, setChats] = useState([] as any);
  const [users, setUsers] = useState({} as any);

  const getChat = async () => {
    try {
      const res = await ChatService.getChatList();
      res.data.sort((a: any, b: any) =>
        a.created_at.localeCompare(b.created_at)
      );
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
        const newChat = [...old, data];
        newChat.sort((a: any, b: any) =>
          a.created_at.localeCompare(b.created_at)
        );
        return newChat;
      });
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
    <div className="Chat height-100">
      <Row style={{ height: '100%' }}>
        <Col xs={0} sm={0} md={hideOnlineUsers ? 0 : 4}>
          <ChatUserList users={Object.values(users)} />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={hideOnlineUsers ? 24 : 20}
          style={{ height: '100%' }}
        >
          <Box
            className="ChatListMessagesContainer height-100 flex"
            style={{ flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Box
              style={{ flex: 1, overflow: 'auto', background: 'lightgreen' }}
            >
              <ChatMessageList chats={chats} />
            </Box>
            <Box sx={{ height: '100px' }}>
              <ChatBox cb={handleCb} />
            </Box>
          </Box>
        </Col>
      </Row>
    </div>
  );
};

export default Chat;

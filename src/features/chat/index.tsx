import config from '@/config';
import { Col, Divider } from 'antd';
import Pusher from 'pusher-js';
import React from 'react';
import ChatBox from './ChatBox';
import ChatMessageListItem from './ChatMessageListItem';
import ChatUserList from './ChatUserList';
import './index.less';
import ChatService from './service';
import { IChat } from './types';

interface Props {
  hideOnlineUsers?: boolean;
}

const Chat = ({ hideOnlineUsers }: Props) => {
  const bottomRef = React.useRef(null as any);

  const [chats, setChats] = React.useState([] as any);
  const [users, setUsers] = React.useState({} as any);

  const getChat = async () => {
    try {
      const res = await ChatService.getChatList();
      res.data.sort((a: any, b: any) =>
        a.created_at.localeCompare(b.created_at)
      );
      setChats(res.data);
    } catch (e) {
      //
    }
  };

  const handleCb = async (data: any) => {
    const payload = {
      message: data.message,
    };
    await ChatService.createChat(payload);
  };

  React.useEffect(() => {
    getChat();
  }, []);

  React.useEffect(() => {
    const pusher = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
      encrypted: true,
      authorizer: (channel: any) => {
        return {
          authorize: async (socketId: any, cb: any) => {
            try {
              const res: any = await ChatService.getPusherToken(
                channel.name,
                socketId
              );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  React.useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    const timeoutId = setTimeout(() => {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="Chat height-100">
      <Col xs={0} sm={0} md={hideOnlineUsers ? 0 : 4}>
        <ChatUserList users={Object.values(users)} />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={hideOnlineUsers ? 24 : 20}
        style={{ height: '100%' }}
      >
        <div className="ChatListMessagesContainer height-100 flex">
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div className="ChatMessageList">
              {chats.map((chat: IChat) => {
                return <ChatMessageListItem key={chat.id} chat={chat} />;
              })}
              <div ref={bottomRef} />
            </div>
            <Divider />
          </div>
          <div>
            <ChatBox cb={handleCb} />
          </div>
        </div>
      </Col>
    </div>
  );
};

export default Chat;

import { Col, Divider } from 'antd';
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
  const [users] = React.useState({} as any);

  const getChat = async () => {
    try {
      const res = await ChatService.getChatList();
      res?.data?.sort((a: any, b: any) =>
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

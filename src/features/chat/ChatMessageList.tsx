import { useRef, useEffect } from 'react';
import { Divider } from 'antd';
import { IChat } from 'types';
import ChatMessageListItem from './ChatMessageListItem';

interface IProps {
  chats: IChat[];
}

const ChatMessageList = ({ chats }: IProps) => {
  const bottomRef = useRef(null as any);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    console.log('20', bottomRef);
    const timeoutId = setTimeout(() => {
      console.log('22', bottomRef);
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className="ChatMessageList">
        {chats.map((chat: IChat) => {
          return <ChatMessageListItem chat={chat} />;
        })}
        <div ref={bottomRef} />
      </div>
      <Divider />
    </>
  );
};

export default ChatMessageList;

import { Divider } from 'antd';
import { IChat } from 'types';
import ChatMessageListItem from './ChatMessageListItem';

interface IProps {
  chats: IChat[];
}

const ChatMessageList = ({ chats }: IProps) => (
  <>
    <div className="ChatMessageList">
      {chats.map((chat: IChat) => {
        return <ChatMessageListItem chat={chat} />;
      })}
    </div>
    <Divider />
  </>
);

export default ChatMessageList;

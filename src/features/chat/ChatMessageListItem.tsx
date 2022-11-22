import { Divider, Input } from 'antd';
import { IChat } from 'libs/types';

interface IProps {
  chat: IChat;
}

const ChatMessageListItem = ({ chat }: IProps) => {
  return (
    <>
      <div className="flex">
        <div
          className="ChatMessageListItem-avatar"
          style={{ width: '50px', background: 'red' }}
        >
          ID: {chat.sender}
        </div>
        <div className="ChatMessageListItem-message-container flex-1">
          {/* <CustomPlate
            id={`ChatMessageListItem-${chat.id}`}
            hideToolBar
            readOnly
            value={getParsedJson(chat.message)}
          /> */}
          <Input value={chat.message} />
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ChatMessageListItem;

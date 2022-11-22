import { Divider } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { IChat } from 'libs/types';
import { getParsedJson } from 'libs/utils';

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
          <CustomPlate
            id={`ChatMessageListItem-${chat.id}`}
            hideToolBar
            readOnly
            value={getParsedJson(chat.message)}
          />
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ChatMessageListItem;

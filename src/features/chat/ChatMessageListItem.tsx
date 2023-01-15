import { Divider } from 'antd';
import moment from 'moment';
import './index.less';
import { IChat } from './types';

interface Props {
  chat: IChat;
}

const ChatMessageListItem = ({ chat }: Props) => {
  return (
    <>
      <div className="flex" style={{ margin: '8px 0' }}>
        <div className="ChatMessageListItem-avatar">{chat.sender}</div>
        <div className="flex-1">
          <div className="ChatMessageListItem-message-container">
            {chat.message}{' '}
            <span className="ChatMessageListItem-message-time">
              {moment(chat.createdAt).format('HH:mm')}
            </span>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ChatMessageListItem;

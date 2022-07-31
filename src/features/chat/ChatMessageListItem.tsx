import { v4 as uuidv4 } from 'uuid';
import { Divider } from 'antd';
import moment from 'moment';
import { IChat } from 'types';
import { getParsedJson } from 'utils';
import CustomPlate from 'components/CustomPlate';

interface IProps {
  chat: IChat;
}

const ChatMessageListItem = ({ chat }: IProps) => {
  console.log(13, getParsedJson(chat.message));
  return (
    <>
      <div key={uuidv4()} className="flex">
        <div className="ChatMessageListItem-avatar">ID: {chat.sender}</div>
        <div className="ChatMessageListItem-message-container">
          <div>{moment(chat.created_at).format('YYYY-MM-DD, hh:mm')}</div>
          <div>
            <CustomPlate
              id={String(uuidv4())}
              hideToolBar
              value={getParsedJson(chat.message)}
            />
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ChatMessageListItem;

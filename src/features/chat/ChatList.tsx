import './ChatList.css';
import { v4 as uuidv4 } from 'uuid';
import { Divider } from 'antd';
import moment from 'moment';
interface IProps {
  chats: any;
}

const ChatList = ({ chats }: IProps) => (
  <ul>
    {chats.map((chat: any) => {
      return (
        <div key={uuidv4()} className="box">
          <div style={{ display: 'flex' }}>
            <div style={{ background: 'white', width: '100px' }}>
              UserID: {chat.sender}
            </div>

            <div style={{ marginLeft: '20px' }}>
              <div>{moment(chat.created_at).format('YYYY-MM-DD, hh:mm')}</div>
              <div>{chat.message}</div>
            </div>
          </div>

          <Divider />
        </div>
      );
    })}
  </ul>
);

export default ChatList;

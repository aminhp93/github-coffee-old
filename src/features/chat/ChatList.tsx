import './ChatList.css';
import { v4 as uuidv4 } from 'uuid';
interface IProps {
  chats: any;
}

const ChatList = ({ chats }: IProps) => (
  <ul>
    {chats.map((chat: any) => {
      return (
        <div>
          <div className="row show-grid">
            <div className="col-xs-12">
              <div className="chatMessage">
                <div key={uuidv4()} className="box">
                  <p>
                    <strong>{chat.username}</strong>
                  </p>
                  <p>{chat.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </ul>
);

export default ChatList;

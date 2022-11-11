import { Divider } from 'antd';
import { IUser } from 'libs/types';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  users: IUser[];
}

const ChatListUsers = ({ users }: IProps) => {
  return (
    <div className="ChatListUsers">
      <div>All online users</div>
      {users.map((user: IUser) => {
        return (
          <>
            <div key={uuidv4()}>
              {user.id} - {user.username}
            </div>
            <Divider />
          </>
        );
      })}
    </div>
  );
};

export default ChatListUsers;

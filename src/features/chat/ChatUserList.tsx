import { v4 as uuidv4 } from 'uuid';
import { Divider } from 'antd';
import { IUser } from 'types';

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
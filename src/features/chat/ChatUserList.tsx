import { Divider } from 'antd';
import { IUser } from 'features/user/types';
import { v4 as uuidv4 } from 'uuid';
import './index.less';

interface Props {
  users: IUser[];
}

const ChatListUsers = ({ users }: Props) => {
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

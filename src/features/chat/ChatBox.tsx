import { Input } from 'antd';
import { useState } from 'react';
import './Chat.less';

type Props = {
  cb: (data: { message: string }) => void;
};

const ChatBox = ({ cb }: Props) => {
  const [message, setMessage] = useState('');

  const handlePressEnter = async () => {
    cb && cb({ message });
    setMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Input
      value={message}
      onChange={handleChange}
      onPressEnter={handlePressEnter}
    />
  );
};

export default ChatBox;

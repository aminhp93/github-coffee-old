import { Input } from 'antd';
import { useState } from 'react';
import './Chat.less';

type Props = {
  cb: any;
};

const ChatBox = ({ cb }: Props) => {
  const [message, setMessage] = useState('');

  const handlePressEnter = async () => {
    cb && cb({ message });
    setMessage('');
  };

  const handleChange = (e: any) => {
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

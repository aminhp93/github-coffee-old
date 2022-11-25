import { Input } from 'antd';
import React from 'react';
import './ChatBox.less';
interface IProps {
  cb: any;
}

const ChatBox = ({ cb }: IProps) => {
  const [message, setMessage] = React.useState('');

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

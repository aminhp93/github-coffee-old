import { Box } from '@mui/material';
import { Divider } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { IChat } from 'types';
import { getParsedJson } from 'utils';

interface IProps {
  chat: IChat;
}

const ChatMessageListItem = ({ chat }: IProps) => {
  console.log(13, getParsedJson(chat.message));
  return (
    <>
      <Box className="flex">
        <Box
          className="ChatMessageListItem-avatar"
          sx={{ width: '50px', background: 'red' }}
        >
          ID: {chat.sender}
        </Box>
        <Box className="ChatMessageListItem-message-container flex-1">
          <CustomPlate
            id={`ChatMessageListItem-${chat.id}`}
            hideToolBar
            value={getParsedJson(chat.message)}
          />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default ChatMessageListItem;

import request from '@/services/request';
import config from '@/config';

const baseUrl = config.apiUrl;

export const ChatUrls = {
  getChatList: `${baseUrl}/api/chats/`,
  createChat: `${baseUrl}/api/chats/`,
  getPusherToken: `${baseUrl}/api/chats/pusher/auth/`,
};

const ChatService = {
  getChatList() {
    return request({
      method: 'GET',
      url: ChatUrls.getChatList,
    });
  },
  createChat(data: any) {
    return request({
      method: 'POST',
      url: ChatUrls.createChat,
      data,
    });
  },
  getPusherToken(channel: string, socketId: string) {
    return request({
      method: 'POST',
      data: {
        channel_name: channel,
        socket_id: socketId,
      },
      url: ChatUrls.getPusherToken,
    });
  },
};

export default ChatService;

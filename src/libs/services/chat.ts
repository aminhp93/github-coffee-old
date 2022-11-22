import request, { ChatUrls } from 'libs/request';

export const ChatService = {
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
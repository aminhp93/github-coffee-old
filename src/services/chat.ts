import request, { ChatUrls } from 'request';

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
};

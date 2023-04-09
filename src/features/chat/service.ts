import supabase from '@/services/supabase';

const ChatService = {
  getChatList: () => {
    return supabase.from('chat').select();
  },
  createChat: (data: any) => {
    return supabase.from('chat').select();
  },
  getPusherToken(channel: string, socketId: string) {
    return supabase.from('chat').select();
  },
};

export default ChatService;

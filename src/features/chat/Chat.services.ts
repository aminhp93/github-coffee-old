import supabase from '@/services/supabase';
import { Chat } from './Chat.types';

const ChatService = {
  createChat(data: Partial<Chat>) {
    return supabase.from('chat').insert([data]).select();
  },
  listChat() {
    return supabase.from('chat').select();
  },
  detailChat(chatId: number) {
    return supabase.from('chat').select().eq('id', chatId);
  },
  updateChat(chatId: number, data: Partial<Chat>) {
    return supabase.from('chat').update(data).eq('id', chatId).select();
  },
  deleteChat(chatId: number) {
    return supabase.from('chat').delete().eq('id', chatId);
  },
};

export default ChatService;

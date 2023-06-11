import produce from 'immer';
import { create } from 'zustand';
import { ChatCollection } from './Chat.types';

type ChatStore = {
  chats: ChatCollection;
  setChats: (chats: ChatCollection) => void;
  addChats: (chats: ChatCollection) => void;
};

const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},
  setChats: (chats: ChatCollection) =>
    set(
      produce((draft) => {
        draft.chats = chats;
      })
    ),
  addChats: (chats: ChatCollection) =>
    set(
      produce((draft) => {
        draft.chats = { ...get().chats, ...chats };
      })
    ),
}));

export default useChatStore;

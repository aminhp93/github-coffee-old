// Import react;
import { useRef, useEffect } from 'react';

// Import third-party libraries;
import { Col, Divider, notification } from 'antd';

import ChatBox from './ChatBox';
import ChatMessageListItem from './ChatMessageListItem';
import './Chat.less';
import ChatService from './Chat.services';
import { Chat, ChatCollection } from './Chat.types';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import supabase from '@/services/supabase';
import useChatStore from './Chat.store';
import { keyBy } from 'lodash';

type Props = {
  hideOnlineUsers?: boolean;
};

const ChatPage = ({ hideOnlineUsers }: Props) => {
  const bottomRef = useRef(null as any);
  const { authUser }: AuthUserContext = useAuth();

  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const addChats = useChatStore((state) => state.addChats);

  const handleCb = async (data: any) => {
    try {
      const payload = {
        message: data.message,
        sender: authUser?.id,
      };
      const res = await ChatService.createChat(payload);
      if (res.data?.length === 1) {
        setChats({
          ...chats,
          [res.data[0].id]: res.data[0],
        });
      }
    } catch (e) {
      notification.error({ message: 'Error create chat' });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await ChatService.listChat();
        res.data?.sort((a: any, b: any) =>
          a.created_at.localeCompare(b.created_at)
        );

        setChats(keyBy(res.data, 'id') as ChatCollection);
      } catch (e) {
        //
      }
    })();
  }, [setChats]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    const timeoutId = setTimeout(() => {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const chat = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat' },
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'INSERT') {
            const newData = payload.new as Chat;

            addChats({
              [newData.id]: newData,
            });
          }
        }
      )
      .subscribe();

    return () => {
      chat.unsubscribe();
    };
  }, [addChats]);

  console.log(chats);

  return (
    <div className="Chat height-100">
      <Col
        xs={24}
        sm={24}
        md={hideOnlineUsers ? 24 : 20}
        style={{ height: '100%' }}
      >
        <div className="ChatListMessagesContainer height-100 flex">
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div className="ChatMessageList">
              {Object.values(chats).map((chat: Chat) => {
                return <ChatMessageListItem key={chat.id} chat={chat} />;
              })}
              <div ref={bottomRef} />
            </div>
            <Divider />
          </div>
          <div>
            <ChatBox cb={handleCb} />
          </div>
        </div>
      </Col>
    </div>
  );
};

export default ChatPage;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import PostDetail from 'features/post/PostDetail';
import PostService from 'features/post/Post.service';
import usePostStore from 'features/post/Post.store';
import { Post } from 'features/post/Post.types';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import BookingService from './Booking.services';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import supabase from '@/services/supabase';
import { Booking } from './Booking.types';

const BookingPage = () => {
  const { authUser }: AuthUserContext = useAuth();
  const [api, contextHolder] = notification.useNotification();

  const [showPostDetail, setShowPostDetail] = useState(false);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const handleFindPartner = async () => {
    try {
      if (!authUser?.id) return;
      const dataRequest = {
        creator: authUser.id,
      };
      const res = await BookingService.createBooking(dataRequest);
      if (res.data && res.data.length === 1) {
        setCurrentBooking(res.data[0] as Booking);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await PostService.detailPost(41);
        console.log(res);
        if (res?.data && res.data.length === 1) {
          setSelectedPost(res.data[0] as Post);
        }
      } catch (e) {
        console.log(e);
      }
    };

    init();
  }, [setSelectedPost]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await BookingService.listBooking({
          creator: authUser?.id,
          status: 1,
        });
        console.log(res);
        if (res?.data && res.data.length > 0) {
          setCurrentBooking(res.data[0] as Booking);
        }
      } catch (e) {
        console.log(e);
      }
    };

    init();
  }, []);

  console.log(currentBooking);

  useEffect(() => {
    if (!currentBooking) return;
    api.success({
      key: 'booking',
      message: 'Finding partner',
      duration: 0,
      onClick: () => {
        console.log('Notification Clicked!');
      },
      onClose: async () => {
        console.log('closed');
        if (!currentBooking) return;
        await BookingService.deleteBooking(currentBooking?.id);
      },
    });
    return () => {
      if (!currentBooking) return;
      const init = async () => {
        try {
          console.log('deleted');
          await BookingService.deleteBooking(currentBooking?.id);
        } catch (e) {
          console.log(e);
        }
      };
      init();
    };
  }, [currentBooking, api]);

  useEffect(() => {
    const chat = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'booking' },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      chat.unsubscribe();
    };
  }, []);

  return (
    <div>
      Booking
      {contextHolder}
      <Button
        size="small"
        icon={showPostDetail ? <DownOutlined /> : <UpOutlined />}
        onClick={() => setShowPostDetail(!showPostDetail)}
      />
      {showPostDetail && <PostDetail />}
      <Button onClick={handleFindPartner}>Find partner</Button>
      {/* {listBookings.map((booking: Booking) => {
        return <div>{booking.id}</div>;
      })} */}
    </div>
  );
};

export default BookingPage;

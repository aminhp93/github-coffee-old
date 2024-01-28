import supabase from '@/services/supabase';
import { Booking } from './Booking.types';

const BookingService = {
  createBooking(data: Partial<Booking>) {
    return supabase.from('booking').insert([data]).select();
  },
  listBooking(params?: Partial<Booking>) {
    const tag = params && Object.hasOwn(params, 'tag');

    return supabase
      .from('booking')
      .select()
      .eq('creator', params?.creator)
      .eq(tag ? 'tag' : '', params?.tag);
  },
  detailBooking(bookingId: number) {
    return supabase.from('booking').select().eq('id', bookingId);
  },
  updateBooking(bookingId: number, data: Partial<Booking>) {
    return supabase.from('booking').update(data).eq('id', bookingId).select();
  },
  deleteBooking(bookingId: number) {
    return supabase.from('booking').delete().eq('id', bookingId);
  },
};

export default BookingService;

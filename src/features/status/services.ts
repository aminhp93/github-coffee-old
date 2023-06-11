import supabase from '@/services/supabase';
import { Status } from './types';

const StatusService = {
  createStatus(data: Partial<Status>) {
    return supabase.from('status').insert([data]).select();
  },
  listStatus() {
    return supabase.from('status').select();
  },
  detailStatus(statusId: number) {
    return supabase.from('status').select().eq('id', statusId);
  },
  updateStatus(statusId: number, data: Partial<Status>) {
    return supabase.from('status').update(data).eq('id', statusId).select();
  },
  deleteStatus(statusId: number) {
    return supabase.from('status').delete().eq('id', statusId);
  },
};

export default StatusService;

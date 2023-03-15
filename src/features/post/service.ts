import supabase from '@/services/supabase';
import { Post } from './types';

const PostService = {
  createPost(data: Partial<Post>) {
    return supabase.from('post').insert([data]).select();
  },
  listPost() {
    return supabase.from('post').select();
  },
  detailPost(postId: number) {
    return supabase.from('post').select().eq('id', postId);
  },
  updatePost(postId: number, data: Partial<Post>) {
    return supabase.from('post').update(data).eq('id', postId).select();
  },
  deletePost(postId: number) {
    return supabase.from('post').delete().eq('id', postId);
  },
};

export default PostService;

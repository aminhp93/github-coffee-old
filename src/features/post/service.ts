import supabase from '@/services/supabase';
import { Post } from './types';

const PostService = {
  createPost(data: Partial<Post>) {
    return supabase.from('post').insert([data]).select();
  },
  listPost(params?: Partial<Post>) {
    const isDone = params && Object.hasOwnProperty.call(params, 'isDone');
    const tag = params && Object.hasOwnProperty.call(params, 'tag');

    return supabase
      .from('post')
      .select()
      .eq(isDone ? 'isDone' : '', params?.isDone)
      .eq(tag ? 'tag' : '', params?.tag);
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

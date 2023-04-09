import supabase from '@/services/supabase';
import { Tag } from '@/types/tag';

const TagService = {
  createTag(data: Partial<Tag>) {
    return supabase.from('tag').insert([data]).select();
  },
  listTag() {
    return supabase.from('tag').select();
  },
  detailTag(tagId: number) {
    return supabase.from('tag').select().eq('id', tagId);
  },
  updateTag(tagId: number, data: Partial<Tag>) {
    return supabase.from('tag').update(data).eq('id', tagId).select();
  },
  deleteTag(tagId: number) {
    return supabase.from('tag').delete().eq('id', tagId);
  },
};

export default TagService;

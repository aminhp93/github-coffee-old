import supabase from '@/services/supabase';

const UserService = {
  getAuthUser() {
    return supabase.from('user').select();
  },
  getAccessToken() {
    return supabase.from('user').select();
  },
  getPublic() {
    return supabase.from('user').select();
  },
  getProtected() {
    return supabase.from('user').select();
  },
};

export default UserService;

import supabase from '@/services/supabase';

const TestService = {
  test: () => {
    return supabase.from('test').select();
  },
  startJob: () => {
    return supabase.from('test').select();
  },
};

export default TestService;

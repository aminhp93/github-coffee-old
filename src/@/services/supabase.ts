import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_KEY as string
);

export default supabase;

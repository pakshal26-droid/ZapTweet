import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_YOUR_SUPABASE_URL; // Replace with your Supabase URL
const supabaseAnonKey = process.env.REACT_APP_YOUR_SUPABASE_ANON_KEY; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
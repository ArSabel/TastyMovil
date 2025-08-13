import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrzditusihzyomgxfzdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yemRpdHVzaWh6eW9tZ3hmemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTYwMDIsImV4cCI6MjA2NzY5MjAwMn0.j9WLQw810MzaX5ojZvHvMFbvaq6KGxFr3pGukWixLCw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
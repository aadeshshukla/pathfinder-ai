import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozowocttalqgppxokurz.supabase.co'; // your actual Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b3dvY3R0YWxxZ3BweG9rdXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzA3MTAsImV4cCI6MjA2OTIwNjcxMH0.aCIb4f6a5wB4RhofiB96Z0THrrCtIOxX74CNSOhnlw0';

export const supabase = createClient(supabaseUrl, supabaseKey);

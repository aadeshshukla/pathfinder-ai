// src/supabase.js

import { createClient } from '@supabase/supabase-js';

// Use the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // <-- CHANGE THIS LINE
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // <-- CHANGE THIS LINE

export const supabase = createClient(supabaseUrl, supabaseKey);

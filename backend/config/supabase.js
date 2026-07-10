const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Server-side Supabase client using the SERVICE ROLE key.
// NEVER expose SUPABASE_SERVICE_KEY to the frontend — it bypasses Row Level Security.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: { persistSession: false },
    });
} else {
    console.warn('[supabase] SUPABASE_URL / SUPABASE_SERVICE_KEY not set — file uploads to Supabase Storage are disabled.');
}

module.exports = supabase;

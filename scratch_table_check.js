require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function setup() {
  try {
    // We cannot run DDL (CREATE TABLE) easily without service role via standard API.
    // Instead, I'll check if the table exists by inserting a dummy row and catching errors,
    // or by fetching from it. If it doesn't exist, I'll instruct the user to create it in their Supabase dashboard,
    // OR I can use the existing `qeydiyyatlar` or `telebeler` table.
    
    // Let's just check what tables exist via selecting from them
    const tables = ['users', 'telebeler', 'qeydiyyat', 'registrations'];
    for (const t of tables) {
      const { data, error } = await supabase.from(t).select('*').limit(1);
      if (error) {
        console.log(`Table ${t} does not exist or error:`, error.message);
      } else {
        console.log(`Table ${t} EXISTS!`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

setup();

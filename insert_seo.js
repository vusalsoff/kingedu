import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'google_site_verification');

  if (data && data.length > 0) {
    await supabase.from('settings').update({ value: 'lntuqE8vzXFaEfa0umKLSZFKUtn_ItEX8AYpGVHo0YU' }).eq('key', 'google_site_verification');
  } else {
    await supabase.from('settings').insert([{ key: 'google_site_verification', value: 'lntuqE8vzXFaEfa0umKLSZFKUtn_ItEX8AYpGVHo0YU' }]);
  }
  
  console.log("Updated google_site_verification successfully!");
}

run();

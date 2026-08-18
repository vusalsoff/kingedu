import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const newTitle = "King Education Company MMC | Kurs & Təlim & İnkişaf";
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'seo_title');

  if (data && data.length > 0) {
    await supabase.from('settings').update({ value: newTitle }).eq('key', 'seo_title');
  } else {
    await supabase.from('settings').insert([{ key: 'seo_title', value: newTitle }]);
  }
  
  console.log("Updated seo_title successfully!");
}

run();

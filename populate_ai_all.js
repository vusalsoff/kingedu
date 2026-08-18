const https = require('https');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const csvUrl = 'https://docs.google.com/spreadsheets/d/1E8ebVcuSvYSSnEpPRYKusP7Zqr-yZtf6hd4NHufdRQ0/export?format=csv&gid=0';

function fetchCsv(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchCsv(res.headers.location));
      } else {
        let data = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data).toString('utf8')));
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

async function run() {
  try {
    const csvData = await fetchCsv(csvUrl);
    const records = parse(csvData, { skip_empty_lines: true });
    const ai_knowledge = [];
    
    for (let i = 1; i < records.length; i++) {
      const row = records[i];
      const kursName = row[0]?.trim();
      if (kursName && kursName.length > 2) {
        const answer = `Müddəti: ${row[1]?.trim() || '-'}
Keçirilmə Forması: ${row[2]?.trim() || '-'}
Kursun Qiyməti (Aylıq): ${row[3]?.trim() || '-'}
Kimlər Üçündür?: ${row[4]?.trim() || '-'}
Kursun Qısa Məzmunu: ${row[5]?.trim() || '-'}`;
        ai_knowledge.push({ id: Date.now() + Math.random(), question: `Kurs: ${kursName}`, answer: answer });
      }
      const marafonName = row[10]?.trim();
      if (marafonName && marafonName.length > 2) {
        const answer = `Qiyməti: ${row[11]?.trim() || '-'}
Müddəti (Ay): ${row[12]?.trim() || '-'}
Daxildir: ${row[13]?.trim() || '-'}
Dərsin növü: ${row[14]?.trim() || '-'}
Əlaqə nömrəsi: ${row[15]?.trim() || '-'}`;
        ai_knowledge.push({ id: Date.now() + Math.random(), question: `Marafon: ${marafonName}`, answer: answer });
      }
      const sual = row[20]?.trim();
      const cavab = row[21]?.trim();
      if (sual && cavab) {
        ai_knowledge.push({ id: Date.now() + Math.random(), question: sual, answer: cavab });
      }
    }
    
    console.log(`Generated ${ai_knowledge.length} Q&A pairs for Ai Şahzadə.`);
    const { error } = await supabase.from('settings').update({ value: JSON.stringify(ai_knowledge) }).eq('key', 'ai_knowledge');
    if (error) throw error;
    console.log("Successfully pushed to Supabase settings table!");
  } catch (err) {
    console.error(err);
  }
}

run();

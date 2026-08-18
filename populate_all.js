const https = require('https');
const { parse } = require('csv-parse/sync');

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

function postData(sheetName, data) {
  return new Promise((resolve, reject) => {
    const postDataStr = JSON.stringify({
      action: sheetName === 'ai_knowledge' ? 'update_all' : 'add',
      sheetName: sheetName,
      data: data
    });
    
    // Note: Since 'add' expects a single item for kurslar/marafonlar in our current API, 
    // we need to send them one by one if it's not ai_knowledge.
    const req = require('http').request('http://localhost:3000/api/admin/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postDataStr)
      }
    }, (res) => {
      let resBody = '';
      res.on('data', d => resBody += d);
      res.on('end', () => {
        resolve(resBody);
      });
    });
    
    req.on('error', reject);
    req.write(postDataStr);
    req.end();
  });
}

async function run() {
  try {
    const csvData = await fetchCsv(csvUrl);
    const records = parse(csvData, {
      skip_empty_lines: true
    });
    
    const kurslar = [];
    const marafonlar = [];
    
    for (let i = 1; i < records.length; i++) {
      const row = records[i];
      
      // Kurslar (Columns 0-5)
      const kursName = row[0]?.trim();
      if (kursName && kursName.length > 2) {
        kurslar.push({
          title: kursName,
          duration: row[1]?.trim() || '',
          type: row[2]?.trim() || '',
          price: row[3]?.trim() || '',
          description: row[5]?.trim() || row[4]?.trim() || '',
          image: '' // No image in sheet
        });
      }
      
      // Marafonlar (Columns 10-14)
      const marafonName = row[10]?.trim();
      if (marafonName && marafonName.length > 2) {
        marafonlar.push({
          title: marafonName,
          price: row[11]?.trim() || '',
          duration: row[12]?.trim() || '',
          description: row[13]?.trim() || '',
          date: '',
          image: ''
        });
      }
    }
    
    console.log(`Found ${kurslar.length} Kurslar.`);
    console.log(`Found ${marafonlar.length} Marafonlar.`);
    
    // Upload Kurslar one by one
    for (const k of kurslar) {
      await postData('kurslar', k);
    }
    console.log("Uploaded all Kurslar");
    
    // Upload Marafonlar one by one
    for (const m of marafonlar) {
      await postData('marafonlar', m);
    }
    console.log("Uploaded all Marafonlar");

  } catch (err) {
    console.error(err);
  }
}

run();

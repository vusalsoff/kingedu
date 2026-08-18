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

async function run() {
  try {
    const csvData = await fetchCsv(csvUrl);
    const records = parse(csvData, {
      skip_empty_lines: true
    });
    
    // In this sheet, Questions are usually in column 20, Answers in 21
    // Let's find the headers "Sual" and "Hazır cavab" or similar
    let questionIndex = -1;
    let answerIndex = -1;
    
    // Check first few rows for headers
    for (let i = 0; i < 5; i++) {
      if (!records[i]) continue;
      const qIdx = records[i].findIndex(c => c.toLowerCase().includes('sual'));
      const aIdx = records[i].findIndex(c => c.toLowerCase().includes('cavab'));
      
      if (qIdx !== -1 && aIdx !== -1) {
        questionIndex = qIdx;
        answerIndex = aIdx;
        break;
      }
    }
    
    if (questionIndex === -1 || answerIndex === -1) {
      // Fallback to absolute index 20 and 21 based on previous checks
      questionIndex = 20;
      answerIndex = 21;
    }
    
    const qaData = [];
    
    for (let i = 1; i < records.length; i++) {
      const row = records[i];
      if (row.length <= questionIndex) continue;
      
      const question = row[questionIndex]?.trim();
      const answer = row[answerIndex]?.trim();
      
      if (question && answer && question.length > 5 && answer.length > 5) {
        qaData.push({
          id: Date.now() + Math.floor(Math.random() * 1000) + i,
          question,
          answer
        });
      }
    }
    
    console.log(`Found ${qaData.length} Q&A pairs.`);
    
    // Now POST to local dev server to save it
    const postData = JSON.stringify({
      action: 'update_all',
      sheetName: 'ai_knowledge',
      data: qaData
    });
    
    const req = require('http').request('http://localhost:3000/api/admin/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let resBody = '';
      res.on('data', d => resBody += d);
      res.on('end', () => {
        console.log('Response from local server:', res.statusCode, resBody);
      });
    });
    
    req.on('error', (e) => {
      console.error('Error posting to local server:', e.message);
    });
    
    req.write(postData);
    req.end();
    
  } catch (err) {
    console.error(err);
  }
}

run();

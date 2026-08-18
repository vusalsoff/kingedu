const https = require('https');
const fs = require('fs');

const csvUrl = 'https://docs.google.com/spreadsheets/d/1E8ebVcuSvYSSnEpPRYKusP7Zqr-yZtf6hd4NHufdRQ0/export?format=csv&gid=0';

function followRedirects(url, callback) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      followRedirects(res.headers.location, callback);
    } else {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        callback(buffer.toString('utf8'));
      });
    }
  }).on('error', err => console.error(err));
}

followRedirects(csvUrl, (csvData) => {
  // Parse CSV
  const rows = csvData.split('\n');
  const qaPairs = [];

  for (let row of rows) {
    // Very basic CSV parse, better to match columns O and P (indices 14 and 15 in zero-index)
    // But since quotes can contain commas, let's use a regex
    const columns = [];
    let inQuotes = false;
    let currentColumn = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(currentColumn.trim());
        currentColumn = '';
      } else {
        currentColumn += char;
      }
    }
    columns.push(currentColumn.trim());

    // In the sheet, Q&A starts at column 12 or 13, let's find the non-empty ones
    // Usually columns array length is ~16
    const q = columns[10] || columns[11] || columns[12] || '';
    const a = columns[11] || columns[12] || columns[13] || '';
    
    // Look backwards from the end, Question is second to last, Answer is last
    // Let's print out the raw columns to be sure
  }
  
  // Let's just output it nicely to inspect the columns first
  fs.writeFileSync('parsed_ai.json', JSON.stringify(rows.map(r => r.split(',')), null, 2));
  console.log("Saved parsed_ai.json");
});

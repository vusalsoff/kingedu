const fs = require('fs');
const env = require('dotenv').parse(fs.readFileSync('.env.local'));
let key = env.GOOGLE_PRIVATE_KEY;
if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
key = key.replace(/\\n/g, '\n');
const email = env.GOOGLE_CLIENT_EMAIL.replace(/^"|"$/g, '');
const { google } = require('googleapis');
const auth = new google.auth.JWT({ email: email, key: key, scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'] });
const drive = google.drive({ version: 'v3', auth });
const stream = require('stream');
const base64Str = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
const buffer = Buffer.from(matches[2], 'base64');
const bufferStream = new stream.PassThrough();
bufferStream.end(buffer);
drive.files.create({
  resource: { name: 'test_final.png' },
  media: { mimeType: matches[1], body: bufferStream },
  fields: 'id, webViewLink'
}).then(res => console.log('UPLOAD SUCCESS:', res.data.id)).catch(err => console.error('UPLOAD ERROR:', err.message));

const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});
let key = env.GOOGLE_PRIVATE_KEY;
if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
key = key.replace(/\\n/g, '\n');

const email = env.GOOGLE_CLIENT_EMAIL.replace(/^"|"$/g, '');

const { google } = require('googleapis');
const auth = new google.auth.JWT(
  email,
  null,
  key,
  ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive']
);
auth.authorize((err, tokens) => {
  if (err) console.error('AUTH ERROR:', err.message);
  else console.log('AUTH SUCCESS:', !!tokens.access_token);
});

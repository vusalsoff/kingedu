const https = require('https');
const fs = require('fs');
const path = require('path');

const token = 'YOUR_VERCEL_TOKEN';
const teamId = 'team_X93tpR5PvCSiKJbvzwlTWVTI';
const deploymentId = 'dpl_25YEjzkZvjU9qV6KEKJXQ4ynp2VL';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function downloadFile(uid, targetPath) {
  return new Promise((resolve, reject) => {
    const url = `https://api.vercel.com/v8/deployments/${deploymentId}/files/${uid}?teamId=${teamId}`;
    request(url).then(res => {
        if (res && res.data) {
            const content = Buffer.from(res.data, 'base64');
            const dir = path.dirname(targetPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(targetPath, content);
            resolve();
        } else {
            console.error(`Failed to download ${uid} to ${targetPath}. Invalid response.`);
            resolve();
        }
    }).catch(reject);
  });
}

async function processNode(node, currentPath) {
    let count = 0;
    const nodePath = path.join(currentPath, node.name);
    
    if (node.type === 'directory') {
        if (node.children) {
            for (const child of node.children) {
                count += await processNode(child, nodePath);
            }
        }
    } else if (node.type === 'file' && node.uid) {
        // Skip large media files that weren't corrupted to save time/bandwidth, we only corrupted .js, .jsx, .css, .md
        if (nodePath.endsWith('.js') || nodePath.endsWith('.jsx') || nodePath.endsWith('.css') || nodePath.endsWith('.md')) {
            await downloadFile(node.uid, nodePath);
            count++;
            console.log(`Recovered: ${nodePath}`);
        }
    }
    return count;
}

async function restore() {
  try {
    const filesData = await request(`https://api.vercel.com/v6/deployments/${deploymentId}/files?teamId=${teamId}`);
    
    let totalCount = 0;
    for (const node of filesData) {
      if (node.name === 'src') {
        const rootPath = __dirname;
        console.log('Found src! Starting recursive download of JS/CSS/MD files...');
        totalCount += await processNode(node, rootPath);
      }
    }
    console.log(`Successfully recovered ${totalCount} files!`);
  } catch (e) {
    console.error('Error:', e);
  }
}

restore();

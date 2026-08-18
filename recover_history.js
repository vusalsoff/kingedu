const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
const targetDir = 'c%3A/Users/HONOR/OneDrive/Documents/kingsEdu/src'.toLowerCase();

let recoveredCount = 0;

function scanHistory() {
  const folders = fs.readdirSync(historyDir);
  for (const folder of folders) {
    const folderPath = path.join(historyDir, folder);
    const entriesPath = path.join(folderPath, 'entries.json');
    if (fs.existsSync(entriesPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
        const resource = String(data.resource).toLowerCase();
        if (resource.includes(targetDir)) {
          const entries = data.entries || [];
          let bestEntry = null;
          
          for (let i = entries.length - 1; i >= 0; i--) {
            const entry = entries[i];
            const filePath = path.join(folderPath, entry.id);
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);
              if (stats.size < 80000) { 
                bestEntry = entry;
                break;
              }
            }
          }
          
          if (bestEntry) {
            let originalPath = decodeURIComponent(data.resource.replace('file:///', ''));
            // Fix Windows path
            if (originalPath.startsWith('c%3A') || originalPath.startsWith('c:')) {
                originalPath = originalPath.substring(originalPath.indexOf('/') + 1);
            }
            originalPath = 'C:/' + originalPath.replace(/^c%3A\//i, '').replace(/^c:\//i, '');
            const srcFilePath = path.join(folderPath, bestEntry.id);
            const content = fs.readFileSync(srcFilePath, 'utf8');
            
            if (!content.includes('istirakiIistirakis')) {
               fs.writeFileSync(originalPath, content, 'utf8');
               console.log('Recovered: ' + originalPath);
               recoveredCount++;
            }
          }
        }
      } catch (e) {
      }
    }
  }
}

scanHistory();
console.log('Recovered ' + recoveredCount + ' files from VS Code history.');

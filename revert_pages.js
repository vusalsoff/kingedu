const fs = require('fs');
const path = require('path');

const pages = [
  'elaqe/page.js',
  'mezunlar/page.js',
  'kurslar/page.js',
  'telimler/page.js',
  'marafonlar/page.js',
  'pdf-kitablar/page.js',
  'konulluluk/page.js',
  'sosial-media/page.js',
  'sened-yoxlama/page.js'
];

const basePath = path.join(__dirname, 'src', 'app');

for (const page of pages) {
  const fullPath = path.join(basePath, page);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Remove the injected metadata block
    const match = content.match(/^export const metadata = \{\n\s*title: ".*"\n\};\n\n/);
    if (match) {
      content = content.replace(match[0], '');
      fs.writeFileSync(fullPath, content);
      console.log(`Reverted ${page}`);
    }
  }
}

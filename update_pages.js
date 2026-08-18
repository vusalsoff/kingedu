const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'haqqimizda/page.js', title: 'Haqqımızda' },
  { path: 'elaqe/page.js', title: 'Əlaqə' },
  { path: 'mezunlar/page.js', title: 'Məzunlar' },
  { path: 'kurslar/page.js', title: 'Kurslar' },
  { path: 'telimler/page.js', title: 'Təlimlər' },
  { path: 'marafonlar/page.js', title: 'Marafonlar' },
  { path: 'pdf-kitablar/page.js', title: 'Kitablar' },
  { path: 'konulluluk/page.js', title: 'Könüllülük' },
  { path: 'sosial-media/page.js', title: 'Sosial Media' },
  { path: 'sened-yoxlama/page.js', title: 'Sənəd Yoxlama' }
];

const basePath = path.join(__dirname, 'src', 'app');

for (const page of pages) {
  const fullPath = path.join(basePath, page.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check if metadata already exists
    if (!content.includes('export const metadata =')) {
      const metadataInsert = `export const metadata = {\n  title: "${page.title}"\n};\n\n`;
      content = metadataInsert + content;
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${page.path}`);
    }
  }
}

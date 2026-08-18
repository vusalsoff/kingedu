const fs = require('fs');
const path = require('path');

const serverPages = [
  { path: 'kurslar/page.js', title: 'Kurslar' },
  { path: 'telimler/page.js', title: 'Təlimlər' },
  { path: 'marafonlar/page.js', title: 'Marafonlar' },
  { path: 'pdf-kitablar/page.js', title: 'Kitablar' }
];

const clientPages = [
  { dir: 'elaqe', title: 'Əlaqə', name: 'ElaqeClient' },
  { dir: 'konulluluk', title: 'Könüllülük', name: 'KonullulukClient' },
  { dir: 'mezunlar', title: 'Məzunlar', name: 'MezunlarClient' },
  { dir: 'sened-yoxlama', title: 'Sənəd Yoxlama', name: 'SenedYoxlamaClient' },
  { dir: 'sosial-media', title: 'Sosial Media', name: 'SosialMediaClient' }
];

const basePath = path.join(__dirname, 'src', 'app');

// 1. Update Server Pages
for (const page of serverPages) {
  const fullPath = path.join(basePath, page.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    if (!content.includes('export const metadata =')) {
      const metadataInsert = `export const metadata = {\n  title: "${page.title}"\n};\n\n`;
      content = metadataInsert + content;
      fs.writeFileSync(fullPath, content);
      console.log(`Updated Server Page: ${page.path}`);
    }
  }
}

// 2. Refactor Client Pages
for (const page of clientPages) {
  const dirPath = path.join(basePath, page.dir);
  const oldPagePath = path.join(dirPath, 'page.js');
  const newClientPath = path.join(dirPath, `${page.name}.js`);
  
  if (fs.existsSync(oldPagePath)) {
    let oldContent = fs.readFileSync(oldPagePath, 'utf-8');
    
    // Only refactor if it has "use client" and hasn't been refactored yet
    if (oldContent.includes('"use client"') && !oldContent.includes('export const metadata =')) {
      // Move old page.js to [Name]Client.js
      fs.writeFileSync(newClientPath, oldContent);
      
      // Create new page.js (Server Component)
      const newPageContent = `export const metadata = {
  title: "${page.title}",
};

import ${page.name} from "./${page.name}";

export default function Page() {
  return <${page.name} />;
}
`;
      fs.writeFileSync(oldPagePath, newPageContent);
      console.log(`Refactored Client Page: ${page.dir}/page.js`);
    }
  }
}

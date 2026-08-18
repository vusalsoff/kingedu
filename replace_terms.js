const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      content = content.replace(/Tələbələr/g, 'İştirakçılar');
      content = content.replace(/tələbələr/g, 'iştirakçılar');
      content = content.replace(/Tələbə/g, 'İştirakçı');
      content = content.replace(/tələbə/g, 'iştirakçı');

      content = content.replace(/King Education\.co/gi, 'King Education Company');
      content = content.replace(/\.co MMC/g, 'Company MMC');

      content = content.replace(/mirfeqan/g, 'Mirfəqan');
      content = content.replace(/Mirfeqan/g, 'Mirfəqan');

      content = content.replace(/PDF Kitablar/g, 'Kitablar');
      content = content.replace(/pdf kitablar/gi, 'kitablar');
      content = content.replace(/PDF Kitab/g, 'Kitab');
      content = content.replace(/pdf kitab/gi, 'kitab');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  });
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done.');

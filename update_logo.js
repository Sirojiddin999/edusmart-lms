const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/s4717/OneDrive/Desktop/edusmart-lms-main/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const spanHtml = `\n<span style="font-size: 1.5rem; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; margin-left: 10px;">innocode.uz</span>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('innocode.uz</span>')) {
    console.log(`Skipping ${file}, already updated.`);
    return;
  }
  
  const regex = /(<img src="\/img\/logo\.jpg"[^>]+>)/g;
  if (regex.test(content)) {
    content = content.replace(regex, `$1${spanHtml}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

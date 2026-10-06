const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const replacements = {
  'â¬…': '⬅',
  'ðŸ”‘': '🔑',
  'ðŸ“ ': '📝',
  'ðŸ‘¨â€ ðŸ «': '👨‍🏫',
  'ðŸŽ‰': '🎉',
  'ðŸ“š': '📚',
  'ðŸ¤–': '🤖',
  'ðŸš€': '🚀',
  'ðŸ’¼': '💼',
  'ðŸ“±': '📱',
  'ðŸŽ¯': '🎯',
  'ðŸ  ': '🐍',
  'âž”': '➔',
  'ðŸ’›': '💛',
  'â˜…': '★',
  'â˜•': '☕',
  'ðŸ“¢': '📢',
  'ðŸ“˜': '📘',
  'ðŸ“—': '📙',
  'ðŸ“‹': '📋',
  'âš ï¸ ': '⚠️',
  'â ³': '⏳',
  'ðŸ“²': '📲',
  'ðŸ” ': '🔍',
  'âœ✨': '✨',
  'âœ ï¸ ': '✍️',
  'âž¤': '➤',
  'â€”': '—',
  'ðŸšª': '🚪'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [bad, good] of Object.entries(replacements)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

const files = fs.readdirSync(publicDir);
for (const file of files) {
  if (file.endsWith('.html') || file.endsWith('.js')) {
    fixFile(path.join(publicDir, file));
  }
}
console.log("Done.");

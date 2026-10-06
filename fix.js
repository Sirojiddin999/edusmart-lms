const fs = require('fs');
const path = require('path');

const scriptToAdd = `
<script src="/js/utils.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof Auth !== 'undefined') {
      const usr = Auth.getUser();
      if (usr) {
        window.location.href = usr.role === 'teacher' ? '/teacher.html' : '/student.html';
      }
    }
  });
</script>
</body>
`;

const indexFile = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(indexFile)) {
    let content = fs.readFileSync(indexFile, 'utf8');
    if (!content.includes('window.location.href = usr.role')) {
        content = content.replace('</body>', scriptToAdd);
        fs.writeFileSync(indexFile, content, 'utf8');
    }
}

const backBtnNav = `<button onclick="history.back()" class='btn' style='background: #f1f5f9; border: 1px solid #e2e8f0; color: #334155; padding: 8px 16px; border-radius: 10px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; font-size: 0.9rem; cursor: pointer;'>⬅ Orqaga</button>\n          `;

const files = fs.readdirSync(path.join(__dirname, 'public'));
for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const filepath = path.join(__dirname, 'public', file);
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (content.includes('⬅ Orqaga')) continue;

    const navRightPattern = `<div class='nav-right' style='display: flex; gap: 10px; align-items: center;'>`;
    if (content.includes(navRightPattern)) {
        content = content.replace(navRightPattern, navRightPattern + '\n          ' + backBtnNav);
    } 
    else if (content.includes('<div class="user-pill">')) {
        const target = `<div style="display: flex; align-items: center; gap: 12px;">\n        <div class="user-pill">`;
        if (content.includes(target)) {
            const replacement = `<div style="display: flex; align-items: center; gap: 12px;">\n        <button class="btn btn-ghost btn-sm" style="font-weight: bold; border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px;" onclick="history.back()">⬅ Orqaga</button>\n        <div class="user-pill">`;
            content = content.replace(target, replacement);
        }
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
}

console.log('Done');

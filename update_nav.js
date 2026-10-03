const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/s4717/OneDrive/Desktop/edusmart-lms-main/public';
const files = ['index.html', 'aloqa.html', 'haqida.html', 'kutubxona.html', 'yangiliklar.html', 'yunalishlar.html', 'login.html'];

const newNav = `  <!-- NAVBAR -->
  <nav class='navbar' style='position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 15px 0;'>
    <div class='container'>
      <div class='navbar-inner' style='display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;'>
        <a href='/' class='brand' style='display: flex; align-items: center; gap: 12px; text-decoration: none;'>
          <div class='brand-logo' style='font-size: 2.2rem; background: var(--primary-subtle); border-radius: 12px; padding: 5px 10px;'>🎓</div>
          <div>
            <div class='brand-name' style='font-weight: 900; font-size: 1.3rem; color: var(--text-primary); letter-spacing: -0.5px;'>innocode.uz</div>
            <div class='brand-subtitle' style='font-size: 0.8rem; color: var(--text-muted); font-weight: 600;'>Ta'lim Platformasi</div>
          </div>
        </a>
        <ul class='nav-links' style='display: flex; gap: 20px; list-style: none; margin: 0 auto; padding: 0; align-items: center; flex-wrap: wrap;'>
          <li><a href='/' style='text-decoration:none; color:var(--text-secondary); font-weight:600; transition: color 0.3s;'>Bosh sahifa</a></li>
          <li><a href='/yangiliklar.html' style='text-decoration:none; color:var(--text-secondary); font-weight:600; transition: color 0.3s;'>Yangiliklar</a></li>
          <li><a href='/yunalishlar.html' style='text-decoration:none; color:var(--text-secondary); font-weight:600; transition: color 0.3s;'>Yo'nalishlar</a></li>
          <li><a href='/kutubxona.html' style='text-decoration:none; color:var(--text-secondary); font-weight:600; transition: color 0.3s;'>Kutubxona</a></li>
          <li><a href='/haqida.html' style='text-decoration:none; color:var(--text-secondary); font-weight:600; transition: color 0.3s;'>Sayt haqida</a></li>
          <li><a href='/aloqa.html' style='text-decoration:none; color:var(--text-secondary); font-weight:600; transition: color 0.3s;'>Aloqa</a></li>
        </ul>
        <div class='nav-right' style='display: flex; gap: 10px; align-items: center;'>
          <a href='/login.html' class='btn' style='background: white; border: 1px solid #e2e8f0; color: #334155; padding: 8px 16px; border-radius: 10px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);'>🔑 Kabinetga kirish</a>
          <a href='/login.html' class='btn' style='background: #5a5ce6; color: white; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(90, 92, 230, 0.3);'>📝 Ro'yxatdan o'tish</a>
          <a href='/login.html' class='btn' style='background: white; border: 1px solid #e2e8f0; color: #334155; padding: 8px 16px; border-radius: 10px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);'>👨‍🏫 O'qituvchi</a>
        </div>
      </div>
    </div>
  </nav>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace logic: 
    const navStartRegex = /<!--\s*NAVBAR\s*-->\s*<nav[^>]*>|<nav\s+class=["']navbar["'][^>]*>/i;
    const navMatch = content.match(navStartRegex);
    
    if (navMatch) {
      const startIndex = navMatch.index;
      const endRegex = /<\/nav>/i;
      const endMatch = content.slice(startIndex).match(endRegex);
      
      if (endMatch) {
        const endIndex = startIndex + endMatch.index + '</nav>'.length;
        content = content.slice(0, startIndex) + newNav + content.slice(endIndex);
        fs.writeFileSync(filePath, content);
        console.log("Updated " + file);
      } else {
        console.log("Could not find closing </nav> in " + file);
      }
    } else {
      console.log("Could not find <nav> in " + file);
    }
  }
}

function showToast(message, type = 'info') {
  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    document.body.appendChild(root);
  }

  const icons = { success: '✅', error: '❌', info: '💡' };
  const toast = document.createElement('div');
  toast.className = `toast t-${type}`;
  toast.innerHTML = `<span style="font-size:1rem;">${icons[type] || icons.info}</span><span>${message}</span>`;
  root.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

function copyToClipboard(text, msg = 'Nusxalandi!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(msg, 'success')).catch(() => _fallbackCopy(text, msg));
  } else {
    _fallbackCopy(text, msg);
  }
}

function _fallbackCopy(text, msg) {
  const ta = Object.assign(document.createElement('textarea'), {
    value: text, style: 'position:fixed;opacity:0'
  });
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast(msg, 'success'); } catch { showToast('Nusxalashda xatolik', 'error'); }
  document.body.removeChild(ta);
}

const Auth = {
  getToken:   () => localStorage.getItem('_edu_token'),
  getUser:    () => { try { return JSON.parse(localStorage.getItem('_edu_user') || 'null'); } catch { return null; } },
  setSession: (token, user) => {
    localStorage.setItem('_edu_token', token);
    localStorage.setItem('_edu_user', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem('_edu_token');
    localStorage.removeItem('_edu_user');
  },
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('_edu_token') || ''}`
  })
};

(function() {
  function fixDOMText() {
    const map = [
      { key: "O'qituvchi", icon: "👨‍🏫" },
      { key: "Ro'yxatdan", icon: "📝" },
      { key: "Kabinetga", icon: "🔑" },
      { key: "Sayt haqida", icon: "ℹ️" },
      { key: "Barcha kurslar", icon: "📚" },
      { key: "Aloqa", icon: "📞" },
      { key: "Bosh sahifa", icon: "🏠" },
      { key: "Platformaga kirish", icon: "🔑" },
      { key: "Orqaga", icon: "⬅" },
      { key: "Ta Modul", icon: "📚" }
    ];
    
    const icons = {
      'ðŸŽ‰': '🎉', 'ðŸ“š': '📚', 'ðŸ¤–': '🤖',
      'ðŸš€': '🚀', 'ðŸ’¼': '💼', 'ðŸ“±': '📱', 'ðŸŽ¯': '🎯', 'ðŸ  ': '🐍',
      'âž”': '➔', 'ðŸ’›': '💛', 'â˜…': '★', 'â˜•': '☕', 'ðŸ“¢': '📢',
      'ðŸ“˜': '📘', 'ðŸ“—': '📙', 'ðŸ“‹': '📋', 'âš ': '⚠️', 'â ³': '⏳',
      'ðŸ“²': '📲', 'ðŸ” ': '🔍', 'âœ✨': '✨', 'âœ ': '✍️', 'âž¤': '➤',
      'â€”': '—', 'ðŸšª': '🚪', 'â¬…': '⬅'
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      let text = node.nodeValue;
      let changed = false;

      // Fix known texts with ANY corrupted prefix
      if (text.includes('ð') || text.includes('â') || text.includes('=')) {
        for (const item of map) {
          if (text.includes(item.key)) {
            text = item.icon + " " + item.key + (text.split(item.key)[1] || "");
            changed = true;
          }
        }
      }

      // Fix exact matches for standalone icons
      for (const [bad, good] of Object.entries(icons)) {
        if (text.includes(bad)) {
          text = text.split(bad).join(good);
          changed = true;
        }
      }
      
      // Fix specific '=' corruption for the yellow heart
      if (text.includes('=')) {
        let newText = ''; let c = false;
        for (let i=0; i<text.length; i++) {
          if (text[i] === '=' && i+1 < text.length && text.charCodeAt(i+1) === 0x9B) {
             newText += '💛'; i++; c = true;
          } else { newText += text[i]; }
        }
        if(c){ text = newText; changed = true; }
      }

      // Hardcode course icons based on their parent's background color
      if (node.parentElement && node.parentElement.classList.contains('course-icon-wrap')) {
        const style = node.parentElement.getAttribute('style') || '';
        if (style.includes('fdf4ff')) { node.nodeValue = '🐍'; changed = true; }
        else if (style.includes('fffbeb')) { node.nodeValue = '💛'; changed = true; }
        else if (style.includes('ecfeff')) { node.nodeValue = '☕'; changed = true; }
        else if (style.includes('f0fdf4')) { node.nodeValue = '📊'; changed = true; }
      }

      // Hardcode module icons
      if (node.parentElement && node.parentElement.tagName === 'SPAN' && node.parentElement.parentElement && node.parentElement.parentElement.classList.contains('course-modules')) {
         node.nodeValue = '📚';
         changed = true;
      }

      if (changed) node.nodeValue = text;
    }
  }
  if (document.readyState !== 'loading') fixDOMText();
  else document.addEventListener('DOMContentLoaded', fixDOMText);
})();

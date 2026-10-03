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

import os
import glob

# 1. Add redirect script to index.html and login.html
script_to_add = '''
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
'''

for filename in ['index.html']: # login.html was already edited
    filepath = os.path.join('public', filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'window.location.href = usr.role' not in content:
            content = content.replace('</body>', script_to_add)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

# 2. Add Back button to all html files
back_btn_nav = "<button onclick=\"history.back()\" class='btn' style='background: #f1f5f9; border: 1px solid #e2e8f0; color: #334155; padding: 8px 16px; border-radius: 10px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; font-size: 0.9rem; cursor: pointer;'>⬅ Orqaga</button>\n          "

for filepath in glob.glob('public/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '⬅ Orqaga' in content: continue

    # For public pages with nav-right
    if "<div class='nav-right'" in content:
        content = content.replace("<div class='nav-right' style='display: flex; gap: 10px; align-items: center;'>", 
                                "<div class='nav-right' style='display: flex; gap: 10px; align-items: center;'>\n          " + back_btn_nav)
    
    # For student.html and teacher.html
    elif '<div class="user-pill">' in content:
        # We find the wrapper div before user-pill
        target = '<div style="display: flex; align-items: center; gap: 12px;">\n        <div class="user-pill">'
        if target in content:
            replacement = '<div style="display: flex; align-items: center; gap: 12px;">\n        <button class="btn btn-ghost btn-sm" style="font-weight: bold; border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px;" onclick="history.back()">⬅ Orqaga</button>\n        <div class="user-pill">'
            content = content.replace(target, replacement)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done')

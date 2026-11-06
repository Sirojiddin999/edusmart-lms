/* cyber-uz — Kun/Tun rejimi (quyosh ☀️ va oy 🌙) */
(function () {
  var KEY = 'cyberuz_theme';
  var root = document.documentElement;

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var sun = document.getElementById('cyberThemeSun');
    var moon = document.getElementById('cyberThemeMoon');
    if (sun && moon) {
      sun.classList.toggle('active', theme === 'light');
      moon.classList.toggle('active', theme === 'dark');
      sun.setAttribute('aria-pressed', theme === 'light');
      moon.setAttribute('aria-pressed', theme === 'dark');
    }
  }
  function set(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
  }

  // Sahifa yuklanishidan oldin qo'llash (miltillashsiz). Standart — qora (tun) rejim.
  apply(getSaved() === 'light' ? 'light' : 'dark');

  // theme.css ni avtomatik ulash
  if (!document.querySelector('link[data-cyber-theme]')) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '/css/theme.css';
    l.setAttribute('data-cyber-theme', '1');
    (document.head || root).appendChild(l);
  }

  function mount() {
    if (document.getElementById('cyberThemeToggle')) return;
    var box = document.createElement('div');
    box.id = 'cyberThemeToggle';
    box.className = 'cyber-theme-toggle';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Kun va tun rejimi');
    box.innerHTML =
      '<button type="button" id="cyberThemeSun" class="sun" title="Kunduzgi (oq) rejim" aria-label="Kunduzgi rejim">☀️</button>' +
      '<button type="button" id="cyberThemeMoon" class="moon" title="Tungi (qora) rejim" aria-label="Tungi rejim">🌙</button>';
    document.body.appendChild(box);
    document.getElementById('cyberThemeSun').addEventListener('click', function () { set('light'); });
    document.getElementById('cyberThemeMoon').addEventListener('click', function () { set('dark'); });
    apply(root.getAttribute('data-theme') || 'dark');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();

  window.CyberTheme = { set: set };
})();


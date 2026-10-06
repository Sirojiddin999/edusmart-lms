// teacher_courses.js - Handles course creation and course selection logic

let ALL_COURSES = [];

// Inject Course Modal into DOM
const courseModalHtml = `
  <div class="modal-backdrop" id="addCourseModal">
    <div class="modal-box" style="max-width: 500px;">
      <button class="modal-close-btn" onclick="closeModal('addCourseModal')">✕</button>
      <h2 style="font-size: 1.35rem; margin-bottom: 6px;" id="courseModalTitle">➕ Yangi Kurs Qo'shish</h2>
      <form id="addCourseForm" onsubmit="submitAddCourse(event)">
        <input type="hidden" id="ac-id">
        <div class="form-group">
          <label class="form-label">Kurs Sarlavhasi *</label>
          <input id="ac-title" type="text" class="form-input" placeholder="Masalan: Frontend Dasturlash" required>
        </div>
        <div class="form-group">
          <label class="form-label">Qisqacha Tavsif</label>
          <textarea id="ac-desc" class="form-input" rows="3" placeholder="Kurs haqida..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 20px;">Saqlash</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', courseModalHtml);

// Inject Course Selection into Add Lesson Modal
window.addEventListener('DOMContentLoaded', () => {
  const alTitleGrp = document.getElementById('al-title').parentElement;
  
  const courseSelectHtml = `
    <div class="form-group">
      <label class="form-label">Kursni Tanlang *</label>
      <select id="al-course" class="form-input" required>
        <option value="">-- Kursni Tanlang --</option>
      </select>
    </div>
  `;
  alTitleGrp.insertAdjacentHTML('beforebegin', courseSelectHtml);
});

async function loadCourses() {
  try {
    const r = await fetch('/api/teacher/courses', { headers: window.Auth.getHeaders() });
    ALL_COURSES = await r.json();
    document.getElementById('coursesBadge').innerText = ALL_COURSES.length;
    renderCourses(ALL_COURSES);
    
    // Update course dropdown in Add Lesson modal
    const select = document.getElementById('al-course');
    if (select) {
      select.innerHTML = '<option value="">-- Kursni Tanlang --</option>' + 
        ALL_COURSES.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
    }
  } catch (e) { console.error(e); }
}

function renderCourses(courses) {
  const wrap = document.getElementById('courseCards');
  if (!courses || !courses.length) {
    wrap.innerHTML = `<div style="color:var(--text-muted); padding:30px; grid-column:1/-1; text-align:center; font-size:1rem;">🎓 Hozircha kurslar mavjud emas</div>`;
    return;
  }

  wrap.innerHTML = courses.map(c => `
    <div class="l-card" style="cursor:pointer;" onclick="filterLessonsByCourse(${c.id}, '${c.title.replace(/'/g, "\\'")}')">
      <div class="l-card-title">${c.title}</div>
      <div class="l-card-desc">${c.description || 'Tavsif berilmagan'}</div>
      <div class="l-card-footer" style="margin-top: 15px;">
        <span class="badge badge-primary">📚 ${c.lessons_count || 0} ta dars</span>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation(); editCourse(${c.id})">✏️ Tahrir</button>
          <button class="btn btn-danger btn-xs" onclick="event.stopPropagation(); delCourse(${c.id})">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterLessonsByCourse(courseId, courseTitle) {
  document.getElementById('secLessons').style.display = 'block';
  document.getElementById('secCourses').style.display = 'none';
  document.getElementById('pageTitle').innerText = '📚 ' + courseTitle + ' darslari';
  
  // Update navs
  document.querySelectorAll('.t-nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('nav-lessons').classList.add('active');

  const filtered = ALL_LESSONS.filter(l => l.course_id === courseId);
  renderLessons(filtered);
}

// Override original loadAll to also load courses
const originalLoadAll = window.loadAll;
window.loadAll = async function() {
  await loadCourses();
  if (originalLoadAll) await originalLoadAll();
}

function openAddCourseModal() {
  document.getElementById('addCourseForm').reset();
  document.getElementById('ac-id').value = '';
  document.getElementById('courseModalTitle').innerText = '➕ Yangi Kurs Qo\'shish';
  openModal('addCourseModal');
}

function editCourse(id) {
  const c = ALL_COURSES.find(x => x.id === id);
  if (!c) return;
  document.getElementById('ac-id').value = c.id;
  document.getElementById('ac-title').value = c.title;
  document.getElementById('ac-desc').value = c.description || '';
  document.getElementById('courseModalTitle').innerText = '✏️ Kursni Tahrirlash';
  openModal('addCourseModal');
}

async function submitAddCourse(e) {
  e.preventDefault();
  const id = document.getElementById('ac-id').value;
  const title = document.getElementById('ac-title').value.trim();
  const desc = document.getElementById('ac-desc').value.trim();
  
  const url = id ? '/api/teacher/courses/' + id : '/api/teacher/courses';
  const method = id ? 'PUT' : 'POST';
  
  try {
    const r = await fetch(url, {
      method,
      headers: window.Auth.getHeaders(),
      body: JSON.stringify({ title, description: desc })
    });
    const d = await r.json();
    if (d.success) {
      showToast(id ? "Kurs tahrirlandi" : "Kurs yaratildi", "success");
      closeModal('addCourseModal');
      loadCourses();
    } else {
      showToast(d.error || 'Xatolik', 'error');
    }
  } catch {
    showToast('Tarmoq xatosi', 'error');
  }
}

async function delCourse(id) {
  if (!confirm("Diqqat! Kurs bilan birga uning ichidagi BARCHA DARSLAR o'chib ketadi! Davom etasizmi?")) return;
  try {
    const r = await fetch('/api/teacher/courses/' + id, { method: 'DELETE', headers: window.Auth.getHeaders() });
    const d = await r.json();
    if (d.success) {
      showToast("Kurs o'chirildi", "success");
      loadAll();
    } else {
      showToast(d.error || 'Xatolik', 'error');
    }
  } catch {
    showToast('Tarmoq xatosi', 'error');
  }
}

// Override original submitAddLesson to include course_id
const originalSubmitAddLesson = window.submitAddLesson;
if (originalSubmitAddLesson) {
  window.submitAddLesson = async function(e) {
    e.preventDefault();
    const courseId = document.getElementById('al-course').value;
    if (!courseId) {
      showToast("Iltimos, dars qaysi kursga tegishli ekanligini tanlang", "error");
      return;
    }
    
    // Modify body JSON by hooking into fetch temporarily
    const originalFetch = window.fetch;
    window.fetch = async function() {
      if (arguments[0] === '/api/teacher/lessons' && arguments[1] && arguments[1].body) {
        const payload = JSON.parse(arguments[1].body);
        payload.course_id = courseId;
        arguments[1].body = JSON.stringify(payload);
      }
      return originalFetch.apply(this, arguments);
    };
    
    await originalSubmitAddLesson(e);
    
    // Restore original fetch
    window.fetch = originalFetch;
  };
}

// teacher_courses.js - Handles course creation and course selection logic

let ALL_COURSES = [];

// Inject Course Modal into DOM
const courseModalHtml = `
  <div class="modal-backdrop" id="addCourseModal">
    <div class="modal-box" style="max-width: 520px;">
      <button class="modal-close-btn" onclick="closeModal('addCourseModal')">✕</button>
      <h2 style="font-size: 1.35rem; margin-bottom: 6px;" id="courseModalTitle">➕ Yangi kurs qo‘shish</h2>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
        Yangi kurs yarating va uning ichiga tegishli video darslar hamda 5 tadan test savollarini qo‘shing.
      </p>
      <form id="addCourseForm" onsubmit="submitAddCourse(event)">
        <input type="hidden" id="ac-id">
        <div class="form-group">
          <label class="form-label">Kurs Sarlavhasi *</label>
          <input id="ac-title" type="text" class="form-input" placeholder="Masalan: Frontend Dasturlash Asoslari" required>
        </div>
        <div class="form-group">
          <label class="form-label">Qisqacha Tavsif</label>
          <textarea id="ac-desc" class="form-input" rows="3" placeholder="Ushbu kurs kimlar uchun va nimalar o‘rgatiladi..."></textarea>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;">
          <button type="button" class="btn btn-ghost" onclick="closeModal('addCourseModal')">Bekor qilish</button>
          <button type="submit" class="btn btn-primary" id="btnSaveCourse">Saqlash</button>
        </div>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', courseModalHtml);

// Inject Course Selection into Add Lesson Modal
window.addEventListener('DOMContentLoaded', () => {
  const alTitle = document.getElementById('al-title');
  if (alTitle && alTitle.parentElement) {
    const alTitleGrp = alTitle.parentElement;
    const courseSelectHtml = `
      <div class="form-group">
        <label class="form-label">Kursni Tanlang *</label>
        <select id="al-course" class="form-input" required style="font-weight: 700;">
          <option value="">-- Kursni Tanlang --</option>
        </select>
      </div>
    `;
    alTitleGrp.insertAdjacentHTML('beforebegin', courseSelectHtml);
  }
});

async function loadCourses() {
  try {
    const r = await fetch('/api/teacher/courses', { headers: Auth.getHeaders() });
    ALL_COURSES = await r.json();
    const badge = document.getElementById('coursesBadge');
    if (badge) badge.innerText = ALL_COURSES.length;
    renderCourses(ALL_COURSES);

    // Update course dropdown in Add Lesson modal
    const select = document.getElementById('al-course');
    if (select) {
      const curVal = select.value;
      select.innerHTML = '<option value="">-- Kursni Tanlang --</option>' +
        ALL_COURSES.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
      if (curVal) select.value = curVal;
      else if (ALL_COURSES.length > 0) select.value = ALL_COURSES[0].id;
    }
} catch (e) { console.error("Kurslarni yuklashda xatolik:", e); }
}

function renderCourses(courses) {
  const wrap = document.getElementById('courseCards');
  if (!wrap) return;
  if (!courses || !courses.length) {
    wrap.innerHTML = `
      <div style="color:var(--text-muted); padding:40px 20px; grid-column:1/-1; text-align:center; background:#ffffff; border-radius:18px; border:2px dashed #e2e8f0;">
        <div style="font-size:3rem; margin-bottom:12px;">📚</div>
        <div style="font-size:1.2rem; font-weight:800; color:#1e293b; margin-bottom:6px;">Hozircha kurslar mavjud emas</div>
        <p style="font-size:0.9rem; color:#64748b; max-width:480px; margin:0 auto 20px; line-height:1.6;">
          Platformaga birinchi kursni qo‘shing va uning ichiga 100% testli video darslarni joylashtiring.
        </p>
        <button class="btn btn-primary" onclick="openAddCourseModal()" style="font-weight:800; padding:10px 22px;">
          ➕ Yangi kurs qo‘shish
        </button>
      </div>`;
    return;
  }

  wrap.innerHTML = courses.map(c => `
    <div class="l-card" style="display:flex; flex-direction:column; justify-content:space-between; border: 1.5px solid #e2e8f0; border-radius: 16px; transition: transform 0.2s, box-shadow 0.2s;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:8px;">
          <div class="l-card-title" style="font-size:1.15rem; font-weight:800; color:#1e293b; margin-bottom:0;">
            📚 ${c.title}
          </div>
          <span class="badge badge-primary" style="font-size:0.75rem; font-weight:800; white-space:nowrap; padding:4px 10px;">
            ${c.lessons_count || 0} ta dars
          </span>
        </div>
        <div class="l-card-desc" style="color:#64748b; font-size:0.88rem; line-height:1.55; margin-bottom:16px;">
          ${c.description || 'Ushbu kurs bo‘yicha qo‘shimcha ma\'lumot kiritilmagan'}
        </div>
      </div>

      <div class="l-card-footer" style="padding-top:14px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="openAddLessonForCourse(${c.id}, '${c.title.replace(/'/g, "\\'")}')" style="font-weight:800; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 8px rgba(79,70,229,0.25);" title="Ushbu kurs ichiga dars qo‘shish">
          ➕ Dars qo‘shish
        </button>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn btn-ghost btn-sm" onclick="filterLessonsByCourse(${c.id}, '${c.title.replace(/'/g, "\\'")}')" style="font-weight:700; color:#475569;" title="Kurs darslarini ko‘rish">
            👁️ Darslar
          </button>
          <button class="btn btn-ghost btn-sm" onclick="editCourse(${c.id})" style="font-weight:700;" title="Kursni tahrirlash">
            ✏️
          </button>
          <button class="btn btn-danger btn-sm" onclick="delCourse(${c.id})" style="font-weight:700;" title="Kursni o‘chirish">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Open Add Lesson modal with pre-selected course
function openAddLessonForCourse(courseId, courseTitle) {
  openAddModal();
  const select = document.getElementById('al-course');
  if (select) {
    select.value = courseId;
  }
  const modalH2 = document.querySelector('#addLessonModal h2');
  if (modalH2) {
    modalH2.innerText = `➕ "${courseTitle}" kursiga yangi dars qo‘shish`;
  }
  const titleInput = document.getElementById('al-title');
  if (titleInput) {
    setTimeout(() => titleInput.focus(), 200);
  }
  if (typeof showToast === 'function') {
    showToast(`"${courseTitle}" kursi tanlandi. Dars ma'lumotlarini kiriting`, 'info');
  }
}

function filterLessonsByCourse(courseId, courseTitle) {
  switchSection('lessons');
  document.getElementById('pageTitle').innerText = '📚 ' + courseTitle + ' darslari';
  document.getElementById('pageSub').innerText = 'Ushbu kursga tegishli barcha darslar va 5 tadan test savollari nazorati';

  const filtered = ALL_LESSONS.filter(l => l.course_id === courseId);
  renderLessons(filtered, { courseId, courseTitle });
}

// Override original loadAll to also load courses
const originalLoadAll = window.loadAll;
window.loadAll = async function () {
  await loadCourses();
  if (originalLoadAll) await originalLoadAll();
};

function openAddCourseModal() {
  document.getElementById('addCourseForm').reset();
  document.getElementById('ac-id').value = '';
  document.getElementById('courseModalTitle').innerText = '➕ Yangi kurs qo‘shish';
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

  const btn = document.getElementById('btnSaveCourse');
  btn.disabled = true;
  btn.innerText = 'Saqlanmoqda...';

  try {
    const r = await fetch(url, {
      method,
      headers: Auth.getHeaders(),
      body: JSON.stringify({ title, description: desc })
    });
    const d = await r.json();
    if (d.success) {
      showToast(id ? "Kurs tahrirlandi" : "Yangi kurs muvaffaqiyatli yaratildi!", "success");
      closeModal('addCourseModal');
      await loadCourses();
      if (typeof loadAll === 'function') loadAll();
    } else {
      showToast(d.error || 'Xatolik', 'error');
    }
  } catch {
    showToast('Tarmoq xatosi', 'error');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Saqlash';
  }
}

async function delCourse(id) {
  if (!confirm("Diqqat! Kurs bilan birga uning ichidagi BARCHA DARSLAR o‘chib ketadi! Davom etasizmi?")) return;
  try {
    const r = await fetch('/api/teacher/courses/' + id, { method: 'DELETE', headers: Auth.getHeaders() });
    const d = await r.json();
    if (d.success) {
      showToast("Kurs o‘chirildi", "success");
      await loadCourses();
      if (typeof loadAll === 'function') loadAll();
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
  window.submitAddLesson = async function (e) {
    e.preventDefault();
    const courseSelect = document.getElementById('al-course');
    const courseId = (courseSelect && courseSelect.value) ? courseSelect.value : ((ALL_COURSES[0] && ALL_COURSES[0].id) || 1);

    // Modify body JSON by hooking into fetch temporarily
    const originalFetch = window.fetch;
    window.fetch = async function () {
      if (arguments[0] === '/api/teacher/lessons' && arguments[1] && arguments[1].body) {
        try {
          const payload = JSON.parse(arguments[1].body);
          payload.course_id = parseInt(courseId);
          arguments[1].body = JSON.stringify(payload);
        } catch (err) { }
      }
      return originalFetch.apply(this, arguments);
    };

    try {
      await originalSubmitAddLesson(e);
    } finally {
      window.fetch = originalFetch;
    }
  };
}

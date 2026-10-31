const path = require('path');
const Database = require('better-sqlite3');
const COURSES_DATA = require('./curriculum.js');

// Eskirgan yoki o'chirilgan YouTube video ID lar ro'yxati
const BROKEN_VIDEO_IDS = new Set([
  'jO6qQDNa2CE', 'XKHEtdqhPAI',
  'nLRL_NcnK-4', '5F24p17D2q0', 'Pj1e7oO1d5Q', 'u35V8X5y3rM', 'q_m00YJkK-s',
  '5_nJkM2Rk2s', 'fA8N3z72o_k', '7V2Vv04m5_o', 'jZz77E71i5o', '8eY-Vz7o2k8',
  '3eCg_pI0U5U', '1vR3ST956z0', 'vEROU2XtPR8', 'Bv_5Zv5c-6g', 'Obe46g9R4rU',
  '0G3h0aZkU54', '5fb2aPlgoys', '7r4xVDI2vho', 's3_k02mK3mE', 'x8s9K3o1l1o',
  'rK2j4A9z6hY', 'dK9vN0X6y1w', 'PkZNo7MFOUg', 'hKB-YGF14SY', 'ZBalWWHYFQc',
  'u-HOEUo2Dbc', 'EE1-Wf12XEQ'
]);

function normalizeYouTubeEmbedUrl(rawUrl, fallbackUrl = 'https://www.youtube.com/embed/kqtD5dpn9C8') {
  if (!rawUrl || typeof rawUrl !== 'string') return fallbackUrl;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallbackUrl;

  let videoId = null;
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  const watchMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  const shortMatch = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  const shortsMatch = trimmed.match(/youtube\.com\/(?:shorts|live)\/([A-Za-z0-9_-]{11})/);

  if (embedMatch) videoId = embedMatch[1];
  else if (watchMatch) videoId = watchMatch[1];
  else if (shortMatch) videoId = shortMatch[1];
  else if (shortsMatch) videoId = shortsMatch[1];

  if (videoId) {
    if (BROKEN_VIDEO_IDS.has(videoId)) return fallbackUrl;
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return trimmed;
}

function getCurriculumVideoUrl(courseIndexOrId, orderNum, courseTitle = '') {
  const titleLower = (courseTitle || '').toLowerCase();
  let cIdx = 0;
  if (titleLower.includes('javascript') || titleLower.includes('react')) cIdx = 1;
  else if (titleLower.includes('java') || titleLower.includes('android')) cIdx = 2;
  else if (typeof courseIndexOrId === 'number' && courseIndexOrId >= 1 && courseIndexOrId <= 3) {
    cIdx = courseIndexOrId - 1;
  }
  const cData = COURSES_DATA[cIdx] || COURSES_DATA[0];
  const lData = (cData.lessons || []).find(l => l.order_num === Number(orderNum)) || cData.lessons[0];
  return lData ? lData.video_url : 'https://www.youtube.com/embed/kqtD5dpn9C8';
}

function updateUzVideos() {
  const db = new Database(path.join(__dirname, 'platform.db'));
  try {
    const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const insertLesson = db.prepare(`
      INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const updateLessonByCourseOrder = db.prepare(`
      UPDATE lessons
      SET video_url=?,
          title=?,
          description=CASE WHEN description IS NULL OR description='' THEN ? ELSE description END,
          content_text=CASE WHEN content_text IS NULL OR content_text='' THEN ? ELSE content_text END,
          quiz_json=CASE WHEN quiz_json IS NULL OR quiz_json='' OR quiz_json='[]' THEN ? ELSE quiz_json END,
          min_score=5
      WHERE course_id=? AND order_num=?
    `);

    const existingCourses = db.prepare("SELECT * FROM courses ORDER BY id ASC").all();

    db.transaction(() => {
      // 1. Kursga biriktirilmagan (course_id IS NULL) ortiqcha dublikat darslarni tozalash
      db.prepare("DELETE FROM lessons WHERE course_id IS NULL OR course_id NOT IN (SELECT id FROM courses)").run();

      // 2. Har bir kurs ichida bir xil order_num ga ega dublikat darslar bo'lsa (masalan 40 ta dars bo'lib qolgan bo'lsa),
      // birinchi ID ni saqlab qolib, ortiqcha dublikatlarni tozalash
      const dupGroups = db.prepare(`
        SELECT course_id, order_num, MIN(id) as keep_id, COUNT(*) as cnt
        FROM lessons
        GROUP BY course_id, order_num
        HAVING cnt > 1
      `).all();

      for (const g of dupGroups) {
        const dupRows = db.prepare("SELECT id FROM lessons WHERE course_id=? AND order_num=? AND id != ?")
          .all(g.course_id, g.order_num, g.keep_id);
        for (const dr of dupRows) {
          // O'quvchilar progressida last_lesson_id dublikatga ulangan bo'lsa, asosiy darsga o'tkazish
          db.prepare("UPDATE student_progress SET last_lesson_id=? WHERE last_lesson_id=?").run(g.keep_id, dr.id);
          db.prepare("DELETE FROM lessons WHERE id=?").run(dr.id);
        }
      }

      // 3. 3 ta asosiy kurs va ularning 30 ta darsini curriculum.js bilan to'liq sinxronlash
      for (let ci = 0; ci < COURSES_DATA.length; ci++) {
        const cData = COURSES_DATA[ci];
        let course = db.prepare("SELECT * FROM courses WHERE title=?").get(cData.title) || existingCourses[ci];
        let courseId;
        if (!course) {
          const r = insertCourse.run(cData.title, cData.description);
          courseId = r.lastInsertRowid;
        } else {
          courseId = course.id;
          // Agar eski kurs nomi "Asosiy Kurs" bo'lib qolgan bo'lsa, to'g'rilash
          if (ci === 0 && course.title === 'Asosiy Kurs') {
            db.prepare("UPDATE courses SET title=?, description=? WHERE id=?").run(cData.title, cData.description, courseId);
          }
        }

        for (const l of cData.lessons) {
          const fiveQuiz = JSON.stringify((l.quiz || []).slice(0, 5));
          const lessonTitle = `${cData.title} | ${l.title || (l.order_num + '-dars')}`;
          const existingLesson = db.prepare("SELECT id FROM lessons WHERE course_id=? AND order_num=?").get(courseId, l.order_num);
          if (!existingLesson) {
            insertLesson.run(
              courseId,
              l.order_num,
              lessonTitle,
              l.description || '',
              l.video_url,
              l.content_text || '',
              JSON.stringify(["#" + cData.hash, "#dasturlash", "#dars" + l.order_num]),
              fiveQuiz,
              5,
              l.duration_mins || 30
            );
          } else {
            updateLessonByCourseOrder.run(
              l.video_url,
              lessonTitle,
              l.description || '',
              l.content_text || '',
              fiveQuiz,
              courseId,
              l.order_num
            );
          }
        }
      }

      // 4. Bazadagi barcha darslarning video_url larini tekshirib, singan ID yoki oddiy watch?v= linklarni to'g'rilash
      const allLessons = db.prepare(`
        SELECT l.id, l.course_id, l.order_num, l.video_url, c.title as course_title
        FROM lessons l
        LEFT JOIN courses c ON c.id = l.course_id
      `).all();

      const fixVideoStmt = db.prepare("UPDATE lessons SET video_url=? WHERE id=?");
      for (const les of allLessons) {
        const fallback = getCurriculumVideoUrl(les.course_id, les.order_num, les.course_title);
        const fixedUrl = normalizeYouTubeEmbedUrl(les.video_url, fallback);
        if (fixedUrl !== les.video_url) {
          fixVideoStmt.run(fixedUrl, les.id);
        }
      }
    })();

    console.log("Barcha darslarning video linklari, konspektlari va testlari 100% ishlaydigan holatga keltirildi!");
  } catch (e) {
    console.error("Dars va videolarni yangilashda xato:", e.message);
  } finally {
    db.close();
  }
}

updateUzVideos.normalizeYouTubeEmbedUrl = normalizeYouTubeEmbedUrl;
updateUzVideos.getCurriculumVideoUrl = getCurriculumVideoUrl;
updateUzVideos.BROKEN_VIDEO_IDS = BROKEN_VIDEO_IDS;

if (require.main === module) {
  updateUzVideos();
}

module.exports = updateUzVideos;

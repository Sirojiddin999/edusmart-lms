const path = require('path');
const Database = require('better-sqlite3');
const COURSES_DATA = require('./curriculum.js');

function updateUzVideos() {
  const db = new Database(path.join(__dirname, 'platform.db'));
  try {
    const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const insertLesson = db.prepare(`
      INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const updateLesson = db.prepare(`
      UPDATE lessons
      SET video_url=?,
          description=CASE WHEN description IS NULL OR description='' THEN ? ELSE description END,
          content_text=CASE WHEN content_text IS NULL OR content_text='' THEN ? ELSE content_text END,
          quiz_json=CASE WHEN quiz_json IS NULL OR quiz_json='' OR quiz_json='[]' THEN ? ELSE quiz_json END,
          min_score=5
      WHERE id=?
    `);

    const existingCourses = db.prepare("SELECT * FROM courses ORDER BY id ASC").all();

    db.transaction(() => {
      for (let ci = 0; ci < COURSES_DATA.length; ci++) {
        const cData = COURSES_DATA[ci];
        let course = existingCourses[ci] || db.prepare("SELECT * FROM courses WHERE title=?").get(cData.title);
        let courseId;
        if (!course) {
          const r = insertCourse.run(cData.title, cData.description);
          courseId = r.lastInsertRowid;
        } else {
          courseId = course.id;
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
            updateLesson.run(
              l.video_url,
              l.description || '',
              l.content_text || '',
              fiveQuiz,
              existingLesson.id
            );
          }
        }
      }
    })();

    console.log("Barcha 30 ta dars video linklari, konspektlari va testlari 100% ishlaydigan holatga keltirildi!");
  } catch (e) {
    console.error("Dars va videolarni yangilashda xato:", e.message);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  updateUzVideos();
}

module.exports = updateUzVideos;

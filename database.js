const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'platform.db'));

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    role        TEXT NOT NULL CHECK (role IN ('teacher','student')),
    full_name   TEXT NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id    INTEGER REFERENCES courses(id),
    order_num    INTEGER NOT NULL,
    title        TEXT NOT NULL,
    description  TEXT DEFAULT '',
    video_url    TEXT DEFAULT '',
    content_text TEXT DEFAULT '',
    hashtags     TEXT DEFAULT '[]',
    quiz_json    TEXT DEFAULT '[]',
    min_score    INTEGER DEFAULT 5,
    duration_mins INTEGER DEFAULT 30,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS student_progress (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id              INTEGER UNIQUE NOT NULL,
    last_lesson_id       INTEGER,
    completed_lesson_ids TEXT DEFAULT '[]',
    scores_json          TEXT DEFAULT '{}',
    last_active          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS certificates (
    id           TEXT PRIMARY KEY,
    user_id      INTEGER NOT NULL,
    course_id    INTEGER NOT NULL,
    student_name TEXT NOT NULL,
    course_title TEXT NOT NULL,
    score_percent INTEGER DEFAULT 100,
    issue_date   TEXT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  );
`);

// Add columns if they do not exist (for existing databases)
try {
  db.exec(`ALTER TABLE lessons ADD COLUMN course_id INTEGER REFERENCES courses(id);`);
} catch(e) {}
try {
  db.exec(`ALTER TABLE users ADD COLUMN pin_code TEXT DEFAULT '';`);
} catch(e) {}
try {
  db.exec(`ALTER TABLE student_progress ADD COLUMN last_course_id INTEGER REFERENCES courses(id);`);
} catch(e) {}

const COURSES_DATA = require('./curriculum.js');

// ─── Seed & Sync ──────────────────────────────────────────────────────────────
function seed() {
  const teacherHash = bcrypt.hashSync('1111', 10);
  const teacherExists = db.prepare("SELECT id FROM users WHERE role='teacher' LIMIT 1").get();
  if (!teacherExists) {
    db.prepare("INSERT INTO users (role, full_name, username, password_hash, pin_code) VALUES (?,?,?,?,?)")
      .run('teacher', "O‘qituvchi", '1111', teacherHash, '1111');
  } else {
    db.prepare("UPDATE users SET full_name=?, username=?, password_hash=?, pin_code=? WHERE id=?")
      .run("O‘qituvchi", '1111', teacherHash, '1111', teacherExists.id);
  }

  // Mavjud kurslar va darslar sonini tekshirish
  const existingCoursesCount = db.prepare("SELECT COUNT(*) as c FROM courses").get().c;
  const existingLessonsCount = db.prepare("SELECT COUNT(*) as c FROM lessons").get().c;

  // Agar darslar yoki kurslar bo'sh bo'lsa, curriculum.js dan to'liq yuklash (mavjud darslarni hech qachon o'chirmaymiz!)
  if (existingCoursesCount === 0 || existingLessonsCount === 0) {
    console.log("Darslar va testlar bazaga kiritilmoqda...");
    const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const insertLesson = db.prepare(`
      INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const c of COURSES_DATA) {
        let course = db.prepare("SELECT id FROM courses WHERE title=?").get(c.title);
        let courseId;
        if (!course) {
          const r = insertCourse.run(c.title, c.description);
          courseId = r.lastInsertRowid;
        } else {
          courseId = course.id;
        }

        for (const l of c.lessons) {
          const fiveQuiz = (l.quiz || []).slice(0, 5);
          const lessonTitle = `${c.title} | ${l.title || (l.order_num + '-dars')}`;
          const lessonExists = db.prepare("SELECT id FROM lessons WHERE course_id=? AND order_num=?").get(courseId, l.order_num);
          if (!lessonExists) {
            insertLesson.run(
              courseId,
              l.order_num,
              lessonTitle,
              l.description,
              l.video_url,
              l.content_text,
              JSON.stringify(["#" + c.hash, "#dasturlash", "#dars" + l.order_num]),
              JSON.stringify(fiveQuiz),
              5, // min_score: 5 ta to'g'ri javob talab qilinadi (100%)
              l.duration_mins
            );
          }
        }
      }
    })();
    console.log("Bazaga kurslar va har bir dars uchun 5 tadan sifatli test savollari muvaffaqiyatli saqlandi!");
  } else {
    // Agar course_id si yo'q darslar bo'lsa, ularni kurslarga bog'lash
    const firstCourse = db.prepare("SELECT id FROM courses ORDER BY id ASC LIMIT 1").get();
    if (firstCourse) {
      db.prepare("UPDATE lessons SET course_id=? WHERE course_id IS NULL").run(firstCourse.id);
    }

    // Har bir darsda 5 ta test savoli mavjudligini ta'minlash
    const emptyQuizLessons = db.prepare("SELECT id, course_id, order_num FROM lessons WHERE quiz_json IS NULL OR quiz_json = '[]' OR quiz_json = ''").all();
    if (emptyQuizLessons.length > 0) {
      console.log(`${emptyQuizLessons.length} ta darsda testlar yangilanmoqda...`);
      const updateQuiz = db.prepare("UPDATE lessons SET quiz_json=?, min_score=5 WHERE id=?");
      db.transaction(() => {
        for (const l of emptyQuizLessons) {
          const course = db.prepare("SELECT title FROM courses WHERE id=?").get(l.course_id);
          const cData = COURSES_DATA.find(cd => cd.title === course?.title) || COURSES_DATA[0];
          const lData = (cData.lessons && cData.lessons.find(ld => ld.order_num === l.order_num)) || (cData.lessons && cData.lessons[0]) || { quiz: [] };
          const fiveQuiz = (lData.quiz || []).slice(0, 5);
          updateQuiz.run(JSON.stringify(fiveQuiz), l.id);
        }
      })();
    }
  }
}

seed();
module.exports = db;

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
  const teacherHash = bcrypt.hashSync('11121314', 10);
  const teacherExists = db.prepare("SELECT id FROM users WHERE role='teacher' LIMIT 1").get();
  if (!teacherExists) {
    db.prepare("INSERT INTO users (role, full_name, username, password_hash, pin_code) VALUES (?,?,?,?,?)")
      .run('teacher', "Ma'rufjon Isomiddinov", 'Marufjon', teacherHash, '11121314');
  } else {
    db.prepare("UPDATE users SET full_name=?, username=?, password_hash=?, pin_code=? WHERE role='teacher'")
      .run("Ma'rufjon Isomiddinov", 'Marufjon', teacherHash, '11121314');
  }

  // Check if re-seed is required
  const existingCoursesCount = db.prepare("SELECT COUNT(*) as c FROM courses").get().c;
  const hasCorrectCourses = db.prepare("SELECT COUNT(*) as c FROM courses WHERE title LIKE '%Python%'").get().c > 0;
  const lessonsWithNullCourseId = db.prepare("SELECT COUNT(*) as c FROM lessons WHERE course_id IS NULL").get().c;
  const sampleLesson = db.prepare("SELECT quiz_json FROM lessons LIMIT 1").get();
  const sampleQuizCount = sampleLesson ? (JSON.parse(sampleLesson.quiz_json || '[]').length) : 0;
  
  if (!hasCorrectCourses || existingCoursesCount !== 3 || lessonsWithNullCourseId > 0 || sampleQuizCount !== 5) {
    console.log("Ma'lumotlar bazasi yangilanmoqda: 3 ta kurs va har birida 5 tadan savolli darslar o'rnatilmoqda...");
    // Avval o'quvchilar progressini kurs/dars IDlariga bog'liqlikdan tozalaymiz (o'quvchi ma'lumotlari saqlanadi)
    db.exec('UPDATE student_progress SET last_lesson_id=NULL, last_course_id=NULL');
    db.exec('DELETE FROM lessons');
    db.exec('DELETE FROM courses');
    db.exec('VACUUM');
    
    const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const insertLesson = db.prepare(`
      INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const c of COURSES_DATA) {
        const r = insertCourse.run(c.title, c.description);
        const courseId = r.lastInsertRowid;
        
        for (const l of c.lessons) {
          const fiveQuiz = (l.quiz || []).slice(0, 5);
          insertLesson.run(
            courseId,
            l.order_num,
            `${c.title} | ${l.order_num}-dars`,
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
    })();
    console.log("Bazaga 3 ta kurs va har bir dars uchun 5 tadan sifatli test savollari muvaffaqiyatli saqlandi!");
  }
}

seed();
module.exports = db;

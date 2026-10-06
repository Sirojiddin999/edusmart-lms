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
`);

// Add course_id if it does not exist (for existing databases)
try {
  db.exec(`ALTER TABLE lessons ADD COLUMN course_id INTEGER REFERENCES courses(id);`);
} catch(e) {}

// Helper
const Q = (q, opts, a) => ({ q, opts, a });

const LESSONS = require('./lessons_data.js');

// ─── Seed & Sync ──────────────────────────────────────────────────────────────
function seed() {
  const teacherExists = db.prepare("SELECT id FROM users WHERE role='teacher' LIMIT 1").get();
  if (!teacherExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (role, full_name, username, password_hash) VALUES (?,?,?,?)")
      .run('teacher', "Asliddin Karimov", 'oqituvchi', hash);
    console.log("✅ O'qituvchi yaratildi: oqituvchi / admin123");
  }

  const lessonCount = db.prepare("SELECT COUNT(*) as c FROM lessons").get().c;
  if (lessonCount === 0) {
    const courseInsert = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const courseRes = courseInsert.run("Asosiy Kurs", "Barcha mavjud darslar");
    const defaultCourseId = courseRes.lastInsertRowid;

    const insert = db.prepare(`
      INSERT INTO lessons (course_id,order_num,title,description,video_url,content_text,hashtags,quiz_json,min_score,duration_mins)
      VALUES (@course_id,@order_num,@title,@description,@video_url,@content_text,@hashtags,@quiz_json,@min_score,@duration_mins)
    `);
    const insertMany = db.transaction((lessons) => {
      for (const l of lessons) insert.run(l);
    });
    insertMany(LESSONS.map(l => ({
      course_id: defaultCourseId,
      order_num: l.order_num,
      title: l.title,
      description: l.description,
      video_url: l.video_url,
      content_text: l.content_text,
      hashtags: l.hashtags,
      quiz_json: JSON.stringify(l.quiz),
      min_score: 5,
      duration_mins: l.duration_mins,
    })));
    console.log(`✅ ${LESSONS.length} ta dars yaratildi (har birida 5 tadan test, 100% talab qilinadi).`);
  } else {
    // Ensure all existing lessons belong to a course
    const course = db.prepare("SELECT id FROM courses LIMIT 1").get();
    let cId = course ? course.id : null;
    if (!cId) {
       const cres = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)").run("Asosiy Kurs", "Barcha mavjud darslar");
       cId = cres.lastInsertRowid;
    }
    db.prepare("UPDATE lessons SET course_id = ? WHERE course_id IS NULL").run(cId);

    // Sync / Upgrade existing lessons to 5 questions and min_score 5
    const updateLesson = db.prepare(`
      UPDATE lessons 
      SET quiz_json = ?, min_score = ?, video_url = ?, title = ?, description = ?, content_text = ?, hashtags = ?, duration_mins = ?
      WHERE order_num = ?
    `);
    const syncTransaction = db.transaction(() => {
      for (const l of LESSONS) {
        updateLesson.run(
          JSON.stringify(l.quiz), l.min_score, l.video_url, l.title, l.description, l.content_text, l.hashtags, l.duration_mins, l.order_num
        );
      }
    });
    syncTransaction();
    console.log("🔄 Mavjud darslar har biri 5 tadan test va 100% o'tish talabi bilan yangilandi.");
  }

  // Ensure ALL courses have at least 10 lessons dynamically
  const allCourses = db.prepare("SELECT id, title FROM courses").all();
  const countStmt = db.prepare("SELECT COUNT(*) as c FROM lessons WHERE course_id = ?");
  const insertNewLesson = db.prepare(`
    INSERT INTO lessons (course_id,order_num,title,description,video_url,content_text,hashtags,quiz_json,min_score,duration_mins)
    VALUES (@course_id,@order_num,@title,@description,@video_url,@content_text,@hashtags,@quiz_json,@min_score,@duration_mins)
  `);
  
  db.transaction(() => {
    for (const c of allCourses) {
      if (countStmt.get(c.id).c === 0) {
        for (let i = 1; i <= 10; i++) {
          const quiz = [
            { q: `${c.title} asoslari bo'yicha eng muhim tushuncha nima?`, opts: ["Sintaksis", "Mantiq", "Tezlik", "Dizayn"], a: 1 },
            { q: `Ushbu texnologiyaning afzalligi nimada?`, opts: ["Oson o'rganilishi", "Ommabopligi", "Tez ishlashi", "Barchasi to'g'ri"], a: 3 },
            { q: `Darslikda qaysi mavzu yoritildi?`, opts: ["Boshlang'ich tushunchalar", "Murakkab tizimlar", "Faqat nazariya", "Tarixi"], a: 0 },
            { q: `Amaliyotda eng ko'p nima kerak bo'ladi?`, opts: ["Xatolarni topish", "Kod yozish", "Qayta o'qish", "Sabr va mehnat"], a: 3 },
            { q: `${c.title} ni o'rganishda davomiylik muhimmi?`, opts: ["Ha, doimiy o'rganish kerak", "Yo'q, 1 kunda o'rganiladi", "Faqat kitob o'qish yetarli", "Bilmadim"], a: 0 }
          ];
          insertNewLesson.run({
            course_id: c.id,
            order_num: i,
            title: `${c.title} | ${i}-dars`,
            description: `Bu ${c.title} kursining ${i}-video darsi. Dars oxirida 5 ta testni 100% yechishingiz kerak.`,
            video_url: "https://www.youtube.com/embed/T48Nn65_u-M",
            content_text: `${c.title} kursining ${i}-qismiga xush kelibsiz! Diqqat bilan videoni ko'ring va bilimlaringizni test orqali sinab ko'ring. O'tish bali 100%.`,
            hashtags: JSON.stringify(["#" + c.title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, ''), "#dars" + i]),
            quiz_json: JSON.stringify(quiz),
            min_score: 5,
            duration_mins: 30
          });
        }
        console.log(`✅ ${c.title} kursi uchun 10 ta yangi dars va testlar avtomatik yaratildi.`);
      }
    }
  })();
}

seed();
module.exports = db;

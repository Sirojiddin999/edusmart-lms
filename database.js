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
  }

  // Define the required 3 courses
  const coursesData = [
    {
      title: "Python Asoslari va Sun'iy Intellekt",
      description: "Dunnyodagi eng mashhur dasturlash tili yordamida backend mantiqi va AI ni o'rganing.",
      videoIds: ["kqtD5dpn9C8", "Z1Yd7upQsXY", "WGJJIrtnfpk", "t8pPdKYpowI", "x7X9w_GIm1s", "VchuKL44s6E", "8ext9G7xspg", "jO6qQDNa2CE", "rfscVS0vtbw", "XKHEtdqhPAI"],
      hash: "python"
    },
    {
      title: "JavaScript & React.js",
      description: "Zamonaviy veb-saytlar va interfeyslar yaratish uchun eng kerakli texnologiyalar.",
      videoIds: ["W6NZfCO5SIk", "hdI2bqOjy3c", "jS4aFq5-91M", "PkZNo7MFOUg", "hKB-YGF14SY", "w7ejDZ8SWv8", "bMknfKXIFA8", "Ke90Tje7VS0", "NCwa_xi0Uuc", "TNhaISOUy6Q"],
      hash: "javascript"
    },
    {
      title: "Java va Android Dasturlash",
      description: "Katta va xavfsiz tizimlar hamda Android mobil ilovalar yaratishni o'rganing.",
      videoIds: ["eIrMbAQSU34", "grEKMHGYyns", "WPvGqX-TXP0", "VHbSopMyc4M", "A74TOX803D0", "xk4_1vDrzzo", "ZBalWWHYFQc", "fis26HvvDII", "u-HOEUo2Dbc", "EE1-Wf12XEQ"],
      hash: "java"
    }
  ];

  // Hard Reset: Clear db to ensure EXACTLY these 3 courses
  const existingCoursesCount = db.prepare("SELECT COUNT(*) as c FROM courses").get().c;
  
  // Only recreate if there aren't exactly 3 courses (prevents wiping student progress on every reboot)
  // Or if we need to force it, we can wipe if the titles don't match. For simplicity, just wipe everything once to enforce.
  const hasCorrectCourses = db.prepare("SELECT COUNT(*) as c FROM courses WHERE title LIKE '%Python%'").get().c > 0;
  
  if (!hasCorrectCourses || existingCoursesCount !== 3) {
    console.log("Ma'lumotlar bazasi yangilanmoqda: Aniq 3 ta asosiy kurs o'rnatilmoqda...");
    db.exec('DELETE FROM student_progress');
    db.exec('DELETE FROM lessons');
    db.exec('DELETE FROM courses');
    db.exec('VACUUM');
    
    const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const insertLesson = db.prepare("INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    db.transaction(() => {
      for (const c of coursesData) {
        const r = insertCourse.run(c.title, c.description);
        const courseId = r.lastInsertRowid;
        
        for (let i = 0; i < 10; i++) {
          const orderNum = i + 1;
          const quiz = [
            { q: "Bu dars qaysi texnologiya haqida?", opts: [c.title.split(' ')[0], "HTML", "CSS", "Boshqa"], a: 0 },
            { q: "O'zlashtirish uchun nima eng muhim?", opts: ["Dars qoldirish", "Faqat ko'rish", "Amaliyot va mashq qilish", "Uxlash"], a: 2 },
            { q: "Qaysi qatorda xato yo'q?", opts: ["Sintaksis to'g'ri", "Sintaksix", "Syntekis", "Suntikss"], a: 0 },
            { q: orderNum + "-darsdan olgan bilimlaringiz tushunarlimi?", opts: ["Juda tushunarli", "Uncha emas", "Tushunmadim", "Umuman emas"], a: 0 },
            { q: "Darsni yakunlash uchun o'tish bali necha?", opts: ["20%", "50%", "80%", "100% (5 ball)"], a: 3 }
          ];
          
          insertLesson.run(
            courseId,
            orderNum,
            c.title + " | " + orderNum + "-dars",
            "Bu " + c.title + " kursining " + orderNum + "-video darsi.",
            "https://www.youtube.com/embed/" + c.videoIds[i],
            "Diqqat bilan videoni ko'ring va bilimlaringizni sinash uchun pastdagi 5 ta testni yeching. O'tish talabi: barcha savollarga to'g'ri javob berish (100%).",
            JSON.stringify(["#" + c.hash, "#dasturlash", "#dars" + orderNum]),
            JSON.stringify(quiz),
            5, 30
          );
        }
      }
    })();
  }
}

seed();
module.exports = db;

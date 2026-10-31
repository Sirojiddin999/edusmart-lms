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

  CREATE TABLE IF NOT EXISTS library (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    title          TEXT NOT NULL,
    category       TEXT DEFAULT 'maqolalar',
    category_label TEXT DEFAULT 'Ilmiy Maqola',
    description    TEXT DEFAULT '',
    file_url       TEXT NOT NULL,
    icon           TEXT DEFAULT '📄',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url   TEXT DEFAULT '',
    source_name TEXT DEFAULT 'innocode.uz',
    source_url  TEXT DEFAULT '#',
    tag         TEXT DEFAULT 'Ta''lim',
    date_label  TEXT DEFAULT 'Yangilik',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
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

  // 210 nafar talaba va o'qituvchi Marufjonni ta'minlash
  try {
    const studentCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='student'").get().c;
    if (studentCount !== 210) {
      console.log(`Bazadagi talabalar soni (${studentCount}) 210 ta emas. 210 nafar talabalar shakllantirilmoqda...`);
      const runSeed210 = require('./seed_210_students.js');
      runSeed210();
    }
    // Videolarni o'zbekcha YouTube darslariga yangilash
    const updateUzVideos = require('./update_uz_videos.js');
    updateUzVideos();
  } catch (err) {
    console.error("210 talaba yoki videolarni yangilashda xatolik:", err);
  }

  // Kutubxona va Yangiliklar dastlabki ma'lumotlari
  try {
    const libCount = db.prepare("SELECT COUNT(*) as c FROM library").get().c;
    if (libCount === 0) {
      const insLib = db.prepare("INSERT INTO library (title, category, category_label, description, file_url, icon) VALUES (?, ?, ?, ?, ?, ?)");
      const defaultLibrary = [
        ["KOMPYUTER INJINIRINGI YONALISHI TALABALARINING RAQAMLI-TEXNOLOGIK KOMPETENTLIGINI RIVOJLANTIRISH METODIKASI", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1zv0jGGwgMYU79R1PV86aeSVekKE1Th4s/view?usp=drive_link", "📄"],
        ["Raqamli texnologiyalar asosida ta'lim sifatini baholash", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1wPkICAazHkRKYD0MZumrQW8j0JyooK_y/view?usp=drive_link", "📄"],
        ["“MA'LUMOTLAR BAZASI” FANINING MAZMUNI VA OʻQITISH METODIKASINI ISHLAB CHIQISH", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1vOYXW4kks8I-k4rbiWU0NtwoLGx3Ks9o/view?usp=drive_link", "📄"],
        ["DASTURLASH FANLARINI O‘QITISH MISOLIDA RAQAMLI VA TEXNOLOGIK KOMPETENTLIKNI OSHIRISH", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1pAb6jRtAzzIfCY6T04CZDbtjlkTehjLm/view?usp=drive_link", "📄"],
        ["FIZIKADAN LABORATORIYA MASHG’ULOTLARIGA", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1jQKuknNXCnQXjZgH8B1Icn2awY_biCEd/view?usp=drive_link", "📄"],
        ["Pedagogik diagnostikada mashinaviy o‘rganish texnologiyalaridan foydalanish", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1j6jR9U-70x0bCMh1PgPV4vwWoc_qaRWk/view?usp=drive_link", "📄"],
        ["DASTURLASH TILLARINI O‘QITISH JARAYONIDA TALABALARNING RAQAMLI-TEXNOLOGIK KOMPETENTLIGINI RIVOJLANTIRISHNING NAZARIY-METODOLOGIK ASOSLARI", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1hElccvfdvVJt7PJearsVGAZPtpvapyWc/view?usp=drive_link", "📄"],
        ["DASTURLASH TILLARINI O‘QITISH JARAYONIDA TALABALARNING RAQAMLI-TEXNOLOGIK KOMPETENTLIGINI RIVOJLANTIRISHNING SHART-SHAROITLARI", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1V_dR2g4FTJnou6CG760_zmdqJlfZql47/view?usp=sharing", "📄"],
        ["Methods for Developing Teachers' Digital Competence", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1QJ0nzQoexPCfKoBp_RIxPQ5HQY0_pfIa/view?usp=drive_link", "📄"],
        ["OLIY TA’LIM DASTURLARINI MODERNIZATSIYA QILISHNING ASOSIY YO‘NALISHLARI", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1Ox7Wb84GHT0N9_A5pbuxgF4HbBzL4bK-/view?usp=drive_link", "📄"],
        ["RAQAMLI TEXNOLOGIYALAR ASOSIDA HOSILDORLIKNI PROGNOZLA TIZIMI", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1Jx9fRvvmKogPxNz6xs39B76teb9LTEzh/view?usp=drive_link", "📄"],
        ["Creation of Electronic Textbooks and Their Practical Implementation", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1Jrvc0NZesAomq5rkrgWKW67LhnLYUPej/view?usp=drive_link", "📄"],
        ["OLIY TALIM MUASSASALARI PEDAGOG KADIRLARNI", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/1DjY56I0VnCJeTTRwosjUsE9ift-_Kw60/view?usp=drive_link", "📄"],
        ["“KOMPYUTER INJINIRINGI” YO‘NALISHI TALABALARINING DASTURLASH TILLARI ASOSIDA", "maqolalar", "Ilmiy Maqola", "", "https://drive.google.com/file/d/13vIKehB7Wd2iVJg08ZdkmIV7c-KkkjTk/view?usp=drive_link", "📄"],
        ["Axborot texnologiyalari.pdf", "qollanmalar", "O‘quv qo‘llanma", "PDF formatdagi elektron o‘quv qo‘llanma", "https://drive.google.com/file/d/1x87vTAdlABLxlVfm5Bzrye-I0fNBYpzd/view?usp=drive_link", "📕"],
        ["Ma'lumotlar bazasi fanidan o‘quv qo‘llanma.pdf", "qollanmalar", "O‘quv qo‘llanma", "PDF formatdagi elektron o‘quv qo‘llanma", "https://drive.google.com/file/d/1jPa-G66bp1zsteADygRLTqUX0VA8S_HI/view?usp=drive_link", "📘"],
        ["O‘quv qo‘llanma.pdf", "qollanmalar", "O‘quv qo‘llanma", "PDF formatdagi elektron o‘quv qo‘llanma", "https://drive.google.com/file/d/14HTx_rX0nSVlzVYNOQVAGIqyGMgFxQ8m/view", "📗"],
        ["Sun'iy intellekt o‘quv qo‘llanma.pdf", "qollanmalar", "O‘quv qo‘llanma", "PDF formatdagi yangilangan o‘quv qo‘llanma", "https://drive.google.com/file/d/1IqE-O_HDPKFBrG0qSqjv_cYoxzVunqVV/view", "📙"],
        ["Ma'lumotlar bazasi", "darsliklar", "Darslik", "Oliy ta'lim talabalari uchun asosiy darslik", "https://drive.google.com/file/d/1r4OxXfkVUzaLsgr51lXVHL8AdsiCMhCF/view", "📚"],
        ["Axborot texnologiyalari", "darsliklar", "Darslik", "Axborot-kommunikatsiya texnologiyalari darsligi", "https://drive.google.com/file/d/1u-IpJz_4SSoAo2Y87woRDkir7inpXXB7/view", "💻"],
        ["Web ilovalarni ishlab chiqish", "darsliklar", "Darslik", "Zamonaviy veb dasturlash va ilovalar darsligi", "https://drive.google.com/file/d/1XiS_Z-5ZzGrtNjGiyrL455-ttfT7MHEz/view", "🌐"]
      ];
      db.transaction(() => {
        for (const item of defaultLibrary) insLib.run(...item);
      })();
    }

    const newsCount = db.prepare("SELECT COUNT(*) as c FROM news").get().c;
    if (newsCount === 0) {
      const insNews = db.prepare("INSERT INTO news (title, description, image_url, source_name, source_url, tag, date_label) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const defaultNews = [
        [
          "O‘zbekistonda xalqaro IT sertifikat xarajatlarini 100% gacha qoplash dasturi kengaytirildi",
          "Yoshlarning Coursera, Google, Cisco va Microsoft xalqaro sertifikatlarini olish xarajatlari davlat tomonidan to‘liq qoplab berilmoqda. Arizalar Yagona portal orqali qabul qilinadi.",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
          "Spot.uz",
          "https://www.spot.uz/oz/2023/11/02/it-certificates/",
          "IT Park & Edu",
          "Ta'lim Granti"
        ],
        [
          "O‘zbekistonlik dasturchilar uchun global kompaniyalarda masofaviy ishlash (Remote IT) imkoniyatlari 3 barobarga oshdi",
          "Mahalliy IT mutaxassislar xorijiy kompaniyalarga uydan turib eksport xizmatlarini ko‘rsatish hajmini rekord darajaga yetkazdi. Ingliz tili va dasturlash bilimlari yuqori talabga ega.",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
          "Kun.uz",
          "https://kun.uz/news/2023/12/28/ozbekistonlik-yoshlar-uchun-it-sohasida-yangi-imkoniyatlar",
          "Eksport & Karyera",
          "IT Olam"
        ],
        [
          "Maktab va OTMlarda sun'iy intellekt va dasturlash bo‘yicha interaktiv o‘quv dasturlari joriy etilmoqda",
          "Yangi o‘quv yilidan boshlab o‘quvchi va talabalar uchun sun'iy intellekt texnologiyalaridan to‘g‘ri foydalanish, data science va machine learning asoslari bo‘yicha amaliy mashg‘ulotlar o‘tiladi.",
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
          "Daryo.uz",
          "https://daryo.uz/",
          "Sun'iy Intellekt",
          "Innovatsiya"
        ],
        [
          "Google va Coursera O‘zbekiston yoshlariga minglab bepul ta'lim grantlarini taqdim etmoqda",
          "Kiberxavfsizlik, ma'lumotlar tahlili, loyiha boshqaruvi va IT-support yo‘nalishlarida xalqaro darajadagi kasbiy sertifikatlar dasturiga qabul ochildi.",
          "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80",
          "Gazeta.uz",
          "https://www.gazeta.uz/oz/",
          "Xalqaro Grant",
          "Ta'lim Tizimi"
        ],
        [
          "Talabalar uchun elektron kutubxona va ochiq darsliklar platformasi takomillashtirildi",
          "Oliy ta'lim, fan va innovatsiyalar vazirligi tomonidan fan dasturlariga oid minglab elektron kitoblar, ilmiy maqolalar va ma'ruza matnlari bepul foydalanishga topshirildi.",
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
          "Edu.uz",
          "https://edu.uz/uz",
          "Elektron Kutubxona",
          "Raqamli Ta'lim"
        ],
        [
          "Eng talabgir dasturlash tillari: Python, JavaScript va mobil dasturlash bo‘yicha tahliliy hisobot",
          "Amaliy dasturlash va zamonaviy web texnologiyalari bo‘yicha bozorda talab qilinayotgan texnik ko‘nikmalar hamda yangi boshlovchilar uchun tavsiyalar e'lon qilindi.",
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
          "Mohirdev",
          "https://mohirdev.uz/",
          "Kasbiy Rivojlanish",
          "IT Kasblar"
        ]
      ];
      db.transaction(() => {
        for (const item of defaultNews) insNews.run(...item);
      })();
    }
  } catch (err) {
    console.error("Kutubxona va yangiliklar yuklashda xatolik:", err);
  }
}

seed();
module.exports = db;


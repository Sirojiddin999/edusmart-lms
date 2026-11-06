const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const STUDENTS_RAW = require('./students_list.js');
const COURSES_DATA = require('./curriculum.js');

const db = new Database(path.join(__dirname, 'platform.db'));

// Lotincha transliteratsiya qilish funksiyasi
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/o‘|oʻ|o'|o`/g, 'o')
    .replace(/g‘|gʻ|g'|g`/g, 'g')
    .replace(/sh/g, 'sh')
    .replace(/ch/g, 'ch')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function generateUsername(fullName, index) {
  const parts = fullName.trim().split(/\s+/);
  const lastName = slugify(parts[0] || 'student');
  const firstName = slugify(parts[1] || '');
  let base = firstName ? `${firstName[0]}_${lastName}` : lastName;
  if (!base) base = `student_${index + 1}`;
  return base;
}

function runSeed() {
  console.log("Ma'lumotlar bazasini tozalash va yangilash boshlandi...");

  // 1. O'qituvchi Marufjon hisobini yaratish / yangilash (boshqa yangi o'qituvchilarga tegmasdan)
  const marufjonHash = bcrypt.hashSync('Marufjon', 10);
  const existingTeacher = db.prepare("SELECT id FROM users WHERE role='teacher' AND (LOWER(username)='marufjon' OR LOWER(username)='1111') LIMIT 1").get();
  if (existingTeacher) {
    db.prepare(`
      UPDATE users 
      SET full_name='Ma‘rufjon Isomiddinov', username='Marufjon', password_hash=?, pin_code='Marufjon'
      WHERE id=?
    `).run(marufjonHash, existingTeacher.id);
  } else {
    db.prepare(`
      INSERT INTO users (role, full_name, username, password_hash, pin_code)
      VALUES ('teacher', 'Ma‘rufjon Isomiddinov', 'Marufjon', ?, 'Marufjon')
    `).run(marufjonHash);
  }

  // 2. Kurslar yetarli bo'lmasa curriculum dan to'ldirish (o'qituvchilar yaratgan yangi kurslarni o'chirmaslik!)
  const currentCourses = db.prepare("SELECT * FROM courses ORDER BY id ASC").all();
  if (currentCourses.length === 0) {
    const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    const insertLesson = db.prepare(`
      INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const c of COURSES_DATA.slice(0, 3)) {
        const cr = insertCourse.run(c.title, c.description);
        const courseId = cr.lastInsertRowid;
        for (const l of c.lessons) {
          insertLesson.run(
            courseId,
            l.order_num,
            l.title,
            l.description,
            l.video_url,
            l.content_text,
            JSON.stringify(["#dasturlash", "#ta'lim", "#dars" + l.order_num]),
            JSON.stringify((l.quiz || []).slice(0, 5)),
            5,
            l.duration_mins || 30
          );
        }
      }
    })();
  }

  // 1-kurs darslari (Python kursi)
  const coursesList = db.prepare("SELECT * FROM courses ORDER BY id ASC").all();
  const pythonCourse = coursesList[0];
  const pythonLessons = db.prepare("SELECT id, order_num FROM lessons WHERE course_id=? ORDER BY order_num ASC").all(pythonCourse.id);

  console.log(`Kurslar soni: ${coursesList.length}, 1-kurs darslari soni: ${pythonLessons.length}`);

  // 3. Eski talabalarni o'chirish va yangi 210 ta talabani kiritish
  db.prepare("DELETE FROM student_progress WHERE user_id IN (SELECT id FROM users WHERE role='student')").run();
  db.prepare("DELETE FROM certificates WHERE user_id IN (SELECT id FROM users WHERE role='student')").run();
  db.prepare("DELETE FROM users WHERE role='student'").run();

  const insertUser = db.prepare(`
    INSERT INTO users (role, full_name, username, password_hash, pin_code, created_at)
    VALUES ('student', ?, ?, ?, ?, datetime('now', ?))
  `);

  const insertProgress = db.prepare(`
    INSERT INTO student_progress (user_id, last_lesson_id, completed_lesson_ids, scores_json, last_course_id, last_active)
    VALUES (?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const insertCert = db.prepare(`
    INSERT INTO certificates (id, user_id, course_id, student_name, course_title, score_percent, issue_date)
    VALUES (?, ?, ?, ?, ?, 100, ?)
  `);

  const defaultPassword = '1234';
  const defaultHash = bcrypt.hashSync(defaultPassword, 10);
  const usedUsernames = new Set(['marufjon', '1111', 'admin']);

  const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
  const now = new Date();
  const certDate = `${now.getDate()}-${months[now.getMonth()]}, ${now.getFullYear()}-yil`;

  db.transaction(() => {
    STUDENTS_RAW.forEach((fullName, idx) => {
      // Unikal username
      let baseUsername = generateUsername(fullName, idx);
      let username = baseUsername;
      let counter = 1;
      while (usedUsernames.has(username)) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }
      usedUsernames.add(username);

      // Har bir o'quvchi uchun qulay parol: 1234
      const pinCode = defaultPassword;
      const daysOffset = `-${(idx % 14) + 1} days`;

      const userRes = insertUser.run(fullName, username, defaultHash, pinCode, daysOffset);
      const studentId = userRes.lastInsertRowid;

      // Ko'rsatkichlarni taqsimlash (Rasmga binoan: 41 nafar Yuqori, 78 nafar O'rta, 91 nafar Past)
      let completedLessons = [];
      let scores = {};
      let lastLessonId = pythonLessons[0]?.id || 1;

      if (idx < 41) {
        // --- YUQORI DARAJA (41 nafar - 19.8%) ---
        // 1-kursning barcha 10 ta darsini to'liq 100% topshirgan (5/5)
        completedLessons = pythonLessons.map(l => l.id);
        pythonLessons.forEach(l => {
          scores[l.id] = 5; // 5 tadan to'g'ri (100%)
        });
        lastLessonId = pythonLessons[pythonLessons.length - 1]?.id || pythonLessons[0]?.id;

        // Sertifikat berilgan!
        const certId = `CYB-2026-${100000 + idx * 7 + 13}`;
        insertCert.run(certId, studentId, pythonCourse.id, fullName, pythonCourse.title, certDate);

      } else if (idx < 41 + 78) {
        // --- O'RTA DARAJA (78 nafar - 37.7%) ---
        // 4 tadan 7 tagacha dars topshirgan (40% - 70%)
        const count = 4 + (idx % 4); // 4, 5, 6 yoki 7 ta dars
        const sliced = pythonLessons.slice(0, count);
        completedLessons = sliced.map(l => l.id);
        sliced.forEach(l => {
          scores[l.id] = 5;
        });
        lastLessonId = pythonLessons[count]?.id || sliced[sliced.length - 1]?.id;

      } else {
        // --- PAST DARAJA (91 nafar - 42.5%) ---
        // 1 tadan 3 tagacha dars topshirgan (10% - 30%)
        const count = 1 + (idx % 3); // 1, 2 yoki 3 ta dars
        const sliced = pythonLessons.slice(0, count);
        completedLessons = sliced.map(l => l.id);
        sliced.forEach(l => {
          scores[l.id] = 5;
        });
        lastLessonId = pythonLessons[count]?.id || sliced[sliced.length - 1]?.id;
      }

      const activeOffset = `-${(idx % 48)} hours`;
      insertProgress.run(
        studentId,
        lastLessonId,
        JSON.stringify(completedLessons),
        JSON.stringify(scores),
        pythonCourse.id,
        activeOffset
      );
    });
  })();

  console.log(`210 nafar talaba muvaffaqiyatli shakllantirildi!`);
  console.log(`- Yuqori darajadagilar: 41 nafar (100% bitirgan, sertifikatli)`);
  console.log(`- O'rta darajadagilar: 78 nafar (40%-70%)`);
  console.log(`- Past darajadagilar: 91 nafar (10%-30%)`);
}

module.exports = runSeed;

if (require.main === module) {
  runSeed();
}

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const JWT_SECRET = 'edusmart_secret_2025_xz9k!';
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token talab qilinadi" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Yaroqsiz yoki muddati o'tgan token" });
  }
}

function onlyTeacher(req, res, next) {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: "Faqat o'qituvchi uchun" });
  next();
}

function onlyStudent(req, res, next) {
  if (req.user.role !== 'student') return res.status(403).json({ error: "Faqat o'quvchi uchun" });
  next();
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function jsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function getProgress(userId) {
  let p = db.prepare("SELECT * FROM student_progress WHERE user_id=?").get(userId);
  if (!p) {
    db.prepare("INSERT INTO student_progress (user_id) VALUES (?)").run(userId);
    p = db.prepare("SELECT * FROM student_progress WHERE user_id=?").get(userId);
  }
  return p;
}

function getAllLessons(courseId = null) {
  if (courseId) {
    return db.prepare("SELECT * FROM lessons WHERE course_id=? ORDER BY order_num ASC").all(courseId);
  }
  return db.prepare("SELECT * FROM lessons ORDER BY order_num ASC").all();
}

function getAllCourses() {
  return db.prepare("SELECT * FROM courses ORDER BY id ASC").all();
}

// ─── AUTH ROUTES ───────────────────────────────────────────────────────────────

// Student register
app.post('/api/auth/register-student', (req, res) => {
  try {
    const { first_name, last_name, custom_pin } = req.body;
    const fname = (first_name || '').trim();
    const lname = (last_name || '').trim();
    const pin = (custom_pin || '').trim();

    if (!fname || !lname)
      return res.status(400).json({ error: "Ism va familiya to'liq kiritilishi shart!" });

    if (fname.length < 2)
      return res.status(400).json({ error: "Ismingizni to'liq kiriting (kamida 2 ta harf)!" });

    // Familiya tekshiruvi: oxirgacha kiritilgan va ...yev, ...yeva (yoki ...ov, ...ova) bilan tugashi shart
    const surnameRegex = /(yev|yeva|ev|eva|ov|ova)$/i;
    if (lname.length < 4 || !surnameRegex.test(lname)) {
      return res.status(400).json({ 
        error: "Familiyangizni to'liq kiriting! Familiya ...yev yoki ...yeva bilan tugashi shart (Masalan: Aliyev yoki Aliyeva)." 
      });
    }

    // Kod tekshiruvi: katta harf, nuqta va son mavjudligi
    const hasUpper = /[A-ZА-ЯЁ]/.test(pin);
    const hasDot = /\./.test(pin);
    const hasDigit = /[0-9]/.test(pin);

    if (!pin || pin.length < 4 || !hasUpper || !hasDot || !hasDigit) {
      return res.status(400).json({ 
        error: "Kod talabga javob bermaydi! Kod kamida 1 ta katta harf (A-Z), raqam (0-9) va nuqta (.) dan iborat bo'lishi shart! (Masalan: Kod.123)" 
      });
    }

    const full_name = `${fname} ${lname}`;
    const rand4 = Math.floor(1000 + Math.random() * 9000);
    const username = `${fname.toLowerCase().replace(/[^a-z]/g, '')}_${rand4}`;
    const hash = bcrypt.hashSync(pin, 10);

    const r = db.prepare("INSERT INTO users (role,full_name,username,password_hash,pin_code) VALUES (?,?,?,?,?)")
      .run('student', full_name, username, hash, pin);
    const lessons = getAllLessons();
    const courses = getAllCourses();
    const firstLesson = lessons.length ? lessons[0] : null;
    const firstId = firstLesson ? firstLesson.id : null;
    const firstCourseId = firstLesson ? firstLesson.course_id : (courses[0] ? courses[0].id : null);
    
    db.prepare("INSERT INTO student_progress (user_id, last_lesson_id, last_course_id) VALUES (?,?,?)")
      .run(r.lastInsertRowid, firstId, firstCourseId);

    const user = { id: r.lastInsertRowid, full_name, username, role: 'student', pin_code: pin };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!", username, pin_code: pin, full_name, token });
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ error: "Bu login band, qayta urinib ko'ring" });
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Student login
app.post('/api/auth/login-student', (req, res) => {
  try {
    const { username, pin_code } = req.body;
    const u = db.prepare("SELECT * FROM users WHERE username=? AND role='student'").get(username?.trim());
    if (!u || !bcrypt.compareSync(pin_code, u.password_hash))
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    
    // Agar pin_code avval yozilmagan bo'lsa, o'qituvchi ko'rishi uchun saqlab qo'yish
    if (!u.pin_code && pin_code) {
      db.prepare("UPDATE users SET pin_code=? WHERE id=?").run(pin_code, u.id);
    }
    db.prepare("UPDATE student_progress SET last_active=CURRENT_TIMESTAMP WHERE user_id=?").run(u.id);
    const payload = { id: u.id, full_name: u.full_name, username: u.username, role: 'student', pin_code: u.pin_code || pin_code };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: payload });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Teacher login
app.post('/api/auth/login-teacher', (req, res) => {
  try {
    const { username, password } = req.body;
    const u = db.prepare("SELECT * FROM users WHERE LOWER(username)=LOWER(?) AND role='teacher'").get(username?.trim());
    if (!u || !bcrypt.compareSync(password, u.password_hash))
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    const payload = { id: u.id, full_name: u.full_name, username: u.username, role: 'teacher' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: payload });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// ─── STUDENT ROUTES ────────────────────────────────────────────────────────────

// Parolni o'zgartirish
app.post('/api/student/change-password', auth, onlyStudent, (req, res) => {
  try {
    const { old_pin, new_pin } = req.body;
    const u = db.prepare("SELECT * FROM users WHERE id=?").get(req.user.id);
    if (!u || !bcrypt.compareSync(old_pin, u.password_hash)) {
      return res.status(401).json({ error: "Hozirgi parol noto'g'ri" });
    }
    if (!new_pin || new_pin.trim().length < 4) {
      return res.status(400).json({ error: "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak" });
    }
    const hash = bcrypt.hashSync(new_pin.trim(), 10);
    db.prepare("UPDATE users SET password_hash=?, pin_code=? WHERE id=?").run(hash, new_pin.trim(), req.user.id);
    res.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Dashboard (Istalgan qurilmadan kirganda o'quvchi aynan qoldirgan joyidan ochiladi)
app.get('/api/student/dashboard', auth, onlyStudent, (req, res) => {
  try {
    let p = getProgress(req.user.id);
    const lessons = getAllLessons();
    const courses = getAllCourses();
    if (!p) {
      const firstLesson = lessons.length ? lessons[0] : null;
      db.prepare("INSERT INTO student_progress (user_id, last_lesson_id, last_course_id) VALUES (?,?,?)")
        .run(req.user.id, firstLesson?.id || null, firstLesson?.course_id || null);
      p = getProgress(req.user.id);
    }
    const completedIds = jsonParse(p.completed_lesson_ids, []);
    const scoresMap = jsonParse(p.scores_json, {});
    const total = lessons.length;
    const completedCount = completedIds.length;
    const pct = total ? Math.round((completedCount / total) * 100) : 0;

    // Oxirgi darsni aniqlash: saqlangan dars yoki tugallanmagan birinchi dars
    let currentLesson = lessons.find(l => l.id === p.last_lesson_id);
    if (!currentLesson && lessons.length) {
      currentLesson = lessons.find(l => !completedIds.includes(l.id)) || lessons[0];
    }

    const currentCourseId = p.last_course_id || (currentLesson ? currentLesson.course_id : (courses[0] ? courses[0].id : null));

    // Ochiq darslar: barcha tugallanganlar + har bir kursdagi birinchi tugallanmagan dars
    const unlockedIds = [...completedIds];
    courses.forEach(c => {
      const cLessons = lessons.filter(l => l.course_id === c.id);
      const firstInc = cLessons.find(l => !completedIds.includes(l.id));
      if (firstInc && !unlockedIds.includes(firstInc.id)) {
        unlockedIds.push(firstInc.id);
      }
    });

    res.json({
      lessons: lessons.map(l => ({
        id: l.id, course_id: l.course_id, order_num: l.order_num, title: l.title,
        description: l.description, duration_mins: l.duration_mins,
        hashtags: jsonParse(l.hashtags, []),
        has_quiz: jsonParse(l.quiz_json, []).length > 0,
        question_count: jsonParse(l.quiz_json, []).length,
        min_score: l.min_score,
      })),
      progress: {
        completed_lesson_ids: completedIds,
        completed_count: completedCount,
        total_lessons: total,
        progress_percent: pct,
        scores: scoresMap,
        unlocked_ids: unlockedIds,
        last_course_id: currentCourseId,
        last_lesson_id: currentLesson ? currentLesson.id : null,
      },
      current_lesson: currentLesson ? { id: currentLesson.id, title: currentLesson.title, course_id: currentLesson.course_id } : null,
      courses: courses
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Kursni tanlash va serverda oxirgi holatni saqlash (qurilmalararo sinxronizatsiya)
app.post('/api/student/select-course', auth, onlyStudent, (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) return res.status(400).json({ error: "course_id kerak" });
    const cLessons = db.prepare("SELECT id FROM lessons WHERE course_id=? ORDER BY order_num ASC").all(course_id);
    const p = getProgress(req.user.id);
    const completedIds = jsonParse(p.completed_lesson_ids, []);
    const nextLesson = cLessons.find(l => !completedIds.includes(l.id)) || cLessons[0];
    const lessonId = nextLesson ? nextLesson.id : null;
    
    db.prepare("UPDATE student_progress SET last_course_id=?, last_lesson_id=?, last_active=CURRENT_TIMESTAMP WHERE user_id=?")
      .run(course_id, lessonId, req.user.id);
    res.json({ success: true, course_id, lesson_id: lessonId });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Get single lesson (va joriy holatni serverda darhol saqlash)
app.get('/api/student/lessons/:id', auth, onlyStudent, (req, res) => {
  try {
    const lesson = db.prepare("SELECT * FROM lessons WHERE id=?").get(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });

    // Foydalanuvchi qaysi darsni ochsa, serverda oxirgi holat sifatida saqlanadi
    db.prepare("UPDATE student_progress SET last_lesson_id=?, last_course_id=?, last_active=CURRENT_TIMESTAMP WHERE user_id=?")
      .run(lesson.id, lesson.course_id, req.user.id);

    const p = getProgress(req.user.id);
    const completedIds = jsonParse(p.completed_lesson_ids, []);
    const scoresMap = jsonParse(p.scores_json, {});
    const quiz = jsonParse(lesson.quiz_json, []);

    res.json({
      id: lesson.id,
      course_id: lesson.course_id,
      order_num: lesson.order_num,
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      content_text: lesson.content_text,
      duration_mins: lesson.duration_mins,
      hashtags: jsonParse(lesson.hashtags, []),
      min_score: lesson.min_score || 5,
      is_completed: completedIds.includes(lesson.id),
      my_score: scoresMap[lesson.id] ?? null,
      quiz: quiz.map((q, i) => ({ originalIndex: i, q: q.q, opts: q.opts })),
      question_count: quiz.length,
    });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Submit quiz answers → calculate score, auto-complete if passed (100%)
app.post('/api/student/lessons/:id/quiz', auth, onlyStudent, (req, res) => {
  try {
    const lesson = db.prepare("SELECT * FROM lessons WHERE id=?").get(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });

    const quiz = jsonParse(lesson.quiz_json, []);
    if (!quiz.length) return res.status(400).json({ error: "Bu darsda test mavjud emas" });

    const { answers } = req.body; // [{ originalIndex, ans }, ...]
    if (!Array.isArray(answers)) return res.status(400).json({ error: "answers massivi kerak" });

    // Calculate score using originalIndex
    const results = answers.map(item => {
      const q = quiz[item.originalIndex];
      return q && q.a === item.ans;
    });
    const score = results.filter(Boolean).length;
    const total = answers.length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    // Talab: 100% yechgandan keyin keyingi dars ochilsin (barcha savollarga to'g'ri javob)
    const passed = (total > 0 && score === total);

    const p = getProgress(req.user.id);
    let completedIds = jsonParse(p.completed_lesson_ids, []);
    let scoresMap = jsonParse(p.scores_json, {});

    // Always save the score
    scoresMap[lesson.id] = score;

    const lessons = getAllLessons();
    let nextLessonId = p.last_lesson_id || lesson.id;

    if (passed) {
      if (!completedIds.includes(lesson.id)) {
        completedIds.push(lesson.id);
      }
      // Find next lesson in same course or overall
      const curIdx = lessons.findIndex(l => l.id === lesson.id);
      if (curIdx >= 0 && curIdx < lessons.length - 1) {
        nextLessonId = lessons[curIdx + 1].id;
      }
    }

    db.prepare(`UPDATE student_progress
      SET completed_lesson_ids=?, scores_json=?, last_lesson_id=?, last_course_id=?, last_active=CURRENT_TIMESTAMP
      WHERE user_id=?`).run(JSON.stringify(completedIds), JSON.stringify(scoresMap), nextLessonId, lesson.course_id, req.user.id);

    res.json({
      score, total, percent, passed,
      min_score: total,
      min_percent: 100,
      results,
      next_lesson_id: passed ? nextLessonId : null,
      message: passed
        ? `🎉 Tabriklaymiz! ${score}/${total} (100%) to'g'ri yechdingiz. Dars to'liq o'zlashtirildi va keyingi dars ochildi!`
        : `❌ Imtihondan o'ta olmadingiz! Natijangiz: ${score}/${total} (${percent}%). 100% (${total}/${total}) to'g'ri yechish shart. Qayta urinib ko'ring!`,
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Update student progress directly (fallback)
app.post('/api/student/progress', auth, onlyStudent, (req, res) => {
  try {
    const { lesson_id, mark_completed } = req.body;
    if (!lesson_id) return res.status(400).json({ error: "lesson_id kerak" });
    const p = getProgress(req.user.id);
    let completedIds = jsonParse(p.completed_lesson_ids, []);
    if (mark_completed && !completedIds.includes(lesson_id)) {
      completedIds.push(lesson_id);
    }
    const lessons = getAllLessons();
    const curLesson = lessons.find(l => l.id === lesson_id);
    const curIdx = lessons.findIndex(l => l.id === lesson_id);
    let nextLessonId = p.last_lesson_id;
    if (curIdx >= 0 && curIdx < lessons.length - 1) {
      nextLessonId = lessons[curIdx + 1].id;
    }
    db.prepare(`UPDATE student_progress SET completed_lesson_ids=?, last_lesson_id=?, last_course_id=COALESCE(?, last_course_id), last_active=CURRENT_TIMESTAMP WHERE user_id=?`)
      .run(JSON.stringify(completedIds), nextLessonId, curLesson?.course_id || null, req.user.id);
    res.json({ success: true, next_lesson_id: nextLessonId });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Sertifikat olish yoki yuklash (O'quvchi)
app.post('/api/student/certificate', auth, onlyStudent, (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) return res.status(400).json({ error: "course_id talab qilinadi" });

    const course = db.prepare("SELECT * FROM courses WHERE id=?").get(course_id);
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });

    const courseLessons = db.prepare("SELECT id FROM lessons WHERE course_id=?").all(course_id);
    if (!courseLessons.length) return res.status(400).json({ error: "Kursda darslar mavjud emas" });

    const p = getProgress(req.user.id);
    const completedIds = jsonParse(p.completed_lesson_ids, []);

    const allCompleted = courseLessons.every(l => completedIds.includes(l.id));
    if (!allCompleted) {
      const completedCount = courseLessons.filter(l => completedIds.includes(l.id)).length;
      return res.status(400).json({
        error: `Kurs hali to'liq yakunlanmagan. Siz ${completedCount}/${courseLessons.length} darsni topshirgansiz. Sertifikat uchun barcha darslarni 100% topshirishingiz lozim.`
      });
    }

    const u = db.prepare("SELECT full_name FROM users WHERE id=?").get(req.user.id);
    const studentName = u ? u.full_name : req.user.full_name;

    // Mavjud sertifikatni tekshirish
    let cert = db.prepare("SELECT * FROM certificates WHERE user_id=? AND course_id=?").get(req.user.id, course_id);
    if (!cert) {
      const randCode = Math.floor(100000 + Math.random() * 900000);
      const certId = `INNO-${new Date().getFullYear()}-${randCode}`;
      
      const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
      const now = new Date();
      const issueDate = `${now.getDate()}-${months[now.getMonth()]}, ${now.getFullYear()}-yil`;

      db.prepare(`
        INSERT INTO certificates (id, user_id, course_id, student_name, course_title, score_percent, issue_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(certId, req.user.id, course_id, studentName, course.title, 100, issueDate);

      cert = db.prepare("SELECT * FROM certificates WHERE id=?").get(certId);
    }

    res.json({
      success: true,
      certificate: cert,
      verify_url: `/certificate.html?id=${cert.id}`
    });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Ommaviy elektron sertifikatni tekshirish (QR-kod orqali ochiladi)
app.get('/api/public/certificate/:id', (req, res) => {
  try {
    const cert = db.prepare("SELECT * FROM certificates WHERE id=?").get(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, error: "Bunday sertifikat topilmadi yoki haqiqiy emas." });
    }
    res.json({ success: true, certificate: cert });
  } catch (e) {
    res.status(500).json({ success: false, error: "Server xatosi: " + e.message });
  }
});

// ─── TEACHER ROUTES ────────────────────────────────────────────────────────────

// Get all students with progress
app.get('/api/teacher/students', auth, onlyTeacher, (req, res) => {
  try {
    const students = db.prepare(`
      SELECT u.id, u.full_name, u.username,
             COALESCE(u.pin_code, '') as pin_code,
             COALESCE(u.created_at, datetime('now')) as registered_at,
             p.completed_lesson_ids, p.last_lesson_id, p.last_course_id,
             p.scores_json, p.last_active,
             l.title as last_lesson_title, l.order_num as last_lesson_order,
             c.title as last_course_title
      FROM users u
      LEFT JOIN student_progress p ON u.id = p.user_id
      LEFT JOIN lessons l ON p.last_lesson_id = l.id
      LEFT JOIN courses c ON COALESCE(p.last_course_id, l.course_id) = c.id
      WHERE u.role = 'student'
      ORDER BY COALESCE(p.last_active, '1970-01-01') DESC
    `).all();

    const lessons = getAllLessons();
    const courses = getAllCourses();
    const total_lessons = lessons.length;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let active_today = 0;

    const result = students.map(s => {
      const completed = jsonParse(s.completed_lesson_ids, []);
      const scores = jsonParse(s.scores_json, {});
      const avg_score = Object.keys(scores).length
        ? Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / (Object.keys(scores).length * 5)) * 100)
        : 0;

      const is_active = s.last_active && new Date(s.last_active) >= oneDayAgo;
      if (is_active) active_today++;

      let course_title = s.last_course_title;
      if (!course_title && s.last_lesson_title) {
        const foundL = lessons.find(l => l.title === s.last_lesson_title);
        if (foundL) {
          const foundC = courses.find(c => c.id === foundL.course_id);
          if (foundC) course_title = foundC.title;
        }
      }
      if (!course_title && courses.length > 0) {
        course_title = courses[0].title;
      }

      return {
        id: s.id,
        full_name: s.full_name,
        username: s.username,
        pin_code: s.pin_code || "Kiritilmagan",
        registered_at: s.registered_at,
        last_active: s.last_active,
        is_active: !!is_active,
        course_title: course_title || "Kurs tanlanmagan",
        last_lesson_title: s.last_lesson_title || "1-dars",
        last_lesson_order: s.last_lesson_order || 1,
        completed_count: completed.length,
        total_lessons,
        progress_percent: total_lessons ? Math.round((completed.length / total_lessons) * 100) : 0,
        avg_score,
        scores,
      };
    });

    const active_percent = result.length > 0 ? Math.round((active_today / result.length) * 100) : 0;
    const avg_progress = result.length > 0 ? Math.round(result.reduce((a, b) => a + b.progress_percent, 0) / result.length) : 0;

    res.json({
      students: result,
      stats: {
        total: result.length,
        active_today,
        active_percent,
        avg_progress
      }
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Student detailed results per lesson
app.get('/api/teacher/students/:id/details', auth, onlyTeacher, (req, res) => {
  try {
    const student = db.prepare("SELECT id, full_name, username, COALESCE(pin_code, '') as pin_code, created_at as registered_at FROM users WHERE id=? AND role='student'").get(req.params.id);
    if (!student) return res.status(404).json({ error: "O'quvchi topilmadi" });

    const p = getProgress(student.id);
    const completedIds = jsonParse(p.completed_lesson_ids, []);
    const scoresMap = jsonParse(p.scores_json, {});
    const lessons = getAllLessons();

    const lessonDetails = lessons.map(l => {
      const isDone = completedIds.includes(l.id);
      const score = scoresMap[l.id] ?? null;
      return {
        id: l.id,
        order_num: l.order_num,
        title: l.title,
        duration_mins: l.duration_mins,
        is_completed: isDone,
        score: score,
        max_score: 5,
        percent: score !== null ? Math.round((score / 5) * 100) : null
      };
    });

    res.json({
      student,
      progress: {
        last_active: p.last_active,
        completed_count: completedIds.length,
        total_lessons: lessons.length,
        progress_percent: lessons.length ? Math.round((completedIds.length / lessons.length) * 100) : 0
      },
      lessons: lessonDetails
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Leaderboard (rating)
app.get('/api/teacher/leaderboard', auth, onlyTeacher, (req, res) => {
  try {
    const students = db.prepare(`
      SELECT u.id, u.full_name, u.username,
             COALESCE(u.pin_code, '') as pin_code,
             COALESCE(u.created_at, datetime('now')) as registered_at,
             p.completed_lesson_ids, p.last_lesson_id, p.last_course_id,
             p.scores_json, p.last_active,
             l.title as last_lesson_title, l.order_num as last_lesson_order,
             c.title as last_course_title
      FROM users u
      LEFT JOIN student_progress p ON u.id = p.user_id
      LEFT JOIN lessons l ON p.last_lesson_id = l.id
      LEFT JOIN courses c ON COALESCE(p.last_course_id, l.course_id) = c.id
      WHERE u.role = 'student'
    `).all();

    const lessons = getAllLessons();
    const courses = getAllCourses();
    const total_lessons = lessons.length;

    const ranked = students.map(s => {
      const completed = jsonParse(s.completed_lesson_ids, []);
      const scores = jsonParse(s.scores_json, {});
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const avgScore = completed.length
        ? Math.round((totalScore / (completed.length * 5)) * 100)
        : 0;

      let course_title = s.last_course_title;
      if (!course_title && s.last_lesson_title) {
        const foundL = lessons.find(l => l.title === s.last_lesson_title);
        if (foundL) {
          const foundC = courses.find(c => c.id === foundL.course_id);
          if (foundC) course_title = foundC.title;
        }
      }
      if (!course_title && courses.length > 0) course_title = courses[0].title;

      return {
        id: s.id,
        full_name: s.full_name,
        username: s.username,
        pin_code: s.pin_code || "—",
        registered_at: s.registered_at,
        last_active: s.last_active,
        course_title: course_title || "Kurs tanlanmagan",
        last_lesson_title: s.last_lesson_title || '1-dars',
        completed_count: completed.length,
        total_lessons,
        progress_percent: total_lessons ? Math.round((completed.length / total_lessons) * 100) : 0,
        avg_score_percent: avgScore,
        total_score: totalScore,
      };
    }).sort((a, b) => {
      if (b.completed_count !== a.completed_count) return b.completed_count - a.completed_count;
      return b.total_score - a.total_score;
    }).map((s, i) => ({ ...s, rank: i + 1 }));

    res.json({ leaderboard: ranked, total_lessons });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Get all lessons (with quiz answers for teacher)
app.get('/api/teacher/lessons', auth, onlyTeacher, (req, res) => {
  try {
    const lessons = getAllLessons().map(l => ({
      ...l,
      hashtags: jsonParse(l.hashtags, []),
      quiz: jsonParse(l.quiz_json, []),
    }));
    res.json(lessons);
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Get single lesson (teacher)
app.get('/api/teacher/lessons/:id', auth, onlyTeacher, (req, res) => {
  try {
    const l = db.prepare("SELECT * FROM lessons WHERE id=?").get(req.params.id);
    if (!l) return res.status(404).json({ error: "Dars topilmadi" });
    res.json({ ...l, hashtags: jsonParse(l.hashtags, []), quiz: jsonParse(l.quiz_json, []) });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Get all courses (teacher)
app.get('/api/teacher/courses', auth, onlyTeacher, (req, res) => {
  try {
    const courses = getAllCourses();
    const lessons = getAllLessons();
    const coursesWithLessons = courses.map(c => ({
      ...c,
      lessons_count: lessons.filter(l => l.course_id === c.id).length
    }));
    res.json(coursesWithLessons);
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Create course
app.post('/api/teacher/courses', auth, onlyTeacher, (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Sarlavha majburiy" });
    const r = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)").run(title.trim(), description || '');
    res.json({ success: true, id: r.lastInsertRowid });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Update course
app.put('/api/teacher/courses/:id', auth, onlyTeacher, (req, res) => {
  try {
    const { title, description } = req.body;
    db.prepare("UPDATE courses SET title=?, description=? WHERE id=?").run(title.trim(), description || '', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Delete course
app.delete('/api/teacher/courses/:id', auth, onlyTeacher, (req, res) => {
  try {
    // Delete all lessons of this course
    db.prepare("DELETE FROM lessons WHERE course_id=?").run(req.params.id);
    db.prepare("DELETE FROM courses WHERE id=?").run(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Add lesson
app.post('/api/teacher/lessons', auth, onlyTeacher, (req, res) => {
  try {
    const { title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins, course_id } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Sarlavha majburiy" });
    if (!course_id) return res.status(400).json({ error: "Kursni tanlash majburiy" });

    const maxOrder = db.prepare("SELECT MAX(order_num) as m FROM lessons WHERE course_id=?").get(course_id).m || 0;
    const tags = Array.isArray(hashtags) ? hashtags : [];
    const quiz = Array.isArray(quiz_json) ? quiz_json : [];

    const r = db.prepare(`INSERT INTO lessons (course_id,order_num,title,description,video_url,content_text,hashtags,quiz_json,min_score,duration_mins)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
      course_id, maxOrder + 1, title.trim(), description || '', video_url || '', content_text || '',
      JSON.stringify(tags), JSON.stringify(quiz),
      min_score ?? 5, duration_mins ?? 30
    );
    res.json({ success: true, id: r.lastInsertRowid });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Update lesson (title, content, video, hashtags, quiz, min_score)
app.put('/api/teacher/lessons/:id', auth, onlyTeacher, (req, res) => {
  try {
    const l = db.prepare("SELECT id FROM lessons WHERE id=?").get(req.params.id);
    if (!l) return res.status(404).json({ error: "Dars topilmadi" });

    const { title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins, course_id } = req.body;
    const tags = Array.isArray(hashtags) ? hashtags : jsonParse(db.prepare("SELECT hashtags FROM lessons WHERE id=?").get(req.params.id)?.hashtags, []);
    const quiz = Array.isArray(quiz_json) ? quiz_json : jsonParse(db.prepare("SELECT quiz_json FROM lessons WHERE id=?").get(req.params.id)?.quiz_json, []);

    db.prepare(`UPDATE lessons SET course_id=COALESCE(?, course_id), title=?,description=?,video_url=?,content_text=?,hashtags=?,quiz_json=?,min_score=?,duration_mins=?
      WHERE id=?`).run(
      course_id, title || '', description || '', video_url || '', content_text || '',
      JSON.stringify(tags), JSON.stringify(quiz), min_score ?? 5, duration_mins ?? 30, req.params.id
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Delete lesson
app.delete('/api/teacher/lessons/:id', auth, onlyTeacher, (req, res) => {
  try {
    db.prepare("DELETE FROM lessons WHERE id=?").run(req.params.id);
    // Re-order
    const lessons = getAllLessons();
    const reorder = db.transaction((ls) => {
      ls.forEach((l, i) => db.prepare("UPDATE lessons SET order_num=? WHERE id=?").run(i + 1, l.id));
    });
    reorder(lessons);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Delete student
app.delete('/api/teacher/students/:id', auth, onlyTeacher, (req, res) => {
  try {
    db.prepare("DELETE FROM users WHERE id=? AND role='student'").run(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Reset student progress
app.post('/api/teacher/students/:id/reset', auth, onlyTeacher, (req, res) => {
  try {
    const lessons = getAllLessons();
    const firstId = lessons.length ? lessons[0].id : null;
    db.prepare(`UPDATE student_progress SET completed_lesson_ids='[]', scores_json='{}', last_lesson_id=? WHERE user_id=?`)
      .run(firstId, req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Update teacher settings (login/password)
app.put('/api/teacher/settings', auth, onlyTeacher, (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim()) return res.status(400).json({ error: "Login bo'sh bo'lishi mumkin emas" });

    const exist = db.prepare("SELECT id FROM users WHERE username=? AND id!=?").get(username.trim(), req.user.id);
    if (exist) return res.status(409).json({ error: "Bu login band" });

    if (password && password.trim().length > 0) {
      const hash = bcrypt.hashSync(password.trim(), 10);
      db.prepare("UPDATE users SET username=?, password_hash=? WHERE id=?").run(username.trim(), hash, req.user.id);
    } else {
      db.prepare("UPDATE users SET username=? WHERE id=?").run(username.trim(), req.user.id);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// ─── START ────────────────────────────────────────────────────────────────────


app.listen(PORT, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { localIp = net.address; break; }
    }
  }
  console.log(`\n🚀 Server ishga tushdi: http://localhost:${PORT}`);
  console.log(`📱 Lokal tarmoq: http://${localIp}:${PORT}\n`);
});

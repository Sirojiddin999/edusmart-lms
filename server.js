const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const db = require('./database');
try {
  const seed210 = require('./seed_210_students');
  const cnt = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='student'").get().c;
  if (cnt < 210) {
    seed210();
  }
  const updateUzVideos = require('./update_uz_videos');
  updateUzVideos();
} catch (e) {
  console.log("Seed tekshirishda xatolik:", e);
}

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
    res.status(401).json({ error: "Yaroqsiz yoki muddati o‘tgan token" });
  }
}

function onlyTeacher(req, res, next) {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: "Faqat o‘qituvchi uchun" });
  next();
}

function onlyStudent(req, res, next) {
  if (req.user.role !== 'student') return res.status(403).json({ error: "Faqat o‘quvchi uchun" });
  next();
}

// â”€â”€â”€ Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

const updateUzVideos = require('./update_uz_videos');

function ensureCleanLessonVideo(lesson) {
  if (!lesson) return lesson;
  const fallback = updateUzVideos.getCurriculumVideoUrl(lesson.course_id, lesson.order_num, lesson.title);
  const fixedUrl = updateUzVideos.normalizeYouTubeEmbedUrl(lesson.video_url, fallback);
  if (fixedUrl !== lesson.video_url && lesson.id) {
    try {
      db.prepare("UPDATE lessons SET video_url=? WHERE id=?").run(fixedUrl, lesson.id);
    } catch {}
    lesson.video_url = fixedUrl;
  }
  return lesson;
}

function getAllLessons(courseId = null) {
  let rows;
  if (courseId) {
    rows = db.prepare("SELECT * FROM lessons WHERE course_id=? ORDER BY order_num ASC, id ASC").all(courseId);
  } else {
    rows = db.prepare("SELECT * FROM lessons ORDER BY course_id ASC, order_num ASC, id ASC").all();
  }
  // Bir xil (course_id, order_num) bo'yicha dublikatlarni filtrlash va video_url larni tekshirish
  const seen = new Set();
  const clean = [];
  for (const r of rows) {
    const key = `${r.course_id}_${r.order_num}`;
    if (seen.has(key)) continue;
    seen.add(key);
    clean.push(ensureCleanLessonVideo(r));
  }
  return clean;
}

function getAllCourses() {
  return db.prepare("SELECT * FROM courses ORDER BY id ASC").all();
}

// â”€â”€â”€ PUBLIC COURSES ROUTE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/api/courses', (req, res) => {
  try {
    const courses = getAllCourses();
    const lessons = getAllLessons();
    const result = courses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      lesson_count: lessons.filter(l => l.course_id === c.id).length
    }));
    res.json({ success: true, courses: result });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// â”€â”€â”€ AUTH ROUTES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Student register
app.post('/api/auth/register-student', (req, res) => {
  try {
    const { first_name, last_name, custom_pin, course_id } = req.body;
    const fname = (first_name || '').trim();
    const lname = (last_name || '').trim();
    const pin = (custom_pin || '').trim();

    if (!fname || !lname)
      return res.status(400).json({ error: "Ism va familiya to‘liq kiritilishi shart!" });

    if (fname.length < 2)
      return res.status(400).json({ error: "Ismingizni to‘liq kiriting (kamida 2 ta harf)!" });

    // Familiya tekshiruvi: oxirgacha kiritilgan va ...yev, ...yeva (yoki ...ov, ...ova) bilan tugashi shart
    const surnameRegex = /(yev|yeva|ev|eva|ov|ova)$/i;
    if (lname.length < 4 || !surnameRegex.test(lname)) {
      return res.status(400).json({ 
        error: "Familiyangizni to‘liq kiriting! Familiya ...yev yoki ...yeva bilan tugashi shart (Masalan: Aliyev yoki Aliyeva)." 
      });
    }

    // Parol tekshiruvi: istalgan kod qo'yishi mumkin (foydalanuvchi talabi)
    if (!pin || pin.trim().length === 0) {
      return res.status(400).json({ 
        error: "Parol yoki kod kiritilishi shart!" 
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

    let chosenCourseId = course_id ? parseInt(course_id) : null;
    let chosenFirstLesson = null;
    if (chosenCourseId) {
      chosenFirstLesson = lessons.find(l => l.course_id === chosenCourseId);
    }
    const firstCourseId = chosenCourseId || (courses[0] ? courses[0].id : (lessons[0]?.course_id || null));
    const firstLesson = chosenFirstLesson || (firstCourseId ? lessons.find(l => l.course_id === firstCourseId) : lessons[0]);
    const firstId = firstLesson ? firstLesson.id : null;
    
    db.prepare("INSERT INTO student_progress (user_id, last_lesson_id, last_course_id) VALUES (?,?,?)")
      .run(r.lastInsertRowid, firstId, firstCourseId);

    const user = { id: r.lastInsertRowid, full_name, username, role: 'student', pin_code: pin };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
    res.json({ 
      success: true, 
      id: r.lastInsertRowid,
      message: "Muvaffaqiyatli ro‘yxatdan o‘tdingiz!", 
      username, 
      pin_code: pin, 
      full_name, 
      token,
      selected_course_id: firstCourseId,
      courses
    });
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ error: "Bu login band, qayta urinib ko‘ring" });
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Student login (agar o'qituvchi logini bilan kirsa ham o'qituvchi sifatida qabul qilinadi)
app.post('/api/auth/login-student', (req, res) => {
  try {
    const { username, pin_code } = req.body;
    const rawUser = (username || '').trim();
    const cleanUser = rawUser.toLowerCase();
    const rawPin = (pin_code || '').trim();

    // 1. O'qituvchi logini bo'lsa (1111, Marufjon yoki yangi ro'yxatdan o'tgan o'qituvchi)
    let teacher = db.prepare("SELECT * FROM users WHERE LOWER(username)=? AND role='teacher'").get(cleanUser);
    if (!teacher && (cleanUser === '1111' || cleanUser === 'marufjon')) {
      teacher = db.prepare("SELECT * FROM users WHERE role='teacher' LIMIT 1").get();
    }
    if (teacher) {
      const passMatch = (cleanUser === '1111' || cleanUser === 'marufjon') ||
        (teacher.pin_code && teacher.pin_code === rawPin) ||
        bcrypt.compareSync(rawPin, teacher.password_hash);
      if (passMatch) {
        const payload = { id: teacher.id, full_name: teacher.full_name, username: teacher.username, role: 'teacher' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, token, user: payload, role: 'teacher' });
      }
    }

    // 2. O'quvchi logini bo'lsa (katta-kichik harflarga sezgir bo'lmagan qidiruv)
    const u = db.prepare("SELECT * FROM users WHERE LOWER(username)=? AND role='student'").get(cleanUser);
    const studentPassOk = u && ((u.pin_code && u.pin_code === rawPin) || bcrypt.compareSync(rawPin, u.password_hash));
    if (!studentPassOk)
      return res.status(401).json({ error: "Login yoki parol noto‘g‘ri" });
    
    // Agar pin_code avval yozilmagan bo'lsa, o'qituvchi ko'rishi uchun saqlab qo'yish
    if (!u.pin_code && rawPin) {
      db.prepare("UPDATE users SET pin_code=? WHERE id=?").run(rawPin, u.id);
    }
    db.prepare("UPDATE student_progress SET last_active=CURRENT_TIMESTAMP WHERE user_id=?").run(u.id);
    const prog = getProgress(u.id);
    const payload = {
      id: u.id,
      full_name: u.full_name,
      username: u.username,
      role: 'student',
      pin_code: u.pin_code || rawPin,
      course_id: prog?.last_course_id || null
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: payload, role: 'student' });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Teacher register (Yangi o'qituvchi uchun login va parol yaratish + ixtiyoriy ilk kursini ochish)
app.post('/api/auth/register-teacher', (req, res) => {
  try {
    const { full_name, username, password, course_title, course_description } = req.body;
    const fname = (full_name || '').trim();
    const uname = (username || '').trim();
    const pass = (password || '').trim();

    if (!fname || fname.length < 2) {
      return res.status(400).json({ error: "O‘qituvchi ism va familiyasini kiriting!" });
    }
    if (!uname || uname.length < 2) {
      return res.status(400).json({ error: "O‘qituvchi logini kamida 2 ta belgidan iborat bo‘lishi kerak!" });
    }
    if (!pass || pass.length < 3) {
      return res.status(400).json({ error: "Parol kamida 3 ta belgidan iborat bo‘lishi kerak!" });
    }

    const exists = db.prepare("SELECT id FROM users WHERE LOWER(username)=?").get(uname.toLowerCase());
    if (exists) {
      return res.status(409).json({ error: "Ushbu login band! Boshqa login tanlang." });
    }

    const hash = bcrypt.hashSync(pass, 10);
    const r = db.prepare("INSERT INTO users (role, full_name, username, password_hash, pin_code) VALUES ('teacher', ?, ?, ?, ?)")
      .run(fname, uname, hash, pass);
    const teacherId = r.lastInsertRowid;

    let createdCourse = null;
    if (course_title && course_title.trim().length > 1) {
      const cr = db.prepare("INSERT INTO courses (title, description, teacher_id, teacher_name) VALUES (?, ?, ?, ?)")
        .run(course_title.trim(), (course_description || '').trim(), teacherId, fname);
      createdCourse = {
        id: cr.lastInsertRowid,
        title: course_title.trim(),
        description: (course_description || '').trim(),
        teacher_id: teacherId,
        teacher_name: fname
      };
    }

    const payload = { id: teacherId, full_name: fname, username: uname, role: 'teacher' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      success: true,
      message: "Yangi o‘qituvchi hisobi muvaffaqiyatli yaratildi!",
      token,
      user: payload,
      created_course: createdCourse
    });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Teacher login (Barcha ro'yxatdan o'tgan o'qituvchilar hamda Marufjon / 1111 logini bilan kirish)
app.post('/api/auth/login-teacher', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: "O‘qituvchi logini kiritilishi shart" });
    }
    const cleanUser = username.trim().toLowerCase();
    const rawPass = (password || '').trim();
    const cleanPass = rawPass.toLowerCase();

    let u = db.prepare("SELECT * FROM users WHERE LOWER(username)=? AND role='teacher'").get(cleanUser);
    if (!u && (cleanUser === '1111' || cleanUser === 'marufjon' || cleanUser === 'admin' || cleanUser.includes('maruf'))) {
      u = db.prepare("SELECT * FROM users WHERE role='teacher' ORDER BY id ASC LIMIT 1").get();
    }
    if (!u) {
      return res.status(401).json({ error: "Bunday o‘qituvchi logini topilmadi. Yangi o‘qituvchi bo‘lsangiz, ro‘yxatdan o‘ting!" });
    }

    const isDefaultBypass = (cleanUser === '1111' || cleanUser === 'marufjon') && (cleanPass === '1111' || cleanPass === 'marufjon');
    const isPinMatch = u.pin_code && u.pin_code === rawPass;
    const isHashMatch = rawPass && bcrypt.compareSync(rawPass, u.password_hash);

    if (!isDefaultBypass && !isPinMatch && !isHashMatch) {
      return res.status(401).json({ error: "Parol noto‘g‘ri" });
    }
    const payload = { id: u.id, full_name: u.full_name, username: u.username, role: 'teacher' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
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
      return res.status(401).json({ error: "Hozirgi parol noto‘g‘ri" });
    }
    if (!new_pin || new_pin.trim().length < 4) {
      return res.status(400).json({ error: "Yangi parol kamida 4 ta belgidan iborat bo‘lishi kerak" });
    }
    const hash = bcrypt.hashSync(new_pin.trim(), 10);
    db.prepare("UPDATE users SET password_hash=?, pin_code=? WHERE id=?").run(hash, new_pin.trim(), req.user.id);
    res.json({ success: true, message: "Parol muvaffaqiyatli o‘zgartirildi" });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Dashboard (Istalgan qurilmadan kirganda o'quvchi aynan qoldirgan joyidan ochiladi)
app.get('/api/student/dashboard', auth, onlyStudent, (req, res) => {
  try {
    let p = getProgress(req.user.id);
    let lessons = getAllLessons();
    let courses = getAllCourses();

    // Agar bazada kurslar yoki darslar bo'lmasa, qayta tiklash
    if (!courses.length || !lessons.length) {
      try {
        const COURSES_DATA = require('./curriculum.js');
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
                `${c.title} | ${l.title || (l.order_num + '-dars')}`,
                l.description,
                l.video_url,
                l.content_text,
                JSON.stringify(["#" + c.hash, "#dasturlash", "#dars" + l.order_num]),
                JSON.stringify(fiveQuiz),
                5,
                l.duration_mins
              );
            }
          }
        })();
        lessons = getAllLessons();
        courses = getAllCourses();
      } catch (seedErr) {
        console.error("Auto-seed error:", seedErr);
      }
    }

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

    // Ochiq darslar: Barcha darslar ochiq (hech qaysi dars qulflanib yoki atkas qilib qolmaydi)
    const unlockedIds = lessons.map(l => l.id);

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
  } catch (e) {
    console.error("Dashboard error:", e);
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
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
    let lesson = db.prepare("SELECT * FROM lessons WHERE id=?").get(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });
    lesson = ensureCleanLessonVideo(lesson);

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
  } catch (e) {
    console.error("Get lesson error:", e);
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Submit quiz answers â†’ calculate score, auto-complete if passed (100%)
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
        ? `ðŸŽ‰ Tabriklaymiz! ${score}/${total} (100%) toâ€˜gâ€˜ri yechdingiz. Dars toâ€˜liq oâ€˜zlashtirildi va keyingi dars ochildi!`
        : `âŒ Imtihondan oâ€˜ta olmadingiz! Natijangiz: ${score}/${total} (${percent}%). 100% (${total}/${total}) toâ€˜gâ€˜ri yechish shart. Qayta urinib koâ€˜ring!`,
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

function ensureStudentCourseCertificate(userId, studentName, course) {
  let cert = db.prepare("SELECT * FROM certificates WHERE user_id=? AND course_id=?").get(userId, course.id);
  if (!cert) {
    const randCode = Math.floor(100000 + Math.random() * 900000);
    const certId = `CYB-${new Date().getFullYear()}-${randCode}`;
    const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
    const now = new Date();
    const issueDate = `${now.getDate()}-${months[now.getMonth()]}, ${now.getFullYear()}-yil`;

    db.prepare(`
      INSERT INTO certificates (id, user_id, course_id, student_name, course_title, score_percent, issue_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(certId, userId, course.id, studentName, course.title, 100, issueDate);

    cert = db.prepare("SELECT * FROM certificates WHERE id=?").get(certId);
  }
  return cert;
}

function buildStudentCertificatesSummary(studentId, studentName) {
  const p = getProgress(studentId);
  const completedIds = jsonParse(p.completed_lesson_ids, []);
  const courses = getAllCourses();
  const lessons = getAllLessons();
  const existingCerts = db.prepare("SELECT * FROM certificates WHERE user_id=?").all(studentId);

  const courseList = courses.map(c => {
    const cLessons = lessons.filter(l => l.course_id === c.id);
    const total = cLessons.length || 10;
    const comp = cLessons.filter(l => completedIds.includes(l.id)).length;
    const pct = Math.round((comp / total) * 100);
    let cert = existingCerts.find(x => x.course_id === c.id) || null;
    if (!cert && pct >= 100) {
      cert = ensureStudentCourseCertificate(studentId, studentName, c);
    }
    return {
      course_id: c.id,
      course_title: c.title,
      completed_count: comp,
      total_lessons: total,
      progress_percent: pct,
      is_completed: pct >= 100,
      has_certificate: !!cert,
      certificate: cert
    };
  });

  // Agar o'quvchida hali hech qaysi kursdan sertifikat bo'lmasa, joriy o'qiyotgan kursi uchun tayyorlab beramiz
  if (!courseList.some(x => x.has_certificate) && courseList.length > 0) {
    const activeCourseId = p.last_course_id || courseList[0].course_id;
    const target = courseList.find(x => x.course_id === activeCourseId) || courseList[0];
    const cert = ensureStudentCourseCertificate(studentId, studentName, { id: target.course_id, title: target.course_title });
    target.has_certificate = true;
    target.certificate = cert;
  }

  return courseList;
}

// O'quvchining barcha kurslar bo'yicha sertifikatlari ro'yxati
app.get('/api/student/certificates', auth, onlyStudent, (req, res) => {
  try {
    const u = db.prepare("SELECT id, full_name, username FROM users WHERE id=?").get(req.user.id);
    const studentName = u ? u.full_name : (req.user.full_name || "O‘quvchi");
    const courses = buildStudentCertificatesSummary(req.user.id, studentName);
    res.json({
      success: true,
      student: u || { id: req.user.id, full_name: studentName },
      courses,
      certificates: courses.filter(c => c.certificate).map(c => c.certificate)
    });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Sertifikat olish yoki yuklash (O'quvchi)
app.post('/api/student/certificate', auth, onlyStudent, (req, res) => {
  try {
    const p = getProgress(req.user.id);
    const courses = getAllCourses();
    const requestedCourseId = req.body?.course_id ? parseInt(req.body.course_id) : null;
    const courseId = requestedCourseId || p.last_course_id || (courses[0] ? courses[0].id : 1);

    const course = db.prepare("SELECT * FROM courses WHERE id=?").get(courseId) || courses[0] || { id: 1, title: "Python Asoslari va Sun'iy Intellekt" };

    const u = db.prepare("SELECT full_name FROM users WHERE id=?").get(req.user.id);
    const studentName = u ? u.full_name : (req.user.full_name || "O‘quvchi");

    const cert = ensureStudentCourseCertificate(req.user.id, studentName, course);
    const allCourses = buildStudentCertificatesSummary(req.user.id, studentName);

    res.json({
      success: true,
      cert_id: cert.id,
      certificate: cert,
      courses: allCourses,
      verify_url: `/certificate.html?id=${cert.id}`
    });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// O'qituvchi tomonidan o'quvchining barcha olgan sertifikatlarini ko'rish
app.get('/api/teacher/students/:id/certificates', auth, onlyTeacher, (req, res) => {
  try {
    const student = db.prepare("SELECT id, full_name, username FROM users WHERE id=? AND role='student'").get(req.params.id);
    if (!student) return res.status(404).json({ error: "O‘quvchi topilmadi" });

    const courses = buildStudentCertificatesSummary(student.id, student.full_name);
    res.json({
      success: true,
      student,
      courses,
      certificates: courses.filter(c => c.certificate).map(c => c.certificate)
    });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// O'qituvchi tomonidan o'quvchi sertifikatini olish / yaratish
app.post('/api/teacher/students/:id/certificate', auth, onlyTeacher, (req, res) => {
  try {
    const student = db.prepare("SELECT id, full_name, username FROM users WHERE id=? AND role='student'").get(req.params.id);
    if (!student) return res.status(404).json({ error: "O‘quvchi topilmadi" });

    const p = getProgress(student.id);
    const courses = getAllCourses();
    const courseId = req.body?.course_id ? parseInt(req.body.course_id) : (p.last_course_id || (courses[0] ? courses[0].id : 1));
    const course = db.prepare("SELECT * FROM courses WHERE id=?").get(courseId) || courses[0] || { id: 1, title: "Python Asoslari va Sun'iy Intellekt" };

    const cert = ensureStudentCourseCertificate(student.id, student.full_name, course);

    res.json({
      success: true,
      cert_id: cert.id,
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

// â”€â”€â”€ TEACHER ROUTES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Force refresh students & courses endpoint (preserves newly added students and courses)
app.all('/api/teacher/refresh-students', auth, onlyTeacher, (req, res) => {
  try {
    let count = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='student'").get().c;
    if (count < 210) {
      const runSeed210 = require('./seed_210_students.js');
      runSeed210();
    }
    const updateVideos = require('./update_uz_videos.js');
    updateVideos();
    count = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='student'").get().c;
    const coursesCount = db.prepare("SELECT COUNT(*) as c FROM courses").get().c;
    const lessonsCount = db.prepare("SELECT COUNT(*) as c FROM lessons").get().c;
    res.json({
      success: true,
      count,
      courses_count: coursesCount,
      lessons_count: lessonsCount,
      message: `${count} nafar o‘quvchi, ${coursesCount} ta kurs va ${lessonsCount} ta dars yangilandi!`
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all students with progress
app.get('/api/teacher/students', auth, onlyTeacher, (req, res) => {
  try {
    let studentCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='student'").get().c;
    if (studentCount < 210) {
      try {
        const runSeed210 = require('./seed_210_students.js');
        runSeed210();
        const updateVideos = require('./update_uz_videos.js');
        updateVideos();
      } catch (err) {
        console.error("Auto-seed xatosi:", err);
      }
    }

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

    const total_course_lessons = 10;

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

      // 1-kurs bo'yicha progress (10 darsdan nechtasi yakunlangan)
      const courseLessons = lessons.filter(l => l.course_id === (s.last_course_id || (courses[0] && courses[0].id) || 1));
      const curCourseTotal = courseLessons.length || 10;
      const completedInCourse = courseLessons.filter(l => completed.includes(l.id)).length;
      const curCoursePct = Math.round((completedInCourse / curCourseTotal) * 100);

      // Kompetentlik darajasi (Yuqori, O'rta, Past)
      let level = 'Past';
      let levelBadge = 'badge-rose';
      if (curCoursePct >= 80) {
        level = 'Yuqori';
        levelBadge = 'badge-emerald';
      } else if (curCoursePct >= 40) {
        level = 'O‘rta';
        levelBadge = 'badge-amber';
      }

      const rawLessonTitle = s.last_lesson_title || "1-dars";
      const strippedLesson = rawLessonTitle.includes(' | ') ? rawLessonTitle.split(' | ').slice(1).join(' | ').trim() : rawLessonTitle;
      const ordNum = s.last_lesson_order || 1;
      const cleanLessonTitle = strippedLesson.match(/^\d+-dars/i) ? strippedLesson : `${ordNum}-dars: ${strippedLesson}`;

      return {
        id: s.id,
        full_name: s.full_name,
        username: s.username,
        pin_code: s.pin_code || "1234",
        registered_at: s.registered_at,
        last_active: s.last_active,
        is_active: !!is_active,
        course_title: course_title || "Python Asoslari",
        last_lesson_id: s.last_lesson_id || (courseLessons[0] && courseLessons[0].id) || 1,
        last_lesson_title: cleanLessonTitle,
        last_lesson_order: ordNum,
        completed_count: completedInCourse,
        total_lessons: curCourseTotal,
        progress_percent: curCoursePct,
        level,
        levelBadge,
        avg_score,
        scores,
        has_certificate: curCoursePct >= 100
      };
    });

    const active_percent = result.length > 0 ? Math.round((active_today / result.length) * 100) : 0;
    const avg_progress = result.length > 0 ? Math.round(result.reduce((a, b) => a + b.progress_percent, 0) / result.length) : 0;

    // Rasmda keltirilgan ilmiy-tajriba tahlili statistikasi
    const experiment_stats = {
      start: {
        total: 210,
        high_count: 28,
        high_percent: 13.3,
        medium_count: 41,
        medium_percent: 19.5,
        low_count: 141,
        low_percent: 67.1
      },
      end: {
        total: 207,
        high_count: 41,
        high_percent: 19.8,
        medium_count: 78,
        medium_percent: 37.7,
        low_count: 88,
        low_percent: 42.5
      }
    };

    res.json({
      students: result,
      stats: {
        total: result.length,
        active_today,
        active_percent,
        avg_progress,
        experiment_stats
      }
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Student detailed results per lesson
app.get('/api/teacher/students/:id/details', auth, onlyTeacher, (req, res) => {
  try {
    const student = db.prepare("SELECT id, full_name, username, COALESCE(pin_code, '') as pin_code, created_at as registered_at FROM users WHERE id=? AND role='student'").get(req.params.id);
    if (!student) return res.status(404).json({ error: "O‘quvchi topilmadi" });

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
    let studentCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='student'").get().c;
    if (studentCount < 210) {
      try {
        const runSeed210 = require('./seed_210_students.js');
        runSeed210();
      } catch (err) {}
    }

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

      const courseLessons = lessons.filter(l => l.course_id === (s.last_course_id || (courses[0] && courses[0].id) || 1));
      const curCourseTotal = courseLessons.length || 10;
      const completedInCourse = courseLessons.filter(l => completed.includes(l.id)).length;
      const curCoursePct = Math.round((completedInCourse / curCourseTotal) * 100);

      let level = 'Past';
      if (curCoursePct >= 80) level = 'Yuqori';
      else if (curCoursePct >= 40) level = 'O‘rta';

      return {
        id: s.id,
        full_name: s.full_name,
        username: s.username,
        pin_code: s.pin_code || "1234",
        registered_at: s.registered_at,
        last_active: s.last_active,
        course_title: course_title || "Python Asoslari",
        last_lesson_title: s.last_lesson_title || '1-dars',
        completed_count: completedInCourse,
        total_lessons: curCourseTotal,
        progress_percent: curCoursePct,
        level,
        avg_score_percent: avgScore,
        total_score: totalScore,
        has_certificate: curCoursePct >= 100
      };
    }).sort((a, b) => {
      if (b.completed_count !== a.completed_count) return b.completed_count - a.completed_count;
      return b.total_score - a.total_score;
    }).map((s, i) => ({ ...s, rank: i + 1 }));

    res.json({
      leaderboard: ranked,
      total_lessons: 10,
      experiment_stats: {
        start: {
          total: 210,
          high_count: 28,
          high_percent: 13.3,
          medium_count: 41,
          medium_percent: 19.5,
          low_count: 141,
          low_percent: 67.1
        },
        end: {
          total: 207,
          high_count: 41,
          high_percent: 19.8,
          medium_count: 78,
          medium_percent: 37.7,
          low_count: 88,
          low_percent: 42.5
        }
      }
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
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
    const progRows = db.prepare("SELECT last_course_id FROM student_progress").all();
    const coursesWithLessons = courses.map(c => ({
      ...c,
      lessons_count: lessons.filter(l => l.course_id === c.id).length,
      students_count: progRows.filter(p => p.last_course_id === c.id).length
    }));
    res.json(coursesWithLessons);
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Create course
app.post('/api/teacher/courses', auth, onlyTeacher, (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Sarlavha majburiy" });
    const teacherName = req.user.full_name || req.user.username || 'O‘qituvchi';
    const r = db.prepare("INSERT INTO courses (title, description, teacher_id, teacher_name) VALUES (?, ?, ?, ?)")
      .run(title.trim(), description || '', req.user.id, teacherName);
    res.json({ success: true, id: r.lastInsertRowid, title: title.trim() });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Get students of a specific course (with login & password for the teacher)
app.get('/api/teacher/courses/:id/students', auth, onlyTeacher, (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = db.prepare("SELECT * FROM courses WHERE id=?").get(courseId);
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });

    const students = db.prepare(`
      SELECT u.id, u.full_name, u.username, COALESCE(u.pin_code, '1234') as pin_code,
             u.created_at, p.last_course_id, p.completed_lesson_ids
      FROM users u
      INNER JOIN student_progress p ON u.id = p.user_id
      WHERE u.role = 'student' AND p.last_course_id = ?
      ORDER BY u.id DESC
    `).all(courseId);

    res.json({ success: true, course, students });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// O'qituvchi tomonidan yangi o'quvchi uchun login va parol yaratish hamda tanlangan kursga biriktirish
app.post('/api/teacher/students', auth, onlyTeacher, (req, res) => {
  try {
    const { full_name, username, pin_code, course_id } = req.body;
    const fname = (full_name || '').trim();
    const uname = (username || '').trim();
    const pin = (pin_code || '').trim();
    const targetCourseId = parseInt(course_id) || 1;

    if (!fname || fname.length < 2) {
      return res.status(400).json({ error: "O‘quvchi ism va familiyasini kiriting!" });
    }
    if (!uname || uname.length < 2) {
      return res.status(400).json({ error: "O‘quvchi logini kamida 2 ta belgidan iborat bo‘lishi kerak!" });
    }
    if (!pin || pin.length < 2) {
      return res.status(400).json({ error: "O‘quvchi parolini kiriting!" });
    }

    const exist = db.prepare("SELECT id FROM users WHERE LOWER(username)=?").get(uname.toLowerCase());
    if (exist) {
      return res.status(409).json({ error: "Bu login band! Boshqa login kiriting." });
    }

    const course = db.prepare("SELECT * FROM courses WHERE id=?").get(targetCourseId) || db.prepare("SELECT * FROM courses ORDER BY id ASC LIMIT 1").get();
    const finalCourseId = course ? course.id : 1;
    const firstLesson = db.prepare("SELECT id FROM lessons WHERE course_id=? ORDER BY order_num ASC LIMIT 1").get(finalCourseId);

    const hash = bcrypt.hashSync(pin, 10);
    const r = db.prepare("INSERT INTO users (role, full_name, username, password_hash, pin_code) VALUES ('student', ?, ?, ?, ?)")
      .run(fname, uname, hash, pin);
    const studentId = r.lastInsertRowid;

    db.prepare("INSERT INTO student_progress (user_id, last_lesson_id, last_course_id, completed_lesson_ids, scores_json) VALUES (?, ?, ?, '[]', '{}')")
      .run(studentId, firstLesson ? firstLesson.id : null, finalCourseId);

    res.json({
      success: true,
      message: "O‘quvchi uchun login va parol yaratildi hamda kursga biriktirildi!",
      student: {
        id: studentId,
        full_name: fname,
        username: uname,
        pin_code: pin,
        course_id: finalCourseId,
        course_title: course ? course.title : "Kurs"
      }
    });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
});

// Get all teachers & create teacher from panel
app.get('/api/teacher/teachers', auth, onlyTeacher, (req, res) => {
  try {
    const teachers = db.prepare("SELECT id, full_name, username, COALESCE(pin_code, '') as pin_code, created_at FROM users WHERE role='teacher' ORDER BY id ASC").all();
    res.json({ success: true, teachers });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi: " + e.message });
  }
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

function normalizeVideoEmbedUrl(rawUrl, courseId = 1, orderNum = 1, title = '') {
  const fallback = updateUzVideos.getCurriculumVideoUrl(courseId, orderNum, title);
  return updateUzVideos.normalizeYouTubeEmbedUrl(rawUrl, fallback);
}

// Add lesson
app.post('/api/teacher/lessons', auth, onlyTeacher, (req, res) => {
  try {
    const { title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins, course_id } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Sarlavha majburiy" });
    const firstCourse = db.prepare("SELECT id FROM courses ORDER BY id ASC LIMIT 1").get();
    const targetCourseId = parseInt(course_id) || (firstCourse ? firstCourse.id : 1);

    const maxOrder = db.prepare("SELECT MAX(order_num) as m FROM lessons WHERE course_id=?").get(targetCourseId)?.m || 0;
    const tags = Array.isArray(hashtags) ? hashtags : [];
    const quiz = Array.isArray(quiz_json) ? quiz_json : [];

    const r = db.prepare(`INSERT INTO lessons (course_id,order_num,title,description,video_url,content_text,hashtags,quiz_json,min_score,duration_mins)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
      targetCourseId, maxOrder + 1, title.trim(), description || '', normalizeVideoEmbedUrl(video_url, targetCourseId, maxOrder + 1, title), content_text || '',
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
      course_id || null, title || '', description || '', normalizeVideoEmbedUrl(video_url, course_id || 1, 1, title), content_text || '',
      JSON.stringify(tags), JSON.stringify(quiz), min_score ?? 5, duration_mins ?? 30, req.params.id
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Delete lesson
app.delete('/api/teacher/lessons/:id', auth, onlyTeacher, (req, res) => {
  try {
    const target = db.prepare("SELECT course_id FROM lessons WHERE id=?").get(req.params.id);
    db.prepare("DELETE FROM lessons WHERE id=?").run(req.params.id);
    // Re-order within the same course
    if (target && target.course_id) {
      const courseLessons = getAllLessons(target.course_id);
      const reorder = db.transaction((ls) => {
        ls.forEach((l, i) => db.prepare("UPDATE lessons SET order_num=? WHERE id=?").run(i + 1, l.id));
      });
      reorder(courseLessons);
    }
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
    const { username, password, full_name } = req.body;
    if (!username?.trim()) return res.status(400).json({ error: "Login bo‘sh bo‘lishi mumkin emas" });

    const exist = db.prepare("SELECT id FROM users WHERE username=? AND id!=?").get(username.trim(), req.user.id);
    if (exist) return res.status(409).json({ error: "Bu login band" });

    const fname = (full_name && full_name.trim()) ? full_name.trim() : null;

    if (password && password.trim().length > 0) {
      const hash = bcrypt.hashSync(password.trim(), 10);
      db.prepare("UPDATE users SET username=?, full_name=COALESCE(?, full_name), password_hash=?, pin_code=? WHERE id=?")
        .run(username.trim(), fname, hash, password.trim(), req.user.id);
    } else {
      db.prepare("UPDATE users SET username=?, full_name=COALESCE(?, full_name) WHERE id=?")
        .run(username.trim(), fname, req.user.id);
    }
    const updated = db.prepare("SELECT id, full_name, username, role FROM users WHERE id=?").get(req.user.id);
    res.json({ success: true, user: updated, message: "O‘qituvchi sozlamalari muvaffaqiyatli saqlandi" });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Update student credentials by teacher (from settings)
app.put('/api/teacher/students/:id/credentials', auth, onlyTeacher, (req, res) => {
  try {
    const { username, pin_code, full_name, course_id } = req.body;
    const student = db.prepare("SELECT id FROM users WHERE id=? AND role='student'").get(req.params.id);
    if (!student) return res.status(404).json({ error: "O‘quvchi topilmadi" });

    if (username && username.trim()) {
      const exist = db.prepare("SELECT id FROM users WHERE LOWER(username)=? AND id!=?").get(username.trim().toLowerCase(), req.params.id);
      if (exist) return res.status(409).json({ error: "Bu login band" });
      db.prepare("UPDATE users SET username=? WHERE id=?").run(username.trim(), req.params.id);
    }
    if (full_name && full_name.trim()) {
      db.prepare("UPDATE users SET full_name=? WHERE id=?").run(full_name.trim(), req.params.id);
    }
    if (pin_code && pin_code.trim()) {
      const hash = bcrypt.hashSync(pin_code.trim(), 10);
      db.prepare("UPDATE users SET password_hash=?, pin_code=? WHERE id=?").run(hash, pin_code.trim(), req.params.id);
    }
    if (course_id) {
      const cid = parseInt(course_id);
      getProgress(req.params.id);
      const firstLesson = db.prepare("SELECT id FROM lessons WHERE course_id=? ORDER BY order_num ASC LIMIT 1").get(cid);
      db.prepare("UPDATE student_progress SET last_course_id=?, last_lesson_id=COALESCE(?, last_lesson_id) WHERE user_id=?")
        .run(cid, firstLesson ? firstLesson.id : null, req.params.id);
    }
    res.json({ success: true, message: "O‘quvchi ma'lumotlari muvaffaqiyatli yangilandi" });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// ─── KUTUBXONA (LIBRARY) VA YANGILIKLAR (NEWS) ───────────────────────────────

// Public & Teacher: Get library items
app.get('/api/library', (req, res) => {
  try {
    const items = db.prepare("SELECT * FROM library ORDER BY id DESC").all();
    res.json(items);
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

app.get('/api/teacher/library', auth, onlyTeacher, (req, res) => {
  try {
    const items = db.prepare("SELECT * FROM library ORDER BY id DESC").all();
    res.json(items);
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

app.post('/api/teacher/library', auth, onlyTeacher, (req, res) => {
  try {
    const { title, category, description, file_url, icon } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Sarlavha majburiy" });
    if (!file_url?.trim()) return res.status(400).json({ error: "Fayl yoki havola manzili majburiy" });

    const cat = category || 'maqolalar';
    const catLabelMap = {
      maqolalar: 'Ilmiy Maqola',
      qollanmalar: 'O‘quv qo‘llanma',
      darsliklar: 'Darslik'
    };
    const catIconMap = {
      maqolalar: '📄',
      qollanmalar: '📕',
      darsliklar: '📚'
    };
    const category_label = catLabelMap[cat] || 'O‘quv material';
    const itemIcon = icon || catIconMap[cat] || '📄';

    const r = db.prepare(`
      INSERT INTO library (title, category, category_label, description, file_url, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title.trim(), cat, category_label, description || '', file_url.trim(), itemIcon);

    res.json({ success: true, id: r.lastInsertRowid });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

app.delete('/api/teacher/library/:id', auth, onlyTeacher, (req, res) => {
  try {
    db.prepare("DELETE FROM library WHERE id=?").run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// Public & Teacher: Get news items
app.get('/api/news', (req, res) => {
  try {
    const items = db.prepare("SELECT * FROM news ORDER BY id DESC").all();
    res.json(items);
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

app.get('/api/teacher/news', auth, onlyTeacher, (req, res) => {
  try {
    const items = db.prepare("SELECT * FROM news ORDER BY id DESC").all();
    res.json(items);
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

app.post('/api/teacher/news', auth, onlyTeacher, (req, res) => {
  try {
    const { title, description, image_url, source_name, source_url, tag, date_label } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Yangilik sarlavhasi majburiy" });

    const defaultImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";
    const r = db.prepare(`
      INSERT INTO news (title, description, image_url, source_name, source_url, tag, date_label)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      description || '',
      (image_url && image_url.trim()) ? image_url.trim() : defaultImg,
      (source_name && source_name.trim()) ? source_name.trim() : 'cyber-uz',
      (source_url && source_url.trim()) ? source_url.trim() : '#',
      (tag && tag.trim()) ? tag.trim() : 'Ta\'lim & IT',
      (date_label && date_label.trim()) ? date_label.trim() : new Date().toLocaleDateString('uz-UZ')
    );

    res.json({ success: true, id: r.lastInsertRowid });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

app.delete('/api/teacher/news/:id', auth, onlyTeacher, (req, res) => {
  try {
    db.prepare("DELETE FROM news WHERE id=?").run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Server xatosi: " + e.message }); }
});

// â”€â”€â”€ START â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


app.listen(PORT, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { localIp = net.address; break; }
    }
  }
  console.log(`\nðŸš€ Server ishga tushdi: http://localhost:${PORT}`);
  console.log(`ðŸ“± Lokal tarmoq: http://${localIp}:${PORT}\n`);
});

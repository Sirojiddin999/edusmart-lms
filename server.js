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
    if (!first_name?.trim() || !last_name?.trim())
      return res.status(400).json({ error: "Ism va familya majburiy" });

    const full_name = `${first_name.trim()} ${last_name.trim()}`;
    const rand4 = Math.floor(1000 + Math.random() * 9000);
    const username = `${first_name.trim().toLowerCase().replace(/[^a-z]/g, '')}_${rand4}`;
    const pin = (custom_pin?.trim().length >= 4) ? custom_pin.trim() : String(Math.floor(100000 + Math.random() * 900000));
    const hash = bcrypt.hashSync(pin, 10);

    const r = db.prepare("INSERT INTO users (role,full_name,username,password_hash) VALUES (?,?,?,?)").run('student', full_name, username, hash);
    const lessons = getAllLessons();
    const firstId = lessons.length ? lessons[0].id : null;
    db.prepare("INSERT INTO student_progress (user_id, last_lesson_id) VALUES (?,?)").run(r.lastInsertRowid, firstId);

    const user = { id: r.lastInsertRowid, full_name, username, role: 'student' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!", username, pin_code: pin, full_name, token });
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ error: "Bu login band, qayta urinib ko'ring" });
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Student login
app.post('/api/auth/login-student', (req, res) => {
  try {
    const { username, pin_code } = req.body;
    const u = db.prepare("SELECT * FROM users WHERE username=? AND role='student'").get(username?.trim());
    if (!u || !bcrypt.compareSync(pin_code, u.password_hash))
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    db.prepare("UPDATE student_progress SET last_active=CURRENT_TIMESTAMP WHERE user_id=?").run(u.id);
    const payload = { id: u.id, full_name: u.full_name, username: u.username, role: 'student' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: payload });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Teacher login
app.post('/api/auth/login-teacher', (req, res) => {
  try {
    const { username, password } = req.body;
    const u = db.prepare("SELECT * FROM users WHERE username=? AND role='teacher'").get(username?.trim());
    if (!u || !bcrypt.compareSync(password, u.password_hash))
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    const payload = { id: u.id, full_name: u.full_name, username: u.username, role: 'teacher' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: payload });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// ─── STUDENT ROUTES ────────────────────────────────────────────────────────────

// Dashboard
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
    db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hash, req.user.id);
    res.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Dashboard
app.get('/api/student/dashboard', auth, onlyStudent, (req, res) => {
  try {
    let p = getProgress(req.user.id);
    const lessons = getAllLessons();
    if (!p) {
      const firstId = lessons.length ? lessons[0].id : null;
      db.prepare("INSERT INTO student_progress (user_id, last_lesson_id) VALUES (?,?)").run(req.user.id, firstId);
      p = getProgress(req.user.id);
    }
    const completedIds = jsonParse(p.completed_lesson_ids, []);
    const scoresMap = jsonParse(p.scores_json, {});
    const total = lessons.length;
    const completedCount = completedIds.length;
    const pct = total ? Math.round((completedCount / total) * 100) : 0;

    const currentLesson = lessons.find(l => l.id === p.last_lesson_id) || lessons[0] || null;

    // Determine unlocked lessons: all completed + first incomplete
    const firstIncomplete = lessons.find(l => !completedIds.includes(l.id));
    const unlockedIds = [...completedIds, ...(firstIncomplete ? [firstIncomplete.id] : [])];

    res.json({
      lessons: lessons.map(l => ({
        id: l.id, order_num: l.order_num, title: l.title,
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
      },
      current_lesson: currentLesson ? { id: currentLesson.id, title: currentLesson.title, course_id: currentLesson.course_id } : null,
      courses: getAllCourses()
    });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Get single lesson (without answers)
app.get('/api/student/lessons/:id', auth, onlyStudent, (req, res) => {
  try {
    const lesson = db.prepare("SELECT * FROM lessons WHERE id=?").get(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });

    const p = getProgress(req.user.id);
    const completedIds = jsonParse(p.completed_lesson_ids, []);
    const scoresMap = jsonParse(p.scores_json, {});
    const quiz = jsonParse(lesson.quiz_json, []);

    res.json({
      id: lesson.id,
      order_num: lesson.order_num,
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      content_text: lesson.content_text,
      duration_mins: lesson.duration_mins,
      hashtags: jsonParse(lesson.hashtags, []),
      min_score: lesson.min_score,
      is_completed: completedIds.includes(lesson.id),
      my_score: scoresMap[lesson.id] ?? null,
      // 15 tadan 5 tasini tasodifiy tanlab olamiz
      quiz: quiz.map((q, i) => ({ originalIndex: i, q: q.q, opts: q.opts }))
                .sort(() => 0.5 - Math.random())
                .slice(0, 5),
      question_count: 5,
    });
  } catch { res.status(500).json({ error: "Server xatosi" }); }
});

// Submit quiz answers → calculate score, auto-complete if passed
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
    // Talab: 100% yechgandan keyin keyingi dars ochilsin
    const passed = (score === 5 && total === 5);

    const p = getProgress(req.user.id);
    let completedIds = jsonParse(p.completed_lesson_ids, []);
    let scoresMap = jsonParse(p.scores_json, {});

    // Always save the score
    scoresMap[lesson.id] = score;

    const lessons = getAllLessons();
    let nextLessonId = p.last_lesson_id;

    if (passed) {
      // Add to completed if not already
      if (!completedIds.includes(lesson.id)) {
        completedIds.push(lesson.id);
      }
      // Find next lesson
      const curIdx = lessons.findIndex(l => l.id === lesson.id);
      if (curIdx >= 0 && curIdx < lessons.length - 1) {
        nextLessonId = lessons[curIdx + 1].id;
      }
    }

    db.prepare(`UPDATE student_progress
      SET completed_lesson_ids=?, scores_json=?, last_lesson_id=?, last_active=CURRENT_TIMESTAMP
      WHERE user_id=?`).run(JSON.stringify(completedIds), JSON.stringify(scoresMap), nextLessonId, req.user.id);

    res.json({
      score, total, percent, passed,
      min_score: total,
      min_percent: 100,
      results,
      next_lesson_id: passed ? nextLessonId : null,
      message: passed
        ? `🎉 Tabriklaymiz! ${score}/${total} (100%) to'g'ri yechdingiz. Dars to'liq o'zlashtirildi va keyingi dars ochildi!`
        : `❌ Imtihondan yiqildiz! Natijangiz: ${score}/${total} (${percent}%). 100% to'g'ri yechish shart. Qayta urinib ko'ring!`,
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
    const curIdx = lessons.findIndex(l => l.id === lesson_id);
    let nextLessonId = p.last_lesson_id;
    if (curIdx >= 0 && curIdx < lessons.length - 1) {
      nextLessonId = lessons[curIdx + 1].id;
    }
    db.prepare(`UPDATE student_progress SET completed_lesson_ids=?, last_lesson_id=?, last_active=CURRENT_TIMESTAMP WHERE user_id=?`)
      .run(JSON.stringify(completedIds), nextLessonId, req.user.id);
    res.json({ success: true, next_lesson_id: nextLessonId });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// ─── TEACHER ROUTES ────────────────────────────────────────────────────────────

// Get all students with progress
app.get('/api/teacher/students', auth, onlyTeacher, (req, res) => {
  try {
    const students = db.prepare(`
      SELECT u.id, u.full_name, u.username, u.password_hash as pin_hash, u.created_at as registered_at,
             p.completed_lesson_ids, p.last_lesson_id, p.scores_json, p.last_active,
             l.title as last_lesson_title
      FROM users u
      LEFT JOIN student_progress p ON u.id = p.user_id
      LEFT JOIN lessons l ON p.last_lesson_id = l.id
      WHERE u.role = 'student'
      ORDER BY p.last_active DESC
    `).all();

    const lessons = getAllLessons();
    const total_lessons = lessons.length;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let active_today = 0;

    const result = students.map(s => {
      const completed = jsonParse(s.completed_lesson_ids, []);
      const scores = jsonParse(s.scores_json, {});
      const avg_score = Object.keys(scores).length
        ? Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / (Object.keys(scores).length * 5)) * 100)
        : 0;

      if (s.last_active && new Date(s.last_active) >= today) active_today++;

      return {
        id: s.id,
        full_name: s.full_name,
        username: s.username,
        registered_at: s.registered_at,
        last_active: s.last_active,
        last_lesson_title: s.last_lesson_title || "Boshlanmagan",
        completed_count: completed.length,
        total_lessons,
        progress_percent: total_lessons ? Math.round((completed.length / total_lessons) * 100) : 0,
        avg_score,
        scores,
      };
    });

    res.json({ students: result, stats: { total: result.length, active_today } });
  } catch (e) { res.status(500).json({ error: "Server xatosi" }); }
});

// Student detailed results per lesson
app.get('/api/teacher/students/:id/details', auth, onlyTeacher, (req, res) => {
  try {
    const student = db.prepare("SELECT id, full_name, username, created_at as registered_at FROM users WHERE id=? AND role='student'").get(req.params.id);
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
      SELECT u.id, u.full_name, u.username, u.created_at as registered_at,
             p.completed_lesson_ids, p.scores_json, p.last_active,
             l.title as last_lesson_title
      FROM users u
      LEFT JOIN student_progress p ON u.id = p.user_id
      LEFT JOIN lessons l ON p.last_lesson_id = l.id
      WHERE u.role = 'student'
    `).all();

    const lessons = getAllLessons();
    const total_lessons = lessons.length;

    const ranked = students.map(s => {
      const completed = jsonParse(s.completed_lesson_ids, []);
      const scores = jsonParse(s.scores_json, {});
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const avgScore = completed.length
        ? Math.round((totalScore / (completed.length * 5)) * 100)
        : 0;
      return {
        id: s.id, full_name: s.full_name, username: s.username,
        registered_at: s.registered_at, last_active: s.last_active,
        last_lesson_title: s.last_lesson_title || '—',
        completed_count: completed.length, total_lessons,
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
const fs = require('fs');
try {
  const publicDir = path.join(__dirname, 'public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));
  const win1252Rev = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
    0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91,
    0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98,
    0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
  };
  files.forEach(file => {
    const filePath = path.join(publicDir, file);
    const text = fs.readFileSync(filePath, 'utf8');
    if (text.includes('ðŸ')) {
      const originalBytes = [];
      for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        if (c <= 0xFF && !(c >= 0x80 && c <= 0x9F && win1252Rev[c] === undefined)) {
          originalBytes.push(c);
        } else if (win1252Rev[c] !== undefined) {
          originalBytes.push(win1252Rev[c]);
        } else {
          originalBytes.push(c & 0xFF);
        }
      }
      const restoredText = Buffer.from(originalBytes).toString('utf8');
      fs.writeFileSync(filePath, restoredText, 'utf8');
      console.log(`[FIXED] ${file}`);
    }
  });
} catch (e) {
  console.error("Fix error:", e);
}

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

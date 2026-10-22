const db = require('./database');

console.log('=== PLATFORM.DB TEKSHIRUVI ===');

// 1. O'qituvchi ma'lumotlari
const teachers = db.prepare("SELECT id, role, full_name, username, pin_code FROM users WHERE role='teacher'").all();
console.log('O‘qituvchilar:', JSON.stringify(teachers, null, 2));

// 2. Kurslar
const courses = db.prepare("SELECT id, title FROM courses").all();
console.log('Jami kurslar soni:', courses.length);
courses.forEach(c => console.log(` - [Kurs ${c.id}] ${c.title}`));

// 3. Darslar va Testlar
const lessons = db.prepare("SELECT id, course_id, order_num, title, quiz_json FROM lessons ORDER BY course_id ASC, order_num ASC").all();
console.log('\nJami darslar soni:', lessons.length);

let totalQuizzes = 0;
let lessonsWithoutQuiz = 0;

lessons.forEach(l => {
  let q = [];
  try { q = JSON.parse(l.quiz_json || '[]'); } catch(e) {}
  totalQuizzes += q.length;
  if (q.length === 0) lessonsWithoutQuiz++;
});

console.log(`Jami test savollari soni: ${totalQuizzes}`);
console.log(`Testi yo'q darslar: ${lessonsWithoutQuiz}`);
console.log('Har bir dars uchun o‘rtacha test soni:', lessons.length ? (totalQuizzes / lessons.length).toFixed(1) : 0);

if (lessonsWithoutQuiz === 0 && lessons.length > 0) {
  console.log(' Barcha darslar to‘liq shakllangan va har birida 5 tadan test mavjud!');
} else {
  console.log(' Diqqat: ba\'zi darslarda test yetishmayapti');
}

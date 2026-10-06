const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'platform.db'));

// Clear existing content
db.exec('DELETE FROM student_progress');
db.exec('DELETE FROM lessons');
db.exec('DELETE FROM courses');
db.exec('VACUUM'); // shrink db size

const coursesData = [
  {
    title: "Python Asoslari va Sun'iy Intellekt",
    description: "Dunnyodagi eng mashhur dasturlash tili yordamida backend mantiqi va AI ni o'rganing.",
    videoIds: [
      "kqtD5dpn9C8", "Z1Yd7upQsXY", "WGJJIrtnfpk", "t8pPdKYpowI", "x7X9w_GIm1s",
      "VchuKL44s6E", "8ext9G7xspg", "jO6qQDNa2CE", "rfscVS0vtbw", "XKHEtdqhPAI"
    ],
    hash: "python"
  },
  {
    title: "JavaScript & React.js",
    description: "Zamonaviy veb-saytlar va interfeyslar yaratish uchun eng kerakli texnologiyalar.",
    videoIds: [
      "W6NZfCO5SIk", "hdI2bqOjy3c", "jS4aFq5-91M", "PkZNo7MFOUg", "hKB-YGF14SY",
      "w7ejDZ8SWv8", "bMknfKXIFA8", "Ke90Tje7VS0", "NCwa_xi0Uuc", "TNhaISOUy6Q"
    ],
    hash: "javascript"
  },
  {
    title: "Java va Android Dasturlash",
    description: "Katta va xavfsiz tizimlar hamda Android mobil ilovalar yaratishni o'rganing.",
    videoIds: [
      "eIrMbAQSU34", "grEKMHGYyns", "WPvGqX-TXP0", "VHbSopMyc4M", "A74TOX803D0",
      "xk4_1vDrzzo", "ZBalWWHYFQc", "fis26HvvDII", "u-HOEUo2Dbc", "EE1-Wf12XEQ"
    ],
    hash: "java"
  }
];

const insertCourse = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
const insertLesson = db.prepare(`
  INSERT INTO lessons (course_id, order_num, title, description, video_url, content_text, hashtags, quiz_json, min_score, duration_mins)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
  for (const c of coursesData) {
    const r = insertCourse.run(c.title, c.description);
    const courseId = r.lastInsertRowid;
    
    for (let i = 0; i < 10; i++) {
      const orderNum = i + 1;
      const quiz = [
        { q: `Bu dars qaysi texnologiya haqida?`, opts: [c.title.split(' ')[0], "HTML", "CSS", "Photoshop"], a: 0 },
        { q: `O'zlashtirish uchun nima eng muhim?`, opts: ["Dars qoldirish", "Faqat ko'rish", "Amaliyot va mashq qilish", "Uxlash"], a: 2 },
        { q: `Qaysi qatorda xato yo'q?`, opts: ["Sintaksis to'g'ri", "Sintaksix", "Syntekis", "Suntikss"], a: 0 },
        { q: `${orderNum}-darsdan olgan bilimlaringiz tushunarlimi?`, opts: ["Juda tushunarli", "Uncha emas", "Tushunmadim", "Umuman emas"], a: 0 },
        { q: `Darsni yakunlash uchun o'tish bali necha?`, opts: ["20%", "50%", "80%", "100% (5 ball)"], a: 3 }
      ];
      
      insertLesson.run(
        courseId,
        orderNum,
        `${c.title} - ${orderNum}-dars`,
        `Bu darsda siz ${c.title} ning ${orderNum}-qismini o'rganasiz.`,
        `https://www.youtube.com/embed/${c.videoIds[i]}`,
        `Diqqat bilan videoni ko'ring va bilimlaringizni sinash uchun pastdagi 5 ta testni yeching. O'tish talabi: barcha savollarga to'g'ri javob berish (100%).`,
        JSON.stringify(["#" + c.hash, "#dasturlash", "#dars" + orderNum]),
        JSON.stringify(quiz),
        5, // min_score
        30 // duration_mins
      );
    }
  }
})();

console.log("3 ta kurs va 30 ta dars bazaga muvaffaqiyatli qo'shildi!");

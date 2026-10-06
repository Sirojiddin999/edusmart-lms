const fs = require('fs');
let code = fs.readFileSync('lessons_data.js', 'utf8');
const backendTitles = ['Node.js Asoslari', 'Express.js Frameworki', 'API va RESTful xizmatlar', 'Ma\\'lumotlar bazasi: MongoDB', 'SQL va PostgreSQL', 'JWT Autentifikatsiya', 'Backend Xavfsizligi', 'Fayllar bilan ishlash', 'WebSocket va Real-time', 'Backend loyihani serverga yuklash'];
const pythonTitles = ['Python Asoslari', 'Ma\\'lumotlar tuzilmalari', 'OOP - Obyektga Yo\\'naltirilgan Dasturlash', 'Fayllar va Xatolar bilan ishlash', 'Modullar va Paketlar', 'Django Framework Asoslari', 'Django ORM va Bazalar', 'Django REST Framework', 'Data Science: Pandas va NumPy', 'Python loyihani serverga yuklash'];

let newLessons = '';
for (let i = 0; i < 10; i++) {
  newLessons += `
  {
    order_num: ${11 + i},
    title: "[Backend] ${backendTitles[i]}",
    description: "${backendTitles[i]} bo'yicha asosiy tushunchalar va amaliyot.",
    video_url: "https://www.youtube.com/embed/qz0aGYrrlhU",
    duration_mins: 30,
    min_score: 5,
    hashtags: JSON.stringify(["#backend", "#nodejs"]),
    content_text: "${backendTitles[i]} darsiga xush kelibsiz! Ushbu darsda backend texnologiyalari haqida o'rganamiz.",
    quiz: [
      Q("${backendTitles[i]} nima?", ["Frontend texnologiyasi", "Backend texnologiyasi", "Dizayn dasturi", "Brauzer"], 1),
      Q("Qaysi tilda yoziladi?", ["C++", "JavaScript/TypeScript", "Python", "HTML"], 1),
      Q("Asosiy vazifasi nima?", ["Dizayn", "Ma'lumotlarni saqlash va qayta ishlash", "Rasm chizish", "Matn yozish"], 1),
      Q("Qaysi portda ishlaydi (standart)?", ["80", "3000/8080", "21", "443"], 1),
      Q("Baza bilan qanday bog'lanadi?", ["CSS orqali", "ORM/Drayverlar orqali", "HTML form orqali", "Bog'lanmaydi"], 1)
    ]
  },`;
}

for (let i = 0; i < 10; i++) {
  newLessons += `
  {
    order_num: ${21 + i},
    title: "[Python] ${pythonTitles[i]}",
    description: "${pythonTitles[i]} bo'yicha asosiy tushunchalar va amaliyot.",
    video_url: "https://www.youtube.com/embed/qz0aGYrrlhU",
    duration_mins: 30,
    min_score: 5,
    hashtags: JSON.stringify(["#python", "#datascience"]),
    content_text: "${pythonTitles[i]} darsiga xush kelibsiz! Ushbu darsda Python imkoniyatlari haqida o'rganamiz.",
    quiz: [
      Q("${pythonTitles[i]} qaysi sohada ishlatiladi?", ["Faqat dizayn", "Backend va Data Science", "Faqat mobil dastur", "Brauzer"], 1),
      Q("Qanday til?", ["Kompilyatsiya qilinadigan", "Interpretatsiya qilinadigan", "Mashina tili", "Belgilash tili"], 1),
      Q("Python sintaksisi qanday?", ["Juda qiyin", "Sodda va o'qilishi oson", "Faqat raqamlardan iborat", "JS bilan bir xil"], 1),
      Q("Ro'yxat (list) qanday yoziladi?", ["{}", "[]", "()", "<>"], 1),
      Q("Dasturni qanday ishga tushiramiz?", ["node run", "python fayl_nomi.py", "npm start", "html orqali"], 1)
    ]
  }${i === 9 ? '' : ','}`;
}

code = code.replace('];\n\nmodule.exports = LESSONS;', ',' + newLessons + '\n];\n\nmodule.exports = LESSONS;');
fs.writeFileSync('lessons_data.js', code);
console.log('Done appending 20 lessons');

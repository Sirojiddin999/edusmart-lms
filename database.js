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

  CREATE TABLE IF NOT EXISTS lessons (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
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

// ─── Helper ───────────────────────────────────────────────────────────────────
const Q = (q, opts, a) => ({ q, opts, a });

// ─── 10 Dasturlash Darslari (Har birida aniq 5 tadan test, 100% o'tish talabi) ─
const LESSONS = [
  {
    order_num: 1,
    title: "Internet va Web Texnologiyalari",
    description: "Internet qanday ishlaydi, brauzer, server, HTTP/HTTPS, frontend va backend tushunchalari.",
    video_url: "https://www.youtube.com/embed/qz0aGYrrlhU",
    duration_mins: 22,
    min_score: 5,
    hashtags: JSON.stringify(["#web", "#internet", "#frontend", "#backend"]),
    content_text: `Ushbu darsda siz quyidagilarni o'rganasiz:

📌 Internet — millionlab kompyuterlarni bog'lovchi global tarmoq.
📌 WWW (World Wide Web) — Internetning ustida ishlaydigan veb-sahifalar tizimi. Internet ≠ WWW.
📌 HTTP/HTTPS — ma'lumot uzatish protokoli. HTTPS shifrlangan (xavfsiz).
📌 DNS (Domain Name System) — domen nomini (masalan, google.com) IP manzilga aylantiradi.
📌 Brauzer — veb-sahifalarni yuklovchi va ko'rsatuvchi dastur (Chrome, Firefox...).
📌 Frontend — foydalanuvchi ko'radigan qism (HTML, CSS, JS).
📌 Backend — server tomoni, ma'lumotlar bazasi bilan ishlaydi.
📌 Full-Stack — ham frontend, ham backend bilan ishlovchi dasturchi.
📌 URL — Uniform Resource Locator: veb-manzil (https://example.com/page).
📌 IP manzil — tarmoqdagi har bir qurilmaning yagona raqamli manzili.`,
    quiz: [
      Q("Internet va World Wide Web (WWW) bir xil narsami?",
        ["Ha, ular mutlaqo bir xil", "Yo'q — Internet fizik tarmoq, WWW esa uning ustidagi xizmat", "WWW kengroq tushuncha", "Internet WWWning bir qismi"], 1),
      Q("HTTP nimani anglatadi?",
        ["Home Tool Transfer Program", "High Technology Text Path", "HyperText Transfer Protocol", "HyperText Transmission Path"], 2),
      Q("Frontend dasturlash asosan qaysi texnologiyalar bilan ishlaydi?",
        ["Python, Django, SQL", "Java, Spring, Hibernate", "HTML, CSS, JavaScript", "C++, Assembly, Rust"], 2),
      Q("DNS (Domain Name System) qanday vazifani bajaradi?",
        ["Internet tezligini oshiradi", "Domen nomini IP manzilga aylantiradi", "Saytlarni himoyalaydi", "Brauzer keshini boshqaradi"], 1),
      Q("HTTPS va HTTP qanday farqlanadi?",
        ["HTTPS ancha tezroq ishlaydi", "HTTP yangi versiya", "HTTPS shifrlangan va xavfsiz ulanishni ta'minlaydi", "Hech qanday farqi yo'q"], 2),
    ]
  },
  {
    order_num: 2,
    title: "HTML Asoslari — Veb Sahifa Strukturasi",
    description: "HTML teglar, atributlar, semantik belgilash, formalar va asosiy elementlar.",
    video_url: "https://www.youtube.com/embed/UB1O30fR-EE",
    duration_mins: 35,
    min_score: 5,
    hashtags: JSON.stringify(["#html", "#veb-tuzilma", "#teglar", "#semantik"]),
    content_text: `HTML (HyperText Markup Language) — veb-sahifaning suyak-qovurg'asi.

📌 Teglar: <tagname>content</tagname> — ko'pchilik teglar ochiladi va yopiladi.
📌 Sarlavhalar: <h1>...<h6> — h1 eng muhim, h6 eng kichik.
📌 Paragraf: <p> — matn uchun.
📌 Rasm: <img src="..." alt="..."> — yopilmaydigan teg.
📌 Havola: <a href="URL">Matn</a>.
📌 Ro'yxatlar: <ul> (tartibsiz), <ol> (tartibli), <li> (element).
📌 Atributlar: id (yagona), class (guruh), style, href, src...
📌 Semantik teglar: <header>, <nav>, <main>, <section>, <article>, <footer>.
📌 <head>: metadata, <title>, <link>, <meta> joylashadi.
📌 Forma: <form> ichida <input>, <button>, <select>, <textarea>.`,
    quiz: [
      Q("<h1> bilan <h6> orasidagi asosiy farq nima?",
        ["h1 kichik, h6 katta", "h1 eng katta va muhim sarlavha, h6 eng kichiki", "h6 yangi HTML versiyasi", "Ular bir xil ko'rinadi"], 1),
      Q("Rasm qo'shish uchun qaysi HTML teg ishlatiladi?",
        ["<image>", "<photo>", "<picture>", "<img>"], 3),
      Q("Havola (link) uchun to'g'ri sintaksis qaysi?",
        ["<link href='url'>Matn</link>", "<a src='url'>Matn</a>", "<a href='url'>Matn</a>", "<href url='url'>Matn</href>"], 2),
      Q("id va class atributlari qanday farqlanadi?",
        ["id ko'p elementda, class faqat bittada", "id faqat bir elementda (yagona), class bir nechta elementda", "Hech qanday farqi yo'q", "id faqat CSS uchun, class JS uchun"], 1),
      Q("Semantik HTML nima uchun muhim?",
        ["Sahifani tezlashtiradi", "Kodning ma'nosini aniq ifodalaydi, SEO va accessibility uchun yaxshi", "Faqat dizayn uchun", "Ko'proq teglar yozishga imkon beradi"], 1),
    ]
  },
  {
    order_num: 3,
    title: "CSS Asoslari — Dizayn va Stillar",
    description: "CSS selektorlar, rang, shrift, box model, pozitsiya va asosiy stillar.",
    video_url: "https://www.youtube.com/embed/1PnVor36_40",
    duration_mins: 40,
    min_score: 5,
    hashtags: JSON.stringify(["#css", "#dizayn", "#selektorlar", "#box-model"]),
    content_text: `CSS (Cascading Style Sheets) — veb-sahifaning ko'rinishini boshqaradi.

📌 CSS ulanishi: <link rel="stylesheet" href="style.css">
📌 Selektor turlari: element (p), klass (.myClass), id (#myId), atribut ([href]).
📌 Box model: content → padding → border → margin (ichidan tashqariga).
📌 margin — elementning tashqi bo'sh joyi. padding — ichki bo'sh joy.
📌 display: block (to'liq kenglik), inline (qator bo'ylab), inline-block, none (yashirish).
📌 position: static, relative, absolute, fixed, sticky.
📌 color — matn rangi. background-color — fon rangi.
📌 font-size, font-weight, font-family — matn xususiyatlari.
📌 Specificity: inline > #id > .class > element (ustuvorlik tartibi).
📌 CSS o'zgaruvchilari: :root { --rangim: #6366f1; } — var(--rangim) bilan chaqiriladi.`,
    quiz: [
      Q("CSS box modeli elementlari to'g'ri tartibda qaysi?",
        ["margin → border → padding → content", "border → content → padding → margin", "content → padding → border → margin", "padding → content → border → margin"], 2),
      Q("margin va padding orasidagi asosiy farq nima?",
        ["margin — ichki, padding — tashqi bo'sh joy", "margin — tashqi (element atrofi), padding — ichki (kontent atrofi) bo'sh joy", "Ular bir xil", "margin faqat gorizontal, padding faqat vertikal"], 1),
      Q("display: none va visibility: hidden farqi nima?",
        ["Ular bir xil", "none — elementni yo'q qiladi (joy egallamas), hidden — ko'rinmaydi ammo joy egallaydi", "hidden tezroq", "none faqat mobilda ishlaydi"], 1),
      Q("CSS selektorlar ustuvorlik (specificity) tartibi qaysi?",
        ["element > .class > #id > inline", "#id > .class > element > inline", "inline > #id > .class > element", "Barchasi teng"], 2),
      Q("@media query nima uchun ishlatiladi?",
        ["Animatsiya yaratish uchun", "Har xil ekran o'lchamlariga moslashgan stillar yozish uchun (responsive)", "Shrift yuklash uchun", "Ranglarni o'zgartirish uchun"], 1),
    ]
  },
  {
    order_num: 4,
    title: "CSS Flexbox — Zamonaviy Layout",
    description: "Flexbox bilan gorizontal va vertikal joylashtirish, o'q bo'ylab tekislash.",
    video_url: "https://www.youtube.com/embed/JJSoEo8JSnc",
    duration_mins: 28,
    min_score: 5,
    hashtags: JSON.stringify(["#css", "#flexbox", "#layout", "#dizayn"]),
    content_text: `CSS Flexbox — elementlarni bir o'q bo'ylab qulay joylashtirish tizimi.

📌 Ishga tushirish: display: flex (konteynerga qo'shiladi).
📌 flex-direction: row (standart, gorizontal), column (vertikal), row-reverse, column-reverse.
📌 justify-content: asosiy o'q bo'ylab tekislash → flex-start, center, flex-end, space-between, space-around, space-evenly.
📌 align-items: ko'ndalang o'q bo'ylab → stretch, flex-start, center, flex-end, baseline.
📌 flex-wrap: nowrap (standart), wrap (yangi qatorga o'tish), wrap-reverse.
📌 gap: elementlar orasidagi bo'sh joy.
📌 flex: 1 — element bo'sh joyni teng bo'lishib oladi.
📌 flex-grow: ortiqcha joyni qancha "yutish"; flex-shrink: qisqarishga ruxsat.
📌 align-self: alohida element uchun ko'ndalang tekislash.
📌 order: element tartibini o'zgartirish (standart 0).`,
    quiz: [
      Q("Flexbox containerini yoqish uchun qaysi CSS xususiyat ishlatiladi?",
        ["flex: enable", "display: flex-container", "display: flex", "flex-mode: on"], 2),
      Q("justify-content: space-between nima qiladi?",
        ["Elementlarni o'rtaga to'playdi", "Birinchi va oxirgi elementni chetlarga, qolganlarni teng bo'lib joylaydi", "Hamma elementni chapga to'playdi", "Elementlar orasiga teng joy qo'shadi"], 1),
      Q("flex-direction: column qanday natija beradi?",
        ["Elementlar chapdan o'ngga joylashadi", "Elementlar o'ngdan chapga joylashadi", "Elementlar yuqoridan pastga (vertikal) joylashadi", "Elementlar tartibi teskariga aylanadi"], 2),
      Q("align-items xususiyati qaysi o'q bo'ylab ishlaydi?",
        ["Asosiy o'q (main axis)", "Ko'ndalang o'q (cross axis)", "Diagonal o'q", "Hech birortasi"], 1),
      Q("gap xususiyati flexboxda nima uchun ishlatiladi?",
        ["Konteyner chetlari bilan bo'sh joy", "Flex elementlar orasidagi masofa", "Shrift orasidagi interval", "Rasmlar orasidagi bo'shliq"], 1),
    ]
  },
  {
    order_num: 5,
    title: "CSS Grid — 2D Layout Tizimi",
    description: "CSS Grid bilan ustun va qator asosidagi murakkab layout yaratish.",
    video_url: "https://www.youtube.com/embed/EFafSYg-PkI",
    duration_mins: 32,
    min_score: 5,
    hashtags: JSON.stringify(["#css", "#grid", "#layout", "#2d"]),
    content_text: `CSS Grid — 2D (ustun va qator) layout tizimi; Flexboxdan kuchliroq.

📌 Ishga tushirish: display: grid.
📌 grid-template-columns: 1fr 2fr 1fr — uchta ustun nisbiy kenglikda.
📌 grid-template-rows: 100px auto — qatorlar balandligi.
📌 fr (fraction) — mavjud joyning ulushi.
📌 gap / column-gap / row-gap — oraliq masofalar.
📌 repeat(3, 1fr) — 3 ta teng kenglikli ustun.
📌 minmax(200px, 1fr) — minimum 200px, maksimum 1fr.
📌 auto-fit bilan grid elementlar ekranga moslashadi.
📌 grid-column: 1 / 3 — 1-dan 3-ustungacha (2 ustunni egallaydi).
📌 grid-area: elementga nom berish (grid-template-areas bilan birga).`,
    quiz: [
      Q("CSS Grid containerini yoqish uchun qaysi xususiyat ishlatiladi?",
        ["grid: enable", "display: grid-container", "display: grid", "grid-mode: on"], 2),
      Q("CSS Grid va Flexbox asosiy farqi nima?",
        ["Grid tezroq ishlaydi", "Grid 2D (ustun+qator), Flexbox 1D (bir o'q)", "Flexbox yangi texnologiya", "Hech qanday farqi yo'q"], 1),
      Q("fr (fraction) birlik nima?",
        ["Fixed pixel o'lchov", "Font size birlik", "Mavjud bo'sh joyning ulushi", "Frame rate ko'rsatkichi"], 2),
      Q("repeat(4, 1fr) nima?",
        ["4 ta 1px kenglikdagi ustun", "4 ta teng kenglikdagi ustun yaratish qisqa yozuvi", "Bitta ustunni 4 marta takrorlash", "4 ta qator yaratish"], 1),
      Q("grid-column: 1 / 4 nima anglatadi?",
        ["4 ta alohida ustun", "1-chi va 4-chi ustunlar orasidagi (3 ustunli) joyni egallash", "Birinchi ustundan 4-chi ustungacha bo'sh joy", "Faqat 4-chi ustunda joylashish"], 1),
    ]
  },
  {
    order_num: 6,
    title: "JavaScript Asoslari — Dasturlash Tili",
    description: "O'zgaruvchilar, ma'lumot turlari, funksiyalar, shartlar va tsikllar.",
    video_url: "https://www.youtube.com/embed/hdI2bqOjy3c",
    duration_mins: 45,
    min_score: 5,
    hashtags: JSON.stringify(["#javascript", "#js", "#dasturlash", "#asoslar"]),
    content_text: `JavaScript (JS) — brauzerda ishlaydigan asosiy dasturlash tili.

📌 O'zgaruvchilar: let (o'zgaruvchan), const (o'zgarmas), var (eski, scope muammolari bor).
📌 Ma'lumot turlari: string, number, boolean, null, undefined, object, symbol, bigint.
📌 Shart: if / else if / else. Muxtasar: condition ? a : b (ternary).
📌 Tsikl: for, while, for...of (massiv), for...in (ob'ekt kalitlari).
📌 Funksiya: function greet(name) { return "Salom " + name; }
📌 Arrow funksiya: const greet = (name) => "Salom " + name;
📌 Array metodlar: map(), filter(), reduce(), find(), includes(), push(), pop().
📌 === (strict equality): tur va qiymatni birga tekshiradi. == faqat qiymatni.
📌 Truthy/Falsy: false, 0, "", null, undefined, NaN — falsy; qolganlar truthy.
📌 typeof operatori: typeof "salom" → "string", typeof 42 → "number".`,
    quiz: [
      Q("let, const va var orasidagi asosiy farq nima?",
        ["Hech qanday farqi yo'q", "var — function scope, let va const — block scope; const qayta belgilanmaydi", "const tezroq ishlaydi", "let faqat raqamlar uchun"], 1),
      Q("=== va == operatorlari qanday farqlanadi?",
        ["Hech qanday farqi yo'q", "=== faqat raqamlar uchun", "=== tur va qiymatni birga tekshiradi (strict); == faqat qiymatni", "== yangi va === eski"], 2),
      Q("Array.map() va Array.forEach() asosiy farqi nima?",
        ["forEach tezroq", "map yangi array qaytaradi; forEach qaytarmaydi (undefined)", "Hech qanday farqi yo'q", "forEach faqat ob'ektlar uchun"], 1),
      Q("Arrow function (=>) nima?",
        ["Yangi o'zgaruvchi e'lon qilish usuli", "Funksiya yaratishning qisqa va zamonaviy sintaksisi", "Shart ifodasi", "Tsikl turi"], 1),
      Q("Array.filter() metodi nima qaytaradi?",
        ["Bitta element", "Shartga mos elementlardan iborat yangi array", "Elementlar sonini", "Birinchi mos elementni"], 1),
    ]
  },
  {
    order_num: 7,
    title: "JavaScript DOM Manipulyatsiyasi",
    description: "HTML elementlarni JS orqali topish, o'zgartirish, qo'shish va hodisalar.",
    video_url: "https://www.youtube.com/embed/y17RuWkWdn8",
    duration_mins: 38,
    min_score: 5,
    hashtags: JSON.stringify(["#javascript", "#dom", "#hodisalar", "#manipulation"]),
    content_text: `DOM (Document Object Model) — HTML ni ob'ektlar daraxti sifatida ko'rsatadi.

📌 document.getElementById('id') — ID bo'yicha element topish.
📌 document.querySelector('.class') — CSS selektor bo'yicha birinchi element.
📌 document.querySelectorAll('p') — barcha mos elementlar (NodeList).
📌 element.innerHTML = '<b>Salom</b>' — HTML mazmunini o'zgartirish.
📌 element.textContent = 'Salom' — faqat matn (HTML parse qilinmaydi).
📌 element.style.color = 'red' — inline stil qo'shish.
📌 element.classList.add('active') / .remove() / .toggle().
📌 document.createElement('div') — yangi element yaratish.
📌 parent.appendChild(child) — element qo'shish.
📌 addEventListener('click', callback) — hodisa tinglovchi.
📌 event.preventDefault() — brauzerning standart xatti-harakatini to'xtatish.`,
    quiz: [
      Q("getElementById usuli nima qaytaradi?",
        ["Barcha mos elementlar ro'yxatini", "Mos kelgan birinchi elementni", "Elementning HTML kodini", "Elementning CSS klasslarini"], 1),
      Q("innerHTML va textContent orasidagi farq nima?",
        ["Hech qanday farqi yo'q", "innerHTML — HTML teglarini ham parse qiladi; textContent — faqat matn", "textContent tezroq", "innerHTML faqat input uchun"], 1),
      Q("addEventListener qanday ishlatiladi?",
        ["element.addEventListener = function(){}", "element.listen('click', fn)", "element.addEventListener('click', callbackFn)", "element.on.click(fn)"], 2),
      Q("event.preventDefault() nima qiladi?",
        ["Hodisani to'liq o'chiradi", "Brauzerning standart xatti-harakatini to'xtatadi (masalan, forma yuborishni)", "Sahifani yangilaydi", "Boshqa hodisalarni ham to'xtatadi"], 1),
      Q("querySelector va querySelectorAll farqi nima?",
        ["querySelector yangi, querySelectorAll eski", "querySelector birinchi mos elementni, querySelectorAll barcha mos elementlarni qaytaradi", "Hech qanday farqi yo'q", "querySelectorAll faqat CSS klasslari uchun"], 1),
    ]
  },
  {
    order_num: 8,
    title: "JavaScript ES6+ — Zamonaviy Xususiyatlar",
    description: "Template literals, destructuring, spread, Promises, async/await, modules.",
    video_url: "https://www.youtube.com/embed/nZ1DMMsyVyI",
    duration_mins: 42,
    min_score: 5,
    hashtags: JSON.stringify(["#javascript", "#es6", "#async", "#promise", "#zamonaviy"]),
    content_text: `ES6+ — JavaScript ning zamonaviy kengaytmalari (2015 yildan beri).

📌 Template literal: \`Salom \${name}!\` — qo'shtirnoqsiz string interpolyatsiya.
📌 Destructuring: const { a, b } = obj; yoki const [x, y] = arr;
📌 Spread operator (...): [...arr1, ...arr2] — massivlarni birlashtirish.
📌 Rest parameter: function f(...args) — cheksiz argumentlar.
📌 Default parameter: function greet(name = 'Mehmon') {}
📌 Promise: asinxron amallarni boshqarish. .then().catch() bilan.
📌 async/await: Promise lar bilan sinxron uslubda ishlash.
📌 import/export: ES6 modullari.
📌 Optional chaining (?.) : user?.address?.city — xato bermasdan zanjirli murojaat.
📌 Nullish coalescing (??): value ?? 'standart' — null/undefined bo'lsa standart.`,
    quiz: [
      Q("Template literal qanday yoziladi?",
        ["'Salom ' + name", "\"Salom \" + name", "`Salom ${name}`", "(Salom name)"], 2),
      Q("Object destructuring qanday ishlaydi?",
        ["const obj = { a, b };", "const { a, b } = obj; — a va b qiymatlarini ob'ektdan ajratib olish", "obj.extract(a, b);", "let a,b = obj;"], 1),
      Q("Spread operator (...) nima uchun ishlatiladi?",
        ["Faqat raqamlarni ko'paytirish", "Massiv/ob'ektni 'yoyib' elementlarni ajratib olish yoki birlashtirish", "Funksiya chaqirish", "Tsikl turi"], 1),
      Q("Promise.then() va .catch() nima uchun?",
        ["Sinxron kodni tezlashtirish", ".then() muvaffaqiyatli natija, .catch() xato bo'lganda chaqiriladi", "Faqat server so'rovlari uchun", "HTML elementlarini boshqarish uchun"], 1),
      Q("async/await nima afzallik beradi?",
        ["Kodni sekinlashtiradi", "Promise zanjirlarini (.then().catch()) sinxron ko'rinishda yozishga imkon beradi", "Faqat Node.js da ishlaydi", "Xatolarni avtomatik to'g'rilaydi"], 1),
    ]
  },
  {
    order_num: 9,
    title: "Git va GitHub — Versiya Nazorati",
    description: "git init, commit, push, pull, branch, merge va GitHub bilan ishlash.",
    video_url: "https://www.youtube.com/embed/SWYqp7iY_Tc",
    duration_mins: 35,
    min_score: 5,
    hashtags: JSON.stringify(["#git", "#github", "#versiya", "#terminal"]),
    content_text: `Git — kodni versiyalash va jamoa bilan ishlash tizimi. GitHub — Git repolarini onlayn saqlash platformasi.

📌 git init — yangi Git repozitariy yaratish.
📌 git add . — barcha o'zgarishlarni staging ga qo'shish.
📌 git commit -m "xabar" — o'zgarishlarni tarixga saqlash.
📌 git push origin main — kodni GitHub ga yuklash.
📌 git pull — GitHub dagi yangilanishlarni yuklab olish.
📌 git clone URL — repozitariyni nusxalash.
📌 git branch feature-branch — yangi branch yaratish.
📌 git checkout branchName — branchga o'tish.
📌 git merge branchName — branchlarni birlashtirish.
📌 git status — o'zgartirilgan fayllarni ko'rish.
📌 .gitignore — git kuzatmaydigan fayllar ro'yxati (node_modules, .env).
📌 Pull Request (PR) — GitHub da boshqa branchga o'zgarish qo'shish so'rovi.`,
    quiz: [
      Q("git init nima qiladi?",
        ["GitHub da repo ochadi", "Mavjud Git reponi o'chiradi", "Joriy papkada yangi Git repozitariy yaratadi", "Barcha fayllarni yuklaydi"], 2),
      Q("git add . nima qiladi?",
        ["Barcha fayllarni GitHub ga yuklaydi", "Joriy papkadagi barcha o'zgartirilgan fayllarni staging ga qo'shadi", "Commit yaratadi", "Yangi branch ochadi"], 1),
      Q("git commit -m 'xabar' nima qiladi?",
        ["Fayllarni GitHub ga yuklaydi", "Staging dagi o'zgarishlarni tarixiy snapshot sifatida saqlaydi", "Branchni birlashtiradi", "Reponi o'chiradi"], 1),
      Q("git push origin main nima qiladi?",
        ["GitHub dan kodni yuklab oladi", "Lokal main branchdagi commitlarni GitHub (origin) ga yuklaydi", "Yangi branch yaratadi", "Merge qiladi"], 1),
      Q("git pull nima qiladi?",
        ["Lokal o'zgarishlarni saqlaydi", "Uzoq repozitariydan (GitHub) yangilanishlarni yuklab, lokal branchga birlashtiradi", "Reponi nusxalaydi", "Branchni o'chiradi"], 1),
    ]
  },
  {
    order_num: 10,
    title: "React.js Asoslari — Zamonaviy UI Kutubxona",
    description: "Komponentlar, props, state, hooks (useState, useEffect) va JSX sintaksisi.",
    video_url: "https://www.youtube.com/embed/w7ejDZ8SWv8",
    duration_mins: 50,
    min_score: 5,
    hashtags: JSON.stringify(["#react", "#jsx", "#hooks", "#komponentlar", "#frontend"]),
    content_text: `React.js — Facebook (Meta) tomonidan ishlab chiqilgan UI kutubxona.

📌 JSX — JavaScript ichida HTML-ga o'xshash sintaksis: return (<div>Salom</div>).
📌 Component — qayta ishlatiladigan UI qismi. Funksional va Class komponentlari bor.
📌 Props — ota komponentdan farzand komponentga uzatiladigan ma'lumotlar (read-only).
📌 State — komponentning ichki o'zgaruvchan ma'lumoti.
📌 useState: const [count, setCount] = useState(0); — state boshqarish hook.
📌 useEffect: yon ta'sirlar (fetch, DOM, event) uchun. Dependency array bilan ishlaydi.
📌 Virtual DOM — React o'zgarishlarni real DOMga to'g'ridan-to'g'ri emas, virtual nusxa orqali qo'llaydi → tez.
📌 key prop — ro'yxat elementlarini yagona identifikatsiya qilish uchun (map da kerak).
📌 React da hodisalar: onClick, onChange, onSubmit (kichik harf emas camelCase).
📌 Conditional rendering: {isLoggedIn && <UserPanel />} yoki ternary.`,
    quiz: [
      Q("React nima?",
        ["To'liq fullstack framework", "Ma'lumotlar bazasi kutubxonasi", "Facebook (Meta) ishlab chiqqan UI yaratish uchun JavaScript kutubxonasi", "CSS preprocessor"], 2),
      Q("JSX nima?",
        ["Java va XML kombinatsiyasi", "CSS va JS aralashmasi", "JavaScript da HTML-ga o'xshash sintaksis, React komponentlar uchun", "Brauzer kengaytmasi"], 2),
      Q("Props qanday xususiyatga ega?",
        ["Komponent ichida o'zgartirish mumkin", "Faqat CSS uchun", "Ota komponentdan uzatiladi va read-only (o'zgartirib bo'lmaydi)", "Faqat raqam turi"], 2),
      Q("useState hook nima uchun?",
        ["Komponent o'chirish uchun", "Funksional komponentda o'zgaruvchan state (holat) saqlash uchun", "Serverga so'rov yuborish uchun", "Style o'zgartirish uchun"], 1),
      Q("Virtual DOM nima afzallik beradi?",
        ["Ko'proq xotira ishlatadi", "O'zgarishlarni virtual nusxada hisoblaydi, keyin real DOMga minimal o'zgarish qiladi → tezkor", "Internetni tezlashtiradi", "HTML ni JavaScript ga aylantiradi"], 1),
    ]
  }
];

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
    const insert = db.prepare(`
      INSERT INTO lessons (order_num,title,description,video_url,content_text,hashtags,quiz_json,min_score,duration_mins)
      VALUES (@order_num,@title,@description,@video_url,@content_text,@hashtags,@quiz_json,@min_score,@duration_mins)
    `);
    const insertMany = db.transaction((lessons) => {
      for (const l of lessons) insert.run(l);
    });
    insertMany(LESSONS.map(l => ({
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
    // Sync / Upgrade existing lessons to 5 questions and min_score 5
    const updateLesson = db.prepare(`
      UPDATE lessons 
      SET quiz_json = ?, min_score = 5
      WHERE order_num = ?
    `);
    const syncTransaction = db.transaction(() => {
      for (const l of LESSONS) {
        updateLesson.run(JSON.stringify(l.quiz), l.order_num);
      }
    });
    syncTransaction();
    console.log("🔄 Mavjud darslar har biri 5 tadan test va 100% o'tish talabi bilan yangilandi.");
  }
}

seed();
module.exports = db;

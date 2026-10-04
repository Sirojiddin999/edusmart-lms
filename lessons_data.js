const Q = (q, opts, a) => ({ q, opts, a });

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
📌 WWW (World Wide Web) — Internetning ustida ishlaydigan veb-sahifalar tizimi.
📌 HTTP/HTTPS — ma'lumot uzatish protokoli. HTTPS shifrlangan (xavfsiz).
📌 DNS (Domain Name System) — domen nomini IP manzilga aylantiradi.
📌 Brauzer — veb-sahifalarni yuklovchi dastur.
📌 Frontend — foydalanuvchi ko'radigan qism.
📌 Backend — server tomoni.
📌 Full-Stack — ham frontend, ham backend.
📌 URL — Uniform Resource Locator.
📌 IP manzil — tarmoqdagi qurilma manzili.`,
    quiz: [
      Q("Internet va World Wide Web (WWW) bir xil narsami?", ["Ha, ular mutlaqo bir xil", "Yo'q — Internet fizik tarmoq, WWW esa xizmat", "WWW kengroq", "Internet WWW qismi"], 1),
      Q("HTTP nimani anglatadi?", ["Home Tool Transfer Program", "High Technology Text Path", "HyperText Transfer Protocol", "HyperText Transmission Path"], 2),
      Q("Frontend asosan nima bilan ishlaydi?", ["Python, Django", "Java, Spring", "HTML, CSS, JavaScript", "C++, Rust"], 2),
      Q("DNS vazifasi nima?", ["Internet tezligini oshiradi", "Domenni IP manzilga aylantiradi", "Saytlarni himoyalaydi", "Brauzer keshini boshqaradi"], 1),
      Q("HTTPS va HTTP farqi?", ["HTTPS tezroq", "HTTP yangi", "HTTPS shifrlangan", "Farqi yo'q"], 2),
      Q("IP manzil nima?", ["Dasturlash tili", "Qurilmaning tarmoqdagi manzili", "Brauzer nomi", "Server turi"], 1),
      Q("Backend qaysi qism?", ["Dizayn", "Foydalanuvchi ko'radigan qism", "Server va ma'lumotlar bazasi", "Animatsiya"], 2),
      Q("URL nima?", ["Dasturlash tili", "Veb-sahifa manzili", "Brauzer", "Protokol"], 1),
      Q("Full-Stack dasturchi kim?", ["Faqat dizayn qiladi", "Faqat backend yozadi", "Ham frontend, ham backend yozadi", "Baza ma'muri"], 2),
      Q("Brauzer nima?", ["Veb-sahifalarni ochuvchi dastur", "Antivirus", "Operatsion tizim", "Server"], 0),
      Q("Internet tarmog'ining asosi nima?", ["Kabel va yo'riqnomalar", "Faqat sun'iy yo'ldosh", "Brauzerlar", "HTML"], 0),
      Q("Qaysi biri veb brauzer emas?", ["Chrome", "Firefox", "Python", "Safari"], 2),
      Q("Server nima qiladi?", ["Ekran yorqinligini sozlaydi", "So'rovlarni qabul qilib javob beradi", "Klaviatura bosilishini tahlil qiladi", "Faqat o'yin o'ynash uchun"], 1),
      Q("Veb-sahifa yuklanganda nima sodir bo'ladi?", ["Brauzer serverga so'rov yuboradi", "Server o'chadi", "Kompyuter restart bo'ladi", "Fayllar siqiladi"], 0),
      Q("Qaysi biri backend tili emas?", ["PHP", "CSS", "Python", "Node.js"], 1)
    ]
  },
  {
    order_num: 2,
    title: "HTML Asoslari — Veb Sahifa Strukturasi",
    description: "HTML teglar, atributlar, semantik belgilash.",
    video_url: "https://www.youtube.com/embed/UB1O30fR-EE",
    duration_mins: 35,
    min_score: 5,
    hashtags: JSON.stringify(["#html", "#veb-tuzilma", "#teglar"]),
    content_text: `HTML (HyperText Markup Language) — veb-sahifaning strukturasi.
📌 Teglar, Sarlavhalar, Paragraf, Rasm, Havola, Ro'yxatlar, Atributlar.`,
    quiz: [
      Q("<h1> bilan <h6> farqi?", ["h1 kichik, h6 katta", "h1 eng katta, h6 eng kichiki", "h6 yangi", "Bir xil"], 1),
      Q("Rasm tegini belgilang", ["<image>", "<photo>", "<picture>", "<img>"], 3),
      Q("Havola sintaksisi?", ["<link href='url'>", "<a src='url'>", "<a href='url'>", "<href url='url'>"], 2),
      Q("id va class farqi?", ["Bir xil", "id yagona, class ko'p elementda", "Hech qanday", "id faqat CSS uchun"], 1),
      Q("Semantik HTML?", ["Saytni tezlashtiradi", "Kod ma'nosini bildiradi, SEO uchun", "Faqat dizayn", "Teglarni ko'paytiradi"], 1),
      Q("HTML kengaytmasi?", ["HyperText Markup Language", "High Text Maker", "Hyper Tool", "Home Text"], 0),
      Q("Qatorni sindirish (yangi qatorga o'tish) tegi?", ["<break>", "<br>", "<lb>", "<newline>"], 1),
      Q("Jadval yaratish uchun qaysi teg ishlatiladi?", ["<table>", "<grid>", "<tab>", "<board>"], 0),
      Q("Input formasi tegi?", ["<form>", "<inputbox>", "<textfield>", "<enter>"], 0),
      Q("Matnni qalin (bold) qilish tegi?", ["<bold>", "<strong> yoki <b>", "<heavy>", "<thick>"], 1),
      Q("Sarlavha (title) qayerda yoziladi?", ["<body>", "<head>", "<footer>", "<header>"], 1),
      Q("Ro'yxat (tartibli) tegi?", ["<ul>", "<ol>", "<list>", "<li>"], 1),
      Q("Ro'yxat (tartibsiz) tegi?", ["<ul>", "<ol>", "<list>", "<li>"], 0),
      Q("HTML fayl qanday boshlanadi?", ["<html>", "<!DOCTYPE html>", "<head>", "<body>"], 1),
      Q("Qaysi teg o'zini o'zi yopadi?", ["<div>", "<p>", "<img>", "<span>"], 2)
    ]
  },
  {
    order_num: 3,
    title: "CSS Asoslari — Dizayn va Stillar",
    description: "CSS selektorlar, rang, shrift, box model.",
    video_url: "https://www.youtube.com/embed/1PnVor36_40",
    duration_mins: 40,
    min_score: 5,
    hashtags: JSON.stringify(["#css", "#dizayn", "#selektorlar"]),
    content_text: `CSS (Cascading Style Sheets) — veb-sahifaning ko'rinishini boshqaradi.`,
    quiz: [
      Q("CSS box modeli elementlari tartibi?", ["margin→border→padding→content", "border→content→padding→margin", "content→padding→border→margin", "padding→content→border→margin"], 2),
      Q("margin va padding farqi?", ["margin - ichki, padding - tashqi", "margin - tashqi, padding - ichki", "Bir xil", "Faqat gorizontal/vertikal"], 1),
      Q("display: none va visibility: hidden farqi?", ["Bir xil", "none - joy egallamas, hidden - joy egallaydi", "hidden tezroq", "none faqat mobilda"], 1),
      Q("CSS selektorlar ustuvorligi?", ["element > .class > #id > inline", "#id > .class > element > inline", "inline > #id > .class > element", "Barchasi teng"], 2),
      Q("@media query nima?", ["Animatsiya", "Har xil ekranlarga moslashish", "Shrift yuklash", "Rang o'zgartirish"], 1),
      Q("Fon rangini o'zgartirish uchun qaysi xususiyat ishlatiladi?", ["color", "bg-color", "background-color", "fill"], 2),
      Q("Matn rangini o'zgartirish?", ["font-color", "color", "text-color", "foreground"], 1),
      Q("Barcha p teglari uchun CSS qanday yoziladi?", ["p { }", "#p { }", ".p { }", "<p> { }"], 0),
      Q("CSS qisqartmasi?", ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"], 0),
      Q("Tashqi CSS faylini qanday ulaymiz?", ["<style src='...'>", "<link rel='stylesheet' href='...'>", "<css href='...'>", "<script src='...'>"], 1),
      Q("ID selektori qanday belgilanadi?", [".", "#", "*", "@"], 1),
      Q("Class selektori qanday belgilanadi?", [".", "#", "*", "@"], 0),
      Q("Shrift o'lchamini o'zgartirish?", ["text-size", "font-style", "font-size", "text-style"], 2),
      Q("Z-index nima qiladi?", ["Kenglikni o'zgartiradi", "Qatlamlar (layers) tartibini boshqaradi", "Rasm qo'yadi", "Animatsiya qiladi"], 1),
      Q("Hover holati qanday belgilanadi?", ["a:hover", "a.hover", "a_hover", "a*hover"], 0)
    ]
  },
  {
    order_num: 4,
    title: "CSS Flexbox — Zamonaviy Layout",
    description: "Flexbox bilan gorizontal va vertikal joylashtirish.",
    video_url: "https://www.youtube.com/embed/JJSoEo8JSnc",
    duration_mins: 28,
    min_score: 5,
    hashtags: JSON.stringify(["#css", "#flexbox"]),
    content_text: `CSS Flexbox — elementlarni bir o'q bo'ylab joylashtirish tizimi.`,
    quiz: [
      Q("Flexbox yoqish?", ["flex: enable", "display: flex-container", "display: flex", "flex-mode: on"], 2),
      Q("justify-content: space-between?", ["O'rtaga to'plash", "Chetlarga taqsimlash", "Chapga to'plash", "Teng joy qo'shish"], 1),
      Q("flex-direction: column natijasi?", ["Chapdan o'ngga", "O'ngdan chapga", "Yuqoridan pastga", "Teskari"], 2),
      Q("align-items qay o'qda ishlaydi?", ["Asosiy (main)", "Ko'ndalang (cross)", "Diagonal", "Hech qaysi"], 1),
      Q("gap xususiyati?", ["Konteyner chetlari", "Elementlar orasi", "Shrift orasi", "Rasm orasi"], 1),
      Q("Flex elementlar qatorga sig'masa nima ishlatiladi?", ["flex-wrap: wrap", "flex-overflow: scroll", "display: grid", "overflow: hidden"], 0),
      Q("Elementni asosiy o'qda markazlash?", ["justify-content: center", "align-items: center", "text-align: center", "margin: auto"], 0),
      Q("Elementni ko'ndalang o'qda markazlash?", ["justify-content: center", "align-items: center", "text-align: center", "margin: auto"], 1),
      Q("order xususiyati nima qiladi?", ["Rangni o'zgartiradi", "Flex elementning vizual tartibini o'zgartiradi", "Kenglikni belgilaydi", "Animatsiya beradi"], 1),
      Q("flex-grow: 1 nima qiladi?", ["Elementni kichraytiradi", "Barcha bo'sh joyni egallaydi", "Yashiradi", "Faqat matnni kattalashtiradi"], 1),
      Q("flex-shrink xususiyati?", ["Elementni o'stiradi", "Element kichrayishiga ruxsat beradi", "Faqat rasmlar uchun", "Rangni o'chiradi"], 1),
      Q("align-self nima uchun?", ["Barcha elementlar uchun", "Alohida flex elementini ko'ndalang o'qda tekislash uchun", "Matn tekislash uchun", "Fon rasmi uchun"], 1),
      Q("Asosiy o'q (main axis) standart qayerga yo'naladi?", ["Pastga", "Tepaga", "O'ngga (gorizontal)", "Chapga"], 2),
      Q("Flex-basis nima?", ["Flex elementning boshlang'ich o'lchami", "Rang asosi", "Shrift asosi", "Margin o'rniga"], 0),
      Q("Flex-direction: row-reverse qanday ishlaydi?", ["Yuqoridan pastga", "Pastdan yuqoriga", "O'ngdan chapga", "Chapdan o'ngga"], 2)
    ]
  },
  {
    order_num: 5,
    title: "CSS Grid — 2D Layout Tizimi",
    description: "CSS Grid bilan ustun va qator asosidagi layout.",
    video_url: "https://www.youtube.com/embed/EFafSYg-PkI",
    duration_mins: 32,
    min_score: 5,
    hashtags: JSON.stringify(["#css", "#grid", "#layout"]),
    content_text: `CSS Grid — 2D layout tizimi.`,
    quiz: [
      Q("Grid yoqish?", ["grid: enable", "display: grid-container", "display: grid", "grid-mode: on"], 2),
      Q("Grid va Flexbox farqi?", ["Grid tezroq", "Grid 2D, Flexbox 1D", "Flexbox yangi", "Farqi yo'q"], 1),
      Q("fr birligi?", ["Pixel", "Font", "Mavjud bo'sh joy ulushi", "Frame"], 2),
      Q("repeat(4, 1fr)?", ["4 ta 1px", "4 ta teng ustun qisqartmasi", "1 ustun 4 marta", "4 qator"], 1),
      Q("grid-column: 1 / 4?", ["4 ta alohida", "1-chi va 4-chi orasidagi joyni egallash", "Bo'sh joy", "Faqat 4-chi"], 1),
      Q("Ustunlar orasidagi masofa qanday yoziladi?", ["margin", "column-gap yoki gap", "padding", "spacing"], 1),
      Q("grid-template-rows nima qiladi?", ["Ustunlar kengligini", "Qatorlar balandligini belgilaydi", "Animatsiya beradi", "Rang beradi"], 1),
      Q("Grid-area nima uchun?", ["Elementga nom berib layout yaratish uchun", "Maydon rangini o'zgartirish", "Hajmni aniqlash", "Xatolarni ko'rish"], 0),
      Q("minmax() funksiyasi gridda qanday ishlaydi?", ["Minimal va maksimal o'lcham beradi", "Faqat minimal", "Faqat maksimal", "Tasodifiy o'lcham"], 0),
      Q("auto-fill va auto-fit farqi?", ["Farqi yo'q", "auto-fit bo'sh joyni to'ldiradi", "auto-fill bo'sh joy qoldirmaydi", "Faqat ismlari boshqa"], 1),
      Q("justify-items gridda nimani tekislaydi?", ["Ustunlarni", "Elementlarni yacheyka ichida (gorizontal)", "Qatorlarni", "Barchasini"], 1),
      Q("align-items gridda nimani tekislaydi?", ["Elementlarni yacheyka ichida (vertikal)", "Ustunlarni", "Qatorlarni", "Gorizontal"], 0),
      Q("grid-row: 2 / 5 nima anglatadi?", ["2-qatordan boshlab 4-qatorgacha (5-kuchkacha)", "2 va 5 qatorlar orasini tashlab ketish", "2-chi ustun", "5-chi ustun"], 0),
      Q("Grid liniyalari qanday raqamlanadi?", ["0 dan", "1 dan", "A dan", "-1 dan"], 1),
      Q("grid-template-columns: 200px 1fr 200px nima qiladi?", ["3 ta teng ustun", "Chetlari 200px, o'rtasi qolgan hamma joyni oladi", "Xato yozuv", "Faqat 200px ustunlar"], 1)
    ]
  },
  {
    order_num: 6,
    title: "JavaScript Asoslari",
    description: "JS: O'zgaruvchilar, turlar, if/else, tsikllar.",
    video_url: "https://www.youtube.com/embed/hdI2bqOjy3c",
    duration_mins: 45,
    min_score: 5,
    hashtags: JSON.stringify(["#js", "#asoslar"]),
    content_text: `JavaScript — brauzer tili. let, const, var, string, number, if, for, function.`,
    quiz: [
      Q("let, const va var farqi?", ["Farqi yo'q", "var - function scope, let/const - block scope", "const tezroq", "let faqat raqam"], 1),
      Q("=== va == farqi?", ["Farqi yo'q", "=== faqat raqam", "=== tur va qiymat, == faqat qiymat", "== yangi"], 2),
      Q("map va forEach farqi?", ["forEach tezroq", "map yangi array qaytaradi", "Farqi yo'q", "forEach ob'ekt uchun"], 1),
      Q("Arrow function?", ["Yangi o'zgaruvchi", "Funksiya yaratish qisqa usuli", "Shart", "Tsikl"], 1),
      Q("filter() nima qaytaradi?", ["Bitta element", "Shartga mos yangi array", "Sonini", "Birinchisini"], 1),
      Q("Console-ga qanday ma'lumot chiqariladi?", ["print()", "console.log()", "document.write()", "echo()"], 1),
      Q("O'zgaruvchi e'lon qilish qaysi?", ["variable x = 5", "let x = 5", "int x = 5", "x := 5"], 1),
      Q("Qaysi biri mantiqiy (boolean) qiymat?", ["'true'", "1", "true", "yes"], 2),
      Q("Massiv qanday yoziladi?", ["{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)", "<1, 2, 3>"], 1),
      Q("Ob'ekt qanday yoziladi?", ["{ key: 'value' }", "[ key: 'value' ]", "( key: 'value' )", "key = 'value'"], 0),
      Q("Funksiya qanday yaratiladi?", ["def myFunc()", "function myFunc()", "create myFunc()", "func myFunc()"], 1),
      Q("10 % 3 natijasi nima?", ["3", "1", "3.33", "0"], 1),
      Q("Tsiklning qaysi turi bor?", ["loop", "repeat", "for", "cycle"], 2),
      Q("typeof 42 nima qaytaradi?", ["'number'", "'string'", "'int'", "'float'"], 0),
      Q("Ternary operator belgisi?", ["?", "!", ":", "? :"], 3)
    ]
  },
  {
    order_num: 7,
    title: "JavaScript DOM Manipulyatsiyasi",
    description: "JS orqali HTML ni o'zgartirish.",
    video_url: "https://www.youtube.com/embed/y17RuWkWdn8",
    duration_mins: 38,
    min_score: 5,
    hashtags: JSON.stringify(["#js", "#dom"]),
    content_text: `DOM - HTML elementlarini boshqarish.`,
    quiz: [
      Q("getElementById nima qaytaradi?", ["Ro'yxat", "Birinchi mos element", "Kodni", "Klasslarni"], 1),
      Q("innerHTML vs textContent?", ["Farqi yo'q", "innerHTML HTML ni tushunadi", "textContent tezroq", "Faqat input"], 1),
      Q("addEventListener qanday yoziladi?", ["=", "listen", "element.addEventListener('click', fn)", "on.click"], 2),
      Q("preventDefault nima qiladi?", ["Hodisani o'chiradi", "Standart ishni to'xtatadi", "Yangilaydi", "Boshqasini to'xtatadi"], 1),
      Q("querySelector vs querySelectorAll?", ["querySelector yangi", "querySelector bitta, querySelectorAll barchasini", "Farqi yo'q", "querySelectorAll klasslar uchun"], 1),
      Q("Yangi HTML element yaratish?", ["document.createElement()", "document.new()", "document.add()", "document.make()"], 0),
      Q("Elementga klass qo'shish?", ["element.class = 'new'", "element.classList.add('new')", "element.addClass('new')", "element.style.class = 'new'"], 1),
      Q("Elementni o'chirish usuli?", ["element.remove()", "element.delete()", "element.destroy()", "element.hide()"], 0),
      Q("Parent elementga bola qo'shish?", ["parent.add(child)", "parent.appendChild(child)", "parent.insert(child)", "parent.push(child)"], 1),
      Q("Inputdan qiymat olish?", ["input.text", "input.value", "input.val", "input.content"], 1),
      Q("Rasm manbasini o'zgartirish?", ["img.src = '...'", "img.href = '...'", "img.url = '...'", "img.path = '...'"], 0),
      Q("Stilni o'zgartirish qanday bo'ladi?", ["element.css.color", "element.style.color", "element.style('color')", "element.color"], 1),
      Q("DOM nima ma'noni bildiradi?", ["Document Object Model", "Data Object Model", "Document Oriented Markup", "Data Oriented Model"], 0),
      Q("Qaysi biri sichqoncha hodisasi emas?", ["click", "mouseover", "keydown", "mouseout"], 2),
      Q("Sahifa to'liq yuklanganda qaysi hodisa ishlaydi?", ["onload yoki DOMContentLoaded", "onready", "onfinish", "onstart"], 0)
    ]
  },
  {
    order_num: 8,
    title: "JavaScript ES6+ Zamonaviy xususiyatlar",
    description: "Zamonaviy JS: Destructuring, spread, Promise.",
    video_url: "https://www.youtube.com/embed/nZ1DMMsyVyI",
    duration_mins: 42,
    min_score: 5,
    hashtags: JSON.stringify(["#es6", "#promise"]),
    content_text: `ES6+ — zamonaviy JS xususiyatlari.`,
    quiz: [
      Q("Template literal?", ["'+'", "\"+\"", "`${}`", "()"], 2),
      Q("Destructuring?", ["obj = {a,b}", "const {a,b} = obj", "extract", "a,b=obj"], 1),
      Q("Spread (...) operatori?", ["Ko'paytirish", "Massiv/ob'ektni yoyish", "Funksiya", "Tsikl"], 1),
      Q("Promise then/catch?", ["Tezlashtiradi", "then-muvaffaqiyat, catch-xato", "Faqat server uchun", "HTML uchun"], 1),
      Q("async/await afzalligi?", ["Sekinlatadi", "Promise ni sinxron kabi yozish", "Node.js da", "Xatolarni o'chiradi"], 1),
      Q("Arrow funksiya sintaksisi qaysi?", ["function() {}", "() => {}", "=> () {}", "fun () => {}"], 1),
      Q("Default parametr qanday yoziladi?", ["function(a = 10)", "function(a: 10)", "function(a == 10)", "function(a) default 10"], 0),
      Q("Import sintaksisi qaysi?", ["require 'module'", "import module from 'path'", "include 'module'", "load 'module'"], 1),
      Q("Export qilish qanday amalga oshadi?", ["send module", "export default const", "export const name", "return module"], 2),
      Q("Optional chaining (?.) nima qiladi?", ["Null bo'lsa xato beradi", "Null/undefined bo'lsa xato bermay undefined qaytaradi", "Dasturni to'xtatadi", "Hech nima qilmaydi"], 1),
      Q("Nullish coalescing (??) qanday ishlaydi?", ["Barcha Falsy qiymatlarni filtrlaydi", "Faqat null yoki undefined bo'lganda o'ng tomonni oladi", "Xatoni ushlaydi", "Solishtiradi"], 1),
      Q("Rest parametr qanday yoziladi?", ["function(...args)", "function(args...)", "function(*args)", "function(args[])"], 0),
      Q("Set nima?", ["Massiv turi", "Faqat yagona (takrorlanmas) qiymatlarni saqlovchi to'plam", "Ob'ekt", "Funksiya"], 1),
      Q("Map ob'ekti nima?", ["Xarita chizadi", "Kalit-qiymat juftliklarini (har qanday turdagi kalit bilan) saqlaydi", "Massiv usuli", "JSON"], 1),
      Q("Class e'lon qilish?", ["class MyClass {}", "create class MyClass", "new Class {}", "function Class()"], 0)
    ]
  },
  {
    order_num: 9,
    title: "Git va GitHub",
    description: "Versiya nazorati asoslari.",
    video_url: "https://www.youtube.com/embed/SWYqp7iY_Tc",
    duration_mins: 35,
    min_score: 5,
    hashtags: JSON.stringify(["#git", "#github"]),
    content_text: `Git - versiyalash, GitHub - server.`,
    quiz: [
      Q("git init?", ["GitHubda ochadi", "O'chiradi", "Lokal repo yaratadi", "Yuklaydi"], 2),
      Q("git add .?", ["Yuklaydi", "Staging ga qo'shadi", "Commit", "Branch"], 1),
      Q("git commit -m?", ["Yuklaydi", "Tarixga saqlaydi", "Birlashtiradi", "O'chiradi"], 1),
      Q("git push?", ["Yuklab oladi", "GitHubga yuklaydi", "Yangi branch", "Merge"], 1),
      Q("git pull?", ["Saqlaydi", "GitHubdan yuklab birlashtiradi", "Nusxalaydi", "O'chiradi"], 1),
      Q("Branch nima?", ["Daraxt shoxi", "Asosiy kodga ta'sir qilmagan holda mustaqil ish liniyasi", "Xato", "Fayl turi"], 1),
      Q("Yangi branch qanday ochiladi?", ["git new branch", "git branch name", "git create branch", "git make branch"], 1),
      Q("Boshqa branchga qanday o'tiladi?", ["git go", "git switch yoki git checkout", "git move", "git jump"], 1),
      Q(".gitignore vazifasi?", ["Gitni o'chiradi", "Git kuzatmasligi kerak bo'lgan fayllarni ko'rsatadi", "Xatolarni yashiradi", "Kodni yashiradi"], 1),
      Q("Merge nima qiladi?", ["Fayllarni o'chiradi", "Ikki branchni birlashtiradi", "Reponi nusxalaydi", "GitHubga yuklaydi"], 1),
      Q("Clone qanday ishlaydi?", ["git copy URL", "git clone URL", "git download URL", "git get URL"], 1),
      Q("Status tekshirish?", ["git info", "git status", "git check", "git state"], 1),
      Q("Commitlar tarixini qanday ko'rish mumkin?", ["git history", "git log", "git past", "git show"], 1),
      Q("Pull Request (PR) nima?", ["Kod so'rash", "O'zgarishlarni boshqa branchga qo'shishni so'rash", "Reponi o'chirish", "Internet so'rovi"], 1),
      Q("Origin nima?", ["Fayl nomi", "Asosiy (masofaviy) repozitariyning standart nomi", "Mahalliy repo", "Foydalanuvchi ismi"], 1)
    ]
  },
  {
    order_num: 10,
    title: "React.js Asoslari",
    description: "Zamonaviy UI yaratish.",
    video_url: "https://www.youtube.com/embed/w7ejDZ8SWv8",
    duration_mins: 50,
    min_score: 5,
    hashtags: JSON.stringify(["#react"]),
    content_text: `React — UI kutubxona.`,
    quiz: [
      Q("React nima?", ["Fullstack", "Baza", "UI yaratish kutubxonasi", "CSS turi"], 2),
      Q("JSX nima?", ["Java+XML", "CSS+JS", "JS ichidagi HTML sintaksis", "Kengaytma"], 2),
      Q("Props?", ["O'zgartirsa bo'ladi", "Faqat CSS", "Ota komponentdan keladigan read-only ma'lumot", "Raqam"], 2),
      Q("useState?", ["O'chirish", "State (holat) saqlash", "Serverga so'rov", "Style"], 1),
      Q("Virtual DOM?", ["Ko'p xotira", "Real DOMga nisbatan tezkor o'zgarishlar mexanizmi", "Internetni tezlatadi", "JS ga o'tkazadi"], 1),
      Q("Komponent nomi qanday boshlanishi kerak?", ["Kichik harf", "Katta harf bilan", "Xohlagan harf", "Raqam bilan"], 1),
      Q("useEffect nima uchun?", ["Kodni to'xtatish", "Yon ta'sirlar (API call, DOM o'zgarish) uchun", "State yaratish", "Props o'tish"], 1),
      Q("Reactni kim yaratgan?", ["Google", "Microsoft", "Facebook (Meta)", "Apple"], 2),
      Q("Komponentda class o'rniga nima ishlatiladi?", ["className", "class-name", "css-class", "id"], 0),
      Q("Reactda ro'yxatlarni (array) qanday render qilamiz?", ["for tsikli bilan", "map() funksiyasi bilan", "while bilan", "if bilan"], 1),
      Q("Ro'yxat elementiga qaysi prop kerak?", ["id", "key", "index", "ref"], 1),
      Q("Reactda hodisa qanday yoziladi (Masalan, click)?", ["onclick", "onClick", "on-click", "click"], 1),
      Q("Shartli render qilish (Conditional rendering)?", ["if() {}", "{condition && <Component />}", "switch", "while"], 1),
      Q("Fragment nima?", ["Keraksiz kod", "Ota tegsiz guruhlash (<></>)", "Xato", "State turi"], 1),
      Q("Yangi React loyiha qanday ochiladi?", ["npx create-react-app yoki vite", "npm install react", "git init", "react start"], 0)
    ]
  }
];

module.exports = LESSONS;

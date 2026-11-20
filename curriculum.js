// 10 Lessons per Course, 5 Questions per Lesson
const Q = (q, opts, a) => ({ q, opts, a });

const COURSES_DATA = [
  {
    title: "Python Asoslari va Sun'iy Intellekt",
    description: "Dunyodagi eng mashhur dasturlash tili yordamida backend mantiqi va AI ni o'rganing.",
    hash: "python",
    lessons: [
      {
        order_num: 1,
        title: "Python ga kirish va O'zgaruvchilar",
        description: "Python tilining afzalliklari, o'rnatish, print funksiyasi va o'zgaruvchilar tushunchasi.",
        video_url: "https://www.youtube.com/embed/kqtD5dpn9C8",
        duration_mins: 30,
        content_text: `📌 1-Dars Konspekti:
1. Python — o'qilishi oson, yuqori darajali va interpretatsiya qilinadigan dasturlash tili.
2. Yaratuvchisi — Guido van Rossum (1991-yil).
3. O'zgaruvchi — xotiradan joy ajratib ma'lumot saqlovchi nom.
4. Python da o'zgaruvchi e'lon qilishda uning turini oldindan yozish shart emas (dynamic typing).
5. print() funksiyasi konsolga natija chiqarish uchun ishlatiladi.
6. Izohlar (comments) '#' belgisi bilan boshlanadi.`,
        quiz: [
          Q("Python tili qachon va kim tomonidan yaratilgan?", ["1995-yilda Brendan Eich", "1991-yilda Guido van Rossum", "2000-yilda James Gosling", "1989-yilda Bjarne Stroustrup"], 1),
          Q("Python qanday turdagi dasturlash tili hisoblanadi?", ["Faqat quyi darajali", "Interpretatsiya qilinadigan va yuqori darajali", "Faqat kompilyatsiya qilinadigan", "Mashina kodi"], 1),
          Q("Konsolga ma'lumot chiqarish uchun qaysi funksiya ishlatiladi?", ["console.log()", "System.out.println()", "print()", "echo()"], 2),
          Q("Pythonda bir qatorli izoh (kommentariya) qaysi belgi bilan yoziladi?", ["//", "/*", "#", "--"], 2),
          Q("Qaysi o'zgaruvchi nomi Pythonda sintaktik jihatdan to'g'ri?", ["2ism", "user-name", "user_name", "class"], 2),
          Q("x = 10; y = 20; print(x + y) kodi qanday natija beradi?", ["1020", "30", "x + y", "Xatolik beradi"], 1),
          Q("Python fayllari qanday kengaytma bilan saqlanadi?", [".pt", ".py", ".pyn", ".python"], 1),
          Q("type(45) funksiyasining natijasi nima bo'ladi?", ["<class 'str'>", "<class 'float'>", "<class 'int'>", "<class 'bool'>"], 2),
          Q("Foydalanuvchidan ma'lumot kiritishni so'rash uchun nima ishlatiladi?", ["scan()", "input()", "read()", "cin >>"], 1),
          Q("Python da satr (matn) qanday belgilanadi?", ["Faqat qo'shtirnoq ichida", "Faqat bir tirnoq ichida", "Bir tirnoq yoki qo'shtirnoq ichida", "Qavslar ichida"], 2)
        ]
      },
      {
        order_num: 2,
        title: "Ma'lumot turlari va Arifmetik amallar",
        description: "int, float, str, bool turlari va barcha matematik amallar.",
        video_url: "https://www.youtube.com/embed/Z1Yd7upQsXY",
        duration_mins: 28,
        content_text: `📌 2-Dars Konspekti:
1. Asosiy ma'lumot turlari: int (butun son), float (o'nli son), str (matn), bool (mantiqiy True/False).
2. Arifmetik amallar: + (qo'shish), - (ayirish), * (ko'paytirish), / (bo'lish - doim float qaytaradi).
3. Maxsus amallar: // (butunli bo'lish), % (qoldiqli bo'lish), ** (darajaga ko'tarish).
4. Matnlar ustida amallar: 'salom' + ' dunyo' (birlashtirish), 'ha ' * 3 (takrorlash).
5. Tur o'zgartirish (type casting): int(), float(), str(), bool().`,
        quiz: [
          Q("17 // 5 ifodasi qanday natija beradi?", ["3.4", "3", "2", "3.0"], 1),
          Q("17 % 5 ifodasining qiymati nechaga teng?", ["2", "3", "3.4", "1"], 0),
          Q("2 ** 4 amali nimani hisoblaydi va natijasi necha?", ["2 ni 4 ga ko'paytiradi (8)", "2 ning 4-darajasi (16)", "2 ni 4 marta bo'ladi", "Xatolik beradi"], 1),
          Q("10 / 2 amali qanday turdagi qiymat qaytaradi?", ["int (5)", "float (5.0)", "str ('5')", "bool (True)"], 1),
          Q("int('25') + 5 amali natijasi necha bo'ladi?", ["'255'", "30", "Xatolik beradi", "25.5"], 1),
          Q("str(100) nimaga aylanadi?", ["Butun son 100", "Matnli '100'", "O'nli son 100.0", "Mantiqiy True"], 1),
          Q("bool(0) qiymati nima bo'ladi?", ["True", "False", "None", "0"], 1),
          Q("'Python' * 2 ifodasi nimani qaytaradi?", ["Xatolik", "'PythonPython'", "'Python 2'", "'Python, Python'"], 1),
          Q("float('3.14') natijasi qanday bo'ladi?", ["Matn", "3", "3.14", "Xatolik"], 2),
          Q("Qaysi qatorda mantiqiy (boolean) qiymatlar to'g'ri yozilgan?", ["true, false", "TRUE, FALSE", "True, False", "yes, no"], 2)
        ]
      },
      {
        order_num: 3,
        title: "Shart operatorlari: if, elif, else",
        description: "Mantiqiy shartlar, taqqoslash operatorlari va tarmoqlanuvchi dasturlar.",
        video_url: "https://www.youtube.com/embed/WGJJIrtnfpk",
        duration_mins: 32,
        content_text: `📌 3-Dars Konspekti:
1. Taqqoslash operatorlari: == (tengmi), != (teng emasmi), >, <, >=, <=.
2. Mantiqiy operatorlar: and (va), or (yoki), not (inkor).
3. if shart: blok kodi (4 ta probel - indentatsiya bilan yoziladi).
4. elif — qo'shimcha shart tekshirish.
5. else — yuqoridagi shartlarning hech biri bajarilmasa ishlaydi.`,
        quiz: [
          Q("Pythonda tenglikni tekshirish operatori qaysi?", ["=", "==", "===", "equals"], 1),
          Q("Teng emaslik operatori qaysi?", ["<>", "!=", "not =", "!=="], 1),
          Q("Shart blokining ichki kodlari qanday ajratiladi?", ["Qavslar {} bilan", "To'rtburchak qavs [] bilan", "Indentatsiya (bo'sh joy/probel) bilan", "Nuqtali vergul bilan"], 2),
          Q("(5 > 3) and (2 > 4) ifodasining natijasi nima bo'ladi?", ["True", "False", "None", "Xatolik"], 1),
          Q("(5 > 3) or (2 > 4) ifodasi nimani qaytaradi?", ["True", "False", "0", "1"], 0),
          Q("not (10 == 10) natijasi qanday?", ["True", "False", "None", "10"], 1),
          Q("Bir nechta shartlarni ketma-ket tekshirish uchun qaysi kalit so'z ishlatiladi?", ["else if", "elseif", "elif", "case"], 2),
          Q("x = 15; if x % 2 == 0: print('Juft') else: print('Toq') natijasi nima bo'ladi?", ["Juft", "Toq", "Hech narsa", "15"], 1),
          Q("Pythonda ternary (bir qatorli if-else) qanday yoziladi?", ["shart ? a : b", "a if shart else b", "if shart then a else b", "shart : a ; b"], 1),
          Q("if 0: sharti bajariladimi?", ["Ha, doim bajariladi", "Yo'q, 0 qiymati False hisoblanadi", "Xatolik yuz beradi", "Faqat bir marta"], 1)
        ]
      },
      {
        order_num: 4,
        title: "Sikllar: for va while",
        description: "Takrorlanuvchi amallarni bajarish, range funksiyasi, break va continue.",
        video_url: "https://www.youtube.com/embed/t8pPdKYpowI",
        duration_mins: 35,
        content_text: `📌 4-Dars Konspekti:
1. for sikli — ketma-ketlik (ro'yxat, satr, range) bo'ylab takrorlash.
2. range(start, stop, step) — sonlar ketma-ketligini hosil qiladi.
3. while sikli — berilgan shart True bo'lib turguniga qadar aylanadi.
4. break — siklni muddatidan oldin to'xtatadi.
5. continue — joriy iteratsiyani tashlab o'tib, keyingisiga o'tadi.`,
        quiz: [
          Q("range(5) qaysi sonlarni o'z ichiga oladi?", ["1 dan 5 gacha", "0 dan 5 gacha (5 kirmaydi: 0,1,2,3,4)", "0 dan 5 gacha (5 kiradi)", "1, 2, 3, 4, 5"], 1),
          Q("range(2, 10, 2) qanday sonlar ketma-ketligini beradi?", ["2, 3, 4, 5, 6, 7, 8, 9", "2, 4, 6, 8", "2, 4, 6, 8, 10", "1, 3, 5, 7, 9"], 1),
          Q("Siklni zudlik bilan to'xtatish operatori qaysi?", ["exit", "stop", "break", "return"], 2),
          Q("Joriy iteratsiyani tashlab, keyingisiga o'tish operatori qaysi?", ["skip", "pass", "continue", "next"], 2),
          Q("while sharti hech qachon False bo'lmasa nima sodir bo'ladi?", ["Dastur avtomatik to'xtaydi", "Cheksiz sikl (infinite loop) yuzaga keladi", "Xatolik chiqadi", "Sikl 100 martadan keyin tugaydi"], 1),
          Q("for i in 'Salom': print(i) necha marta ishlaydi?", ["1 marta", "5 marta", "6 marta", "Ishlamaydi"], 1),
          Q("for sikli bilan else bloki ishlatilishi mumkinmi?", ["Yo'q, faqat if bilan", "Ha, sikl break siz to'liq tugasa else ishlaydi", "Faqat while da mumkin", "Faqat xatolik bo'lsa"], 1),
          Q("pass kalit so'zi nima vazifani bajaradi?", ["Sikldan chiqadi", "Hech narsa qilmaydi (bo'sh blok joyi)", "Xato beradi", "Kod qayta boshlanadi"], 1),
          Q("Sikl ichida i = i + 1 ning qisqa yozilishi qaysi?", ["i++", "++i", "i += 1", "i =+ 1"], 2),
          Q("while True sikli qanday to'xtatiladi?", ["continue orqali", "Faqat dasturni o'chirish bilan", "break operatori orqali", "else orqali"], 2)
        ]
      },
      {
        order_num: 5,
        title: "Ro'yxatlar (Lists) va Kortejlar (Tuples)",
        description: "Massivlar bilan ishlash, list metodlari (append, pop, sort) va o'zgarmas Tuple.",
        video_url: "https://www.youtube.com/embed/x7X9w_GIm1s",
        duration_mins: 34,
        content_text: `📌 5-Dars Konspekti:
1. List — o'zgaruvchan (mutable), tartiblangan ma'lumotlar to'plami: [1, 2, 3].
2. Indekslash 0 dan boshlanadi, manfiy indeks oxiridan sanaydi (-1 eng oxirgi element).
3. Metodlar: append() (oxiriga qo'shish), insert() (indeksga qo'shish), pop() (o'chirish va olish), remove() (qiymat bo'yicha o'chirish).
4. Slicing: list[start:stop:step].
5. Tuple — o'zgarmas (immutable) to'plam: (1, 2, 3). Tez ishlaydi va o'zgarishlardan himoyalangan.`,
        quiz: [
          Q("Ro'yxatning oxirgi elementiga qaysi indeks orqali murojaat qilinadi?", ["[0]", "[-1]", "[last]", "[len]"], 1),
          Q("Ro'yxat oxiriga yangi element qo'shish metodi qaysi?", ["add()", "push()", "append()", "insert()"], 2),
          Q("List va Tuple o'rtasidagi asosiy farq nima?", ["List o'zgarmas, Tuple o'zgaruvchan", "List o'zgaruvchan (mutable), Tuple o'zgarmas (immutable)", "Tuple ga faqat sonlar yoziladi", "Farqi yo'q"], 1),
          Q("len([10, 20, 30, 40]) funksiyasi nimani qaytaradi?", ["3", "4", "40", "10"], 1),
          Q("a = [1, 2, 3, 4, 5]; a[1:4] kesmasi qanday natija beradi?", ["[1, 2, 3]", "[2, 3, 4]", "[2, 3, 4, 5]", "[1, 4]"], 1),
          Q("Ro'yxatdan oxirgi elementni o'chirib qaytaruvchi metod qaysi?", ["remove()", "delete()", "pop()", "clear()"], 2),
          Q("Ro'yxat elementlarini saralash (o'sish tartibida) metodi qaysi?", ["order()", "sort()", "filter()", "arrange()"], 1),
          Q("Bir elementli Tuple qanday e'lon qilinadi?", ["(5)", "(5,)", "[5]", "{5}"], 1),
          Q("[1, 2] + [3, 4] ifodasi nimani beradi?", ["[4, 6]", "[1, 2, 3, 4]", "[[1, 2], [3, 4]]", "Xatolik"], 1),
          Q("Ro'yxatda ma'lum element bor-yo'qligini tekshirish uchun qaysi operator ishlatiladi?", ["has", "exists", "in", "contains"], 2)
        ]
      },
      {
        order_num: 6,
        title: "Lug'atlar (Dictionaries) va To'plamlar (Sets)",
        description: "Kalit-qiymat (Key-Value) juftligi, get metodi va takrorlanmas elementli Set.",
        video_url: "https://www.youtube.com/embed/VchuKL44s6E",
        duration_mins: 30,
        content_text: `📌 6-Dars Konspekti:
1. Dictionary (Lug'at) — {key: value} ko'rinishidagi ma'lumotlar tuzilmasi.
2. Kalitlar (keys) unikal bo'lishi shart.
3. Element olish: d['nom'] yoki xavfsiz d.get('nom', 'topilmadi').
4. Metodlar: .keys(), .values(), .items().
5. Set (To'plam) — takrorlanmas elementlar to'plami: {1, 2, 3}. To'plam amallari: union, intersection.`,
        quiz: [
          Q("Lug'atda ma'lumotlar qanday tuzilmada saqlanadi?", ["Indeks va qiymat", "Kalit va qiymat (Key-Value)", "Faqat qiymatlar", "Kortejlar"], 1),
          Q("Mavjud bo'lmagan kalit chaqirilganda xatolik chiqmasligi uchun qaysi metod ishlatiladi?", ["find()", "get()", "search()", "lookup()"], 1),
          Q("d = {'ism': 'Ali', 'yosh': 20}; d['yosh'] ning qiymati nima?", ["'ism'", "'Ali'", "20", "None"], 2),
          Q("Lug'atning barcha kalitlarini olish uchun qaysi metod ishlatiladi?", [".items()", ".keys()", ".values()", ".all()"], 1),
          Q("To'plam (Set) ning eng asosiy xususiyati nima?", ["Tartiblangan bo'lishi", "Elementlari takrorlanmas (unikal) bo'lishi", "Faqat matn saqlashi", "Indekslash mumkinligi"], 1),
          Q("s = set([1, 2, 2, 3, 3, 3]); len(s) nechaga teng bo'ladi?", ["6", "3", "1", "Xatolik"], 1),
          Q("Set ga yangi element qo'shish metodi qaysi?", ["append()", "push()", "add()", "insert()"], 2),
          Q("Ikki to'plamning kesishmasini (umumiy elementlarini) topish metodi qaysi?", ["union()", "intersection()", "difference()", "combine()"], 1),
          Q("Bo'sh lug'at qanday yaratiladi?", ["[]", "()", "{}", "set()"], 2),
          Q("Bo'sh to'plam (set) qanday yaratiladi?", ["{}", "set()", "[]", "empty()"], 1)
        ]
      },
      {
        order_num: 7,
        title: "Funksiyalar va Lambda ifodalar",
        description: "def, argumentlar, return qiymat, *args, **kwargs va nomsiz lambda funksiyalar.",
        video_url: "https://www.youtube.com/embed/8ext9G7xspg",
        duration_mins: 36,
        content_text: `📌 7-Dars Konspekti:
1. Funksiya — qayta ishlatiladigan kodlar bloki.
2. E'lon qilish: def funksiya_nomi(parametrlar): ...
3. return — funksiyadan qiymat qaytarish. return yozilmasa None qaytadi.
4. Standart (default) parametrlar berish mumkin.
5. *args — istalgancha pozitsion argumentlar (tuple).
6. **kwargs — istalgancha kalitli argumentlar (dict).
7. Lambda — bir qatorli nomsiz funksiyalar: lambda x: x * 2.`,
        quiz: [
          Q("Pythonda funksiya qaysi kalit so'z bilan yaratiladi?", ["function", "def", "func", "define"], 1),
          Q("Funksiyadan natija qaytarish uchun nima ishlatiladi?", ["send", "output", "return", "back"], 2),
          Q("Funksiyada return ishlatilmasa u nima qaytaradi?", ["0", "False", "None", "Bo'sh satr ''"], 2),
          Q("*args funksiya parametrida nima vazifani bajaradi?", ["Cheksiz kalitli argumentlar", "Ixtiyoriy sondagi pozitsion argumentlarni kortej qilib oladi", "Xatolarni ushlaydi", "Majburiy argument"], 1),
          Q("**kwargs argumentlarni qanday turda qabul qiladi?", ["Ro'yxat (list)", "Kortej (tuple)", "Lug'at (dict)", "To'plam (set)"], 2),
          Q("Lambda funksiya nima?", ["Katta murakkab funksiya", "Bir qatorli nomsiz kichik funksiya", "Klass konstruktori", "Xatolik turi"], 1),
          Q("f = lambda a, b: a + b; f(3, 4) natijasi necha bo'ladi?", ["7", "12", "34", "Xatolik"], 0),
          Q("Funksiya ichida yaratilgan o'zgaruvchi qanday o'zgaruvchi hisoblanadi?", ["Global", "Lokal", "Statik", "Konstanta"], 1),
          Q("Funksiya ichidan global o'zgaruvchini o'zgartirish uchun nima kerak?", ["global kalit so'zi", "super kalit so'zi", "return kalit so'zi", "Buni qilib bo'lmaydi"], 0),
          Q("Parametrga standart qiymat berish sintaksisi to'g'ri ko'rsatilgan qator qaysi?", ["def salom(ism == 'Do\\'st'):", "def salom(ism = 'Do\\'st'):", "def salom(ism := 'Do\\'st'):", "def salom(ism default 'Do\\'st'):"], 1)
        ]
      },
      {
        order_num: 8,
        title: "Fayllar va Xatolar bilan ishlash (try-except)",
        description: "Fayllarni o'qish/yozish, with operatori, try-except-finally bloklari.",
        video_url: "https://www.youtube.com/embed/jO6qQDNa2CE",
        duration_mins: 32,
        content_text: `📌 8-Dars Konspekti:
1. Fayl ochish: open('fayl.txt', 'r'/'w'/'a').
2. Rejimlar: 'r' (o'qish), 'w' (yozish - tozalab), 'a' (qo'shish).
3. with open(...) as f: — faylni avtomatik xavfsiz yopadi.
4. Xatolarni ushlash:
   try: xavfli kod
   except XatoTuri: xato bo'lsa
   else: xato bo'lmasa
   finally: doim ishlaydi.`,
        quiz: [
          Q("Faylni o'qish rejimida ochish belgisi qaysi?", ["'w'", "'r'", "'a'", "'x'"], 1),
          Q("Mavjud fayl oxiriga ma'lumot qo'shib yozish rejimi qaysi?", ["'r'", "'w'", "'a' (append)", "'rw'"], 2),
          Q("Fayllar bilan ishlashda uning avtomatik yopilishini ta'minlovchi operator qaysi?", ["using", "with", "open-close", "try-catch"], 1),
          Q("Xatoliklarni ushlab dastur to'xtab qolishining oldini olish uchun nima ishlatiladi?", ["if-else", "try-except", "check-catch", "do-while"], 1),
          Q("finally bloki qachon bajariladi?", ["Faqat xato bo'lganda", "Faqat xato bo'lmaganda", "Har qanday holatda ham doim", "Faqat fayl ochilganda"], 2),
          Q("0 ga bo'lishda Pythonda qanday xatolik (Exception) yuzaga keladi?", ["ValueError", "ZeroDivisionError", "TypeError", "IndexError"], 1),
          Q("Ro'yxatda mavjud bo'lmagan indeks so'ralganda qanday xato chiqadi?", ["KeyError", "IndexError", "ValueError", "NameError"], 1),
          Q("Lug'atda yo'q kalit to'g'ridan-to'g'ri so'ralganda qaysi xatolik yuzaga keladi?", ["KeyError", "IndexError", "AttributeError", "TypeError"], 0),
          Q("Sun'iy xatolik chaqirish (throw qilish) uchun qaysi kalit so'z ishlatiladi?", ["throw", "raise", "error", "catch"], 1),
          Q("Faylning barcha qatorlarini ro'yxat sifatida o'qish metodi qaysi?", ["read()", "readline()", "readlines()", "fetch()"], 2)
        ]
      },
      {
        order_num: 9,
        title: "OOP: Klasslar va Obyektlar",
        description: "Class, Object, __init__ konstruktori, self, vorislik (inheritance) va inkapsulyatsiya.",
        video_url: "https://www.youtube.com/embed/rfscVS0vtbw",
        duration_mins: 40,
        content_text: `📌 9-Dars Konspekti:
1. OOP (Obyektga Yo'naltirilgan Dasturlash) — kodni real dunyo obyektlari asosida modellashtirish.
2. Class — obyekt uchun andoza (chizma).
3. Object — klassdan yaratilgan aniq nusxa (instansiya).
4. __init__ — klass konstruktori, yangi obyekt yaratilganda birinchi ishga tushadi.
5. self — joriy obyektning o'ziga havola.
6. Vorislik (Inheritance) — sinf boshqa sinfdan xususiyat va metodlarni meros oladi.`,
        quiz: [
          Q("Klass yaratish uchun qaysi kalit so'z ishlatiladi?", ["object", "class", "struct", "define"], 1),
          Q("Pythonda klass konstruktori qanday nomlanadi?", ["__construct__", "__init__", "constructor", "start"], 1),
          Q("Klass metodlarida 'self' nimani anglatadi?", ["Klassning o'zini", "Yaratilayotgan joriy obyekt nusxasini", "Python kutubxonasini", "Global o'zgaruvchini"], 1),
          Q("Vorislik (Inheritance) nima uchun kerak?", ["Dasturni sekinlashtirish", "Kodni qayta ishlatish va kengaytirish", "Fayllarni o'chirish", "Rang berish"], 1),
          Q("Ota klass metodini chaqirish uchun qaysi funksiya ishlatiladi?", ["parent()", "super()", "base()", "root()"], 1),
          Q("Inkapsulyatsiya tushunchasining ma'nosi nima?", ["Ma'lumotlarni ochiq qoldirish", "Ma'lumotlarni va metodlarni bitta kapsulada birlashtirib, ichki holatni yashirish", "Kodni nusxalash", "Faqat sonlar bilan ishlash"], 1),
          Q("Pythonda atributni xususiy (private) qilish uchun nima qilinadi?", ["Oldiga __ (ikkita pastki chiziq) qo'yiladi", "private so'zi yoziladi", "Atribut bosh harf bilan yoziladi", "Qavsga olinadi"], 0),
          Q("Klass ichidagi funksiyalar nima deb ataladi?", ["Protsedura", "Metod", "Klass moduli", "Katalog"], 1),
          Q("Polimorfizm nima?", ["Faqat bitta turda ishlash", "Bir xil interfeys yoki metod nomining har xil sinflarda turlicha ishlashi", "Xatolarni ko'paytirish", "Massiv turi"], 1),
          Q("Obyekt qaysi klassdan ekanligini tekshirish funksiyasi qaysi?", ["typeof()", "isinstance()", "isclass()", "check()"], 1)
        ]
      },
      {
        order_num: 10,
        title: "Sun'iy Intellekt va Data Science: NumPy, Pandas & ML",
        description: "Massivlar (NumPy), Ma'lumotlar tahlili (Pandas), Mashinali o'rganish tushunchalari va kurs xulosasi.",
        video_url: "https://www.youtube.com/embed/XKHEtdqhPAI",
        duration_mins: 45,
        content_text: `📌 10-Dars Konspekti:
1. NumPy — yuqori unumdorlikka ega ko'p o'lchovli massivlar va chiziqli algebra kutubxonasi.
2. Pandas — ma'lumotlar bilan ishlash va tahlil qilish uchun asosiy kutubxona (Series va DataFrame).
3. DataFrame — qator va ustunlardan iborat 2 o'lchovli jadval.
4. Sun'iy Intellekt (AI) — inson aqli talab qilinadigan vazifalarni kompyuterda modellashtirish.
5. Mashinali o'rganish (Machine Learning) — ma'lumotlar asosida mustaqil o'rganuvchi algoritmlar.
6. Asosiy ML kutubxonalari: Scikit-learn, TensorFlow, PyTorch.`,
        quiz: [
          Q("NumPy kutubxonasining asosiy afzalligi nima?", ["Veb-sayt yasash", "Ko'p o'lchovli sonli massivlar ustida o'ta tezkor matematik amallar bajarish", "Animatsiya qilish", "Dizayn chizish"], 1),
          Q("Pandas kutubxonasida ikki o'lchovli jadval shaklidagi asosiy tuzilma nima deb ataladi?", ["Matrix", "Table", "DataFrame", "Spreadsheet"], 2),
          Q("CSV faylini Pandasda o'qish funksiyasi qaysi?", ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"], 1),
          Q("DataFrame ning dastlabki 5 qatorini ko'rish metodi qaysi?", [".tail()", ".head()", ".top()", ".first()"], 1),
          Q("NumPy da 1 o'lchovli massiv qanday yaratiladi?", ["np.list()", "np.array([1, 2, 3])", "np.create()", "np.vector()"], 1),
          Q("Sun'iy Intellekt (AI) va Mashinali o'rganish (ML) munosabati qanday?", ["ML bu AI ning bir qismi (sohasi)", "AI bu ML ning bir qismi", "Ular mutlaqo aloqasiz", "Faqat bir xil atamalar"], 0),
          Q("O'qituvchi yordamida o'rganish (Supervised Learning) nima?", ["Nishon (label) ma'lumotlari mavjud bo'lgan ma'lumotlar ustida o'rganish", "Belgilanmagan ma'lumotlar ustida o'rganish", "Hech qanday ma'lumotsiz o'rganish", "Faqat o'yinlar uchun"], 0),
          Q("Klassifikatsiya va Regressiya qaysi soha vazifalari hisoblanadi?", ["Kriptografiya", "Supervised Machine Learning (Nazorat ostidagi o'rganish)", "Veb dizayn", "Baza ma'murligi"], 1),
          Q("Python da Mashinali O'rganish (ML) uchun eng mashhur boshlang'ich kutubxona qaysi?", ["Django", "Scikit-Learn", "Flask", "Tkinter"], 1),
          Q("Kursning barcha 10 ta darsini to'liq o'zlashtirgan o'quvchi nima oladi?", ["Hech narsa", "InnoCode.uz tomonidan tasdiqlangan rasmiy elektron QR-kodli sertifikat", "Faqat baho", "Ruxsatnoma"], 1)
        ]
      }
    ]
  },
  {
    title: "JavaScript & React.js",
    description: "Zamonaviy veb-saytlar va interfeyslar yaratish uchun eng kerakli texnologiyalar.",
    hash: "javascript",
    lessons: [
      {
        order_num: 1,
        title: "JavaScript ga kirish va O'zgaruvchilar",
        description: "JS tarixi, script tegi, konsol, let, const va var farqlari.",
        video_url: "https://www.youtube.com/embed/W6NZfCO5SIk",
        duration_mins: 28,
        content_text: `📌 1-Dars: JavaScript ga kirish, o'zgaruvchilar (let, const, var), konsol bilan ishlash.`,
        quiz: [
          Q("JavaScript qayerda ishlaydi?", ["Faqat serverda", "Brauzerda va Node.js muhitida", "Faqat telefonda", "Faqat ma'lumotlar bazasida"], 1),
          Q("O'zgarmas qiymat (konstanta) e'lon qilish kalit so'zi qaysi?", ["var", "let", "const", "def"], 2),
          Q("let va var ning asosiy farqi nima?", ["Farqi yo'q", "let blok qamroviga (block scope) ega, var funksiya qamroviga ega", "var yangi, let eski", "const bilan bir xil"], 1),
          Q("Konsolga xabar chiqarish funksiyasi qaysi?", ["print()", "console.log()", "echo()", "System.out.println()"], 1),
          Q("JavaScript fayllari qanday kengaytma bilan saqlanadi?", [".java", ".js", ".jsx", ".ts"], 1),
          Q("HTML faylga JavaScript qaysi teg orqali ulanadi?", ["<javascript>", "<script>", "<js>", "<link>"], 1),
          Q("JavaScript tili qaysi yili yaratilgan?", ["1991", "1995", "2000", "2008"], 1),
          Q("Bir qatorli izoh qanday belgilanadi?", ["#", "//", "<!-- -->", "--"], 1),
          Q("const x = 5; x = 10; qilinsa nima sodir bo'ladi?", ["x 10 ga aylanadi", "TypeError (xatolik) yuz beradi", "x 15 bo'ladi", "None qaytadi"], 1),
          Q("JavaScript qanday turdagi dasturlash tili?", ["Statik tipli", "Dinamik tipli (dynamic typed)", "Faqat past darajali", "Mashina tili"], 1)
        ]
      },
      {
        order_num: 2,
        title: "Ma'lumot turlari va Operatorlar",
        description: "Primitive va Reference tiplar, typeof, == va === farqi.",
        video_url: "https://www.youtube.com/embed/hdI2bqOjy3c",
        duration_mins: 30,
        content_text: `📌 2-Dars: Number, String, Boolean, Null, Undefined, BigInt, Symbol va qat'iy tenglik (===).`,
        quiz: [
          Q("JavaScript da nechta primitiv ma'lumot turi bor?", ["3 ta", "5 ta", "7 ta", "10 ta"], 2),
          Q("== va === operatorlari o'rtasidagi farq nima?", ["Farqi yo'q", "== faqat qiymatni, === qiymat va turini ham tekshiradi", "=== faqat satrlar uchun", "== yangiroq"], 1),
          Q("typeof null natijasi nima bo'ladi (tarixiy bag)?", ["'null'", "'object'", "'undefined'", "'boolean'"], 1),
          Q("5 + '5' amali natijasi nima bo'ladi?", ["10", "'55'", "NaN", "Xatolik"], 1),
          Q("'5' - 2 amali natijasi nima bo'ladi?", ["3", "'3'", "'52'", "NaN"], 0),
          Q("Qiymat berilmagan o'zgaruvchining boshlang'ich qiymati nima?", ["null", "undefined", "0", "false"], 1),
          Q("NaN nimani anglatadi?", ["Not a Null", "Not a Number", "New array Node", "No action Needed"], 1),
          Q("Mantiqiy 'VA' (AND) operatori qaysi?", ["and", "&&", "&", "||"], 1),
          Q("Mantiqiy 'YOKI' (OR) operatori qaysi?", ["or", "||", "|", "!"], 1),
          Q("Template literals (satr shabloni) qaysi belgi bilan yoziladi?", ["Qo'shtirnoq \"\"", "Bittalik tirnoq ''", "Backtick ``", "Qavslar ()"], 2)
        ]
      },
      {
        order_num: 3,
        title: "Shartlar va Sikllar",
        description: "if-else, switch-case, ternary operator, for, while va do-while.",
        video_url: "https://www.youtube.com/embed/jS4aFq5-91M",
        duration_mins: 32,
        content_text: `📌 3-Dars: Shart operatorlari va takrorlanuvchi sikllar.`,
        quiz: [
          Q("Ternary operator sintaksisi to'g'ri ko'rsatilgan qator qaysi?", ["shart ? a : b", "shart : a ? b", "if shart then a", "shart -> a | b"], 0),
          Q("switch operatorida variantdan chiqish uchun nima ishlatiladi?", ["exit", "return", "break", "stop"], 2),
          Q("for (let i = 0; i < 5; i++) necha marta ishlaydi?", ["4", "5", "6", "0"], 1),
          Q("do-while siklining while dan asosiy farqi nima?", ["Hech qanday", "do bloki kamida 1 marta shart tekshirilmasdan oldin bajariladi", "do-while tezroq", "while faqat satrlar bilan ishlaydi"], 1),
          Q("Siklni muddatidan oldin to'xtatish operatori qaysi?", ["continue", "break", "halt", "pass"], 1),
          Q("Keyingi iteratsiyaga o'tish operatori qaysi?", ["continue", "skip", "next", "break"], 0),
          Q("for...of sikli asosan nimalar uchun ishlatiladi?", ["Obyekt kalitlari uchun", "Massiv va satr kabi iteratsiya qilinuvchi to'plamlar uchun", "Faqat sonlar uchun", "Xatolarni topish uchun"], 1),
          Q("for...in sikli nimalarni aylanadi?", ["Faqat sonlarni", "Obyekt xususiyatlari (kalitlari) bo'ylab", "Faqat HTML elementlarni", "Funksiyalarni"], 1),
          Q("Boolean(0) qiymati qanday bo'ladi?", ["true", "false", "undefined", "null"], 1),
          Q("Qaysi qiymat 'falsy' hisoblanmaydi?", ["0", "'' (bo'sh satr)", "'0' (ichida 0 bo'lgan satr)", "null"], 2)
        ]
      },
      {
        order_num: 4,
        title: "Funksiyalar va Arrow Functions",
        description: "Function declaration, expression, arrow funksiyalar va scope.",
        video_url: "https://www.youtube.com/embed/PkZNo7MFOUg",
        duration_mins: 35,
        content_text: `📌 4-Dars: Funksiyalar, parametrlar, return, arrow functions va this bog'lanishi.`,
        quiz: [
          Q("Arrow function qanday yoziladi?", ["function => () {}", "() => {}", "def -> () {}", "() -> {}"], 1),
          Q("Funksiyadan qiymat qaytarish operatori qaysi?", ["send", "output", "return", "result"], 2),
          Q("Arrow function larning o'z 'this' konteksti bormi?", ["Ha, albatta", "Yo'q, tashqi leksik kontekstdan oladi", "Faqat qattiq rejimda", "Har doim global bo'ladi"], 1),
          Q("Standart parametr qanday beriladi?", ["function f(a = 10) {}", "function f(a: 10) {}", "function f(a == 10) {}", "function f(default a 10) {}"], 0),
          Q("Rest parametr qanday yoziladi?", ["*args", "...args", "..args", "&args"], 1),
          Q("Funksiya ichida e'lon qilingan o'zgaruvchi qayerda ko'rinadi?", ["Hamma joyda", "Faqat o'sha funksiya ichida (lokal)", "Faqat boshqa fayllarda", "Brauzer xotirasida"], 1),
          Q("Hoisting qaysi e'londa to'liq ishlaydi?", ["Arrow function da", "Function declaration da", "const bilan", "let bilan"], 1),
          Q("Callback funksiya nima?", ["Xatoga sabab bo'luvchi funksiya", "Boshqa funksiyaga argument sifatida beriladigan funksiya", "Faqat orqaga qaytuvchi funksiya", "Rekursiv funksiya"], 1),
          Q("IIFE (Immediately Invoked Function Expression) nima?", ["Hech qachon ishlamaydigan funksiya", "Yaratilishi bilanoq darhol chaqiriladigan funksiya", "Faqat serverda ishlaydigan funksiya", "CSS kodi"], 1),
          Q("Closure (yopilish) nima?", ["Dasturni yopish funksiyasi", "Ichki funksiyaning tashqi funksiya o'zgaruvchilarini eslab qolishi", "Xotirani tozalash", "Modulni yuklash"], 1)
        ]
      },
      {
        order_num: 5,
        title: "Massivlar (Arrays) va Array metodlari",
        description: "Massivlar, map, filter, reduce, forEach, find va slice metodlari.",
        video_url: "https://www.youtube.com/embed/hKB-YGF14SY",
        duration_mins: 38,
        content_text: `📌 5-Dars: Massivlar va zamonaviy funksional metodlar.`,
        quiz: [
          Q("Massiv oxiriga yangi element qo'shish metodi qaysi?", ["unshift()", "push()", "append()", "pop()"], 1),
          Q("Massiv boshidan element o'chirish metodi qaysi?", ["shift()", "pop()", "slice()", "delete()"], 0),
          Q("Massiv elementlarini o'zgartirib yangi massiv qaytaruvchi metod qaysi?", ["forEach()", "filter()", "map()", "reduce()"], 2),
          Q("Shartga mos keluvchi elementlarni ajratib oluvchi metod qaysi?", ["map()", "filter()", "find()", "every()"], 1),
          Q("Massivni bitta yagona qiymatga qisqartiruvchi (jamlovchi) metod qaysi?", ["reduce()", "concat()", "join()", "collect()"], 0),
          Q("Massiv uzunligini aniqlovchi xususiyat qaysi?", [".size", ".length", ".count()", ".len"], 1),
          Q("Massivda element borligini tekshiruvchi zamonaviy metod qaysi?", [".has()", ".includes()", ".contains()", ".exists()"], 1),
          Q("Massivni teskari tartibda o'girish metodi qaysi?", [".reverse()", ".flip()", ".invert()", ".back()"], 0),
          Q("Massiv elementlarini satrga aylantirib birlashtiruvchi metod qaysi?", [".toString()", ".join()", ".concat()", ".merge()"], 1),
          Q("Spread operator massivda qanday belgilanadi?", ["...", "+++", "---", "***"], 0)
        ]
      },
      {
        order_num: 6,
        title: "Obyektlar (Objects) va JSON",
        description: "Kalit-qiymat, destructuring, JSON.stringify va JSON.parse.",
        video_url: "https://www.youtube.com/embed/w7ejDZ8SWv8",
        duration_mins: 33,
        content_text: `📌 6-Dars: Obyektlar, destructuring, Object metodlari va JSON formati.`,
        quiz: [
          Q("Obyekt qanday qavslar ichida yaratiladi?", ["[]", "{}", "()", "<>"], 1),
          Q("Obyekt xususiyatini olishning ikki usuli qaysi?", [".nuqta va [qavs]", ":: va ->", "# va @", "$ va %"], 0),
          Q("JSON nimani anglatadi?", ["JavaScript Object Notation", "Java System Online Network", "JavaScript Open Node", "Just Script On Net"], 0),
          Q("JavaScript obyektini JSON satriga o'girish metodi qaysi?", ["JSON.parse()", "JSON.stringify()", "JSON.toText()", "JSON.convert()"], 1),
          Q("JSON satrini JavaScript obyektiga aylantirish metodi qaysi?", ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.read()"], 1),
          Q("Object destructuring sintaksisi to'g'ri ko'rsatilgan qator qaysi?", ["const [a, b] = obj;", "const { name, age } = obj;", "const (name) = obj;", "const <name> = obj;"], 1),
          Q("Obyektning barcha kalitlarini massiv sifatida olish qaysi?", ["Object.keys(obj)", "Object.values(obj)", "Object.entries(obj)", "obj.allKeys()"], 0),
          Q("Optional chaining operatori qaysi?", ["??", "?.", "||", "?:"], 1),
          Q("Nullish coalescing operatori qaysi?", ["||", "??", "&&", "?."], 1),
          Q("Obyekt nusxasini xavfsiz klonlashning zamonaviy usuli qaysi?", ["structuredClone(obj) yoki { ...obj }", "obj.copy()", "obj.clone()", "obj = obj"], 0)
        ]
      },
      {
        order_num: 7,
        title: "DOM Bilan ishlash va Hodisalar (Events)",
        description: "document.querySelector, addEventListener, hodisalar va dinamik HTML.",
        video_url: "https://www.youtube.com/embed/bMknfKXIFA8",
        duration_mins: 40,
        content_text: `📌 7-Dars: DOM manipulatsiyasi, selectorlar va hodisalar.`,
        quiz: [
          Q("DOM nimani anglatadi?", ["Document Object Model", "Data Object Mode", "Digital Ordinance Module", "Desktop Object Maker"], 0),
          Q("CSS selektori bo'yicha birinchi elementni topish metodi qaysi?", ["document.getElementById()", "document.querySelector()", "document.find()", "document.select()"], 1),
          Q("Elementga hodisa (event) tinglovchisini qo'shish metodi qaysi?", [".attachEvent()", ".addEventListener()", ".on()", ".listen()"], 1),
          Q("Tugma bosilish hodisasi qanday nomlanadi?", ["press", "click", "hover", "tap"], 1),
          Q("Elementning HTML matnini o'zgartirish xususiyati qaysi?", [".innerText / .innerHTML", ".textContent", ".value", ".text"], 0),
          Q("Formaning standart yuborilishini (sahifa yangilanishini) to'xtatish qaysi?", ["event.stop()", "event.preventDefault()", "event.halt()", "event.cancel()"], 1),
          Q("Yangi HTML elementi yaratish metodi qaysi?", ["document.newElement()", "document.createElement()", "document.make()", "document.build()"], 1),
          Q("Elementga yangi CSS klass qo'shish qanday yoziladi?", ["element.class.add()", "element.classList.add()", "element.addClass()", "element.className += ' '"], 1),
          Q("Input maydonidagi qiymatni olish qaysi xususiyat orqali amalga oshadi?", [".text", ".value", ".val", ".input"], 1),
          Q("Barcha mos keluvchi elementlarni topish metodi qaysi?", ["document.querySelectorAll()", "document.findMany()", "document.getAll()", "document.selectGroup()"], 0)
        ]
      },
      {
        order_num: 8,
        title: "Asinxron JavaScript: Promises va Async/Await",
        description: "Event Loop, Callbacks, Promise zanjiri, async/await va fetch API.",
        video_url: "https://www.youtube.com/embed/Ke90Tje7VS0",
        duration_mins: 42,
        content_text: `📌 8-Dars: Asinxron dasturlash, fetch orqali serverdan ma'lumot olish.`,
        quiz: [
          Q("JavaScript tabiatan qanday ishlaydi?", ["Ko'p oqimli (multi-threaded)", "Bir oqimli (single-threaded)", "Faqat asinxron", "Faqat parallel"], 1),
          Q("Promise ning 3 ta asosiy holati qaysilar?", ["start, run, end", "pending, fulfilled (resolved), rejected", "wait, success, fail", "open, process, close"], 1),
          Q("Muvaffaqiyatli Promise natijasini qabul qilish metodi qaysi?", [".catch()", ".then()", ".finally()", ".done()"], 1),
          Q("Xatoliklarni ushlash uchun Promise metod qaysi?", [".then()", ".catch()", ".error()", ".fail()"], 1),
          Q("async funksiya doim nima qaytaradi?", ["Satr", "Promise", "Son", "Obyekt"], 1),
          Q("await kalit so'zi qayerda ishlatilishi mumkin?", ["Ixtiyoriy joyda", "Faqat async funksiya ichida (yoki top-level module da)", "Faqat sikllarda", "Faqat sinflarda"], 1),
          Q("Serverdan HTTP so'rov orqali ma'lumot olish uchun standart funksiya qaysi?", ["request()", "fetch()", "http.get()", "ajax()"], 1),
          Q("fetch() ga kelgan javobni JSON formatga o'girish qanday bo'ladi?", ["response.json()", "response.text()", "JSON.parse(response)", "response.body()"], 0),
          Q("Vaqt kechiktirib kod yurgazish funksiyasi qaysi?", ["sleep()", "setTimeout()", "delay()", "wait()"], 1),
          Q("Ma'lum vaqt oralig'ida muntazam kod bajarish funksiyasi qaysi?", ["setTimeout()", "setInterval()", "repeat()", "loop()"], 1)
        ]
      },
      {
        order_num: 9,
        title: "React.js Asoslari: Komponentlar va Props",
        description: "React nima, Virtual DOM, JSX sintaksisi, Funktsional komponentlar va Props.",
        video_url: "https://www.youtube.com/embed/NCwa_xi0Uuc",
        duration_mins: 40,
        content_text: `📌 9-Dars: React kutubxonasi, JSX qoidalari, komponentlar va ma'lumot uzatish (props).`,
        quiz: [
          Q("React.js nima?", ["To'liq backend framework", "Foydalanuvchi interfeyslari (UI) yaratish uchun JavaScript kutubxonasi", "Ma'lumotlar bazasi", "CSS freymvorki"], 1),
          Q("React ni kim ishlab chiqqan va qo'llab-quvvatlaydi?", ["Google", "Meta (Facebook)", "Microsoft", "Twitter"], 1),
          Q("JSX nimani anglatadi?", ["Java Syntax XML", "JavaScript XML", "JSON Style Extension", "JavaScript Xerox"], 1),
          Q("JSX da HTML klassi qaysi atribut bilan yoziladi?", ["class", "className", "classList", "styleClass"], 1),
          Q("Ota komponentdan bola komponentga ma'lumot qanday uzatiladi?", ["State orqali", "Props orqali", "Redux orqali", "URL orqali"], 1),
          Q("Props qiymatini bola komponent ichida to'g'ridan-to'g'ri o'zgartirish mumkinmi?", ["Ha, istalgancha", "Yo'q, props faqat o'qish uchun (read-only)", "Faqat son bo'lsa", "Faqat let bo'lsa"], 1),
          Q("Virtual DOM nima vazifani bajaradi?", ["Sahifani sekinlashtiradi", "Haqiqiy DOM ga o'zgarishlarni solishtirib, faqat o'zgargan qismini tezkor yangilaydi", "Bazada saqlaydi", "Xavfsizlikni oshiradi"], 1),
          Q("React da barcha komponentlar qanday boshlanishi kerak?", ["Kichik harf bilan", "Katta (bosh) harf bilan", "$ belgisi bilan", "_ belgisi bilan"], 1),
          Q("Fragment tegi React da qanday yoziladi?", ["<fragment>", "<> </>", "<wrapper>", "<group>"], 1),
          Q("JSX ichida JavaScript ifodalarini yozish uchun nima ishlatiladi?", ["{{ }}", "{ } figurali qavslar", "[ ]", "( )"], 1)
        ]
      },
      {
        order_num: 10,
        title: "React Hooks (useState, useEffect) va Loyiha",
        description: "useState bilan holat boshqaruvi, useEffect bilan hayot sikli va yakuniy loyiha.",
        video_url: "https://www.youtube.com/embed/TNhaISOUy6Q",
        duration_mins: 45,
        content_text: `📌 10-Dars: React Hooks, amaliy komponent yaratish va kurs yakuni.`,
        quiz: [
          Q("Komponent ichida o'zgaruvchan holat (state) yaratish hooki qaysi?", ["useRef", "useState", "useMemo", "useContext"], 1),
          Q("const [count, setCount] = useState(0); da setCount nima?", ["O'zgarmas qiymat", "Holatni yangilovchi funksiya", "Array indeksi", "HTML elementi"], 1),
          Q("Tashqi ma'lumotlarni yuklash (side-effects) uchun qaysi hook ishlatiladi?", ["useState", "useEffect", "useCallback", "useId"], 1),
          Q("useEffect faqat komponent birinchi marta ekranga chiqqanda 1 marta ishlashi uchun nima qilinadi?", ["Ikkinchi parametr berilmaydi", "Ikkinchi parametriga bo'sh massiv [] beriladi", "count parametri beriladi", "return qo'yiladi"], 1),
          Q("Hook larni qayerda chaqirish taqiqlanadi?", ["Komponent tanasida", "Sikllar, shartlar (if) yoki ichki funksiyalar ichida", "Eng yuqorida", "Asosiy faylda"], 1),
          Q("useRef hookining asosiy vazifasi nima?", ["Sahifani qayta chizish", "DOM elementiga to'g'ridan-to'g'ri bog'lanish va render chaqirmaydigan qiymat saqlash", "State o'chirish", "Rang berish"], 1),
          Q("Ro'yxat elementlarini render qilishda (map) har biriga nima berilishi shart?", ["class", "unikal 'key' atributi", "id atributi", "style"], 1),
          Q("Input qiymatini state bilan boshqarish nima deb ataladi?", ["Uncontrolled component", "Controlled component", "Virtual input", "Smart tag"], 1),
          Q("Komponent unmount bo'lganda (ekrandan ketganda) tozalash (cleanup) kodi qayerda yoziladi?", ["useEffect ning return funksiyasida", "useState da", "catch blokida", "finally da"], 0),
          Q("Kursning barcha 10 ta darsini to'liq o'zlashtirgan o'quvchi nima oladi?", ["Hech narsa", "InnoCode.uz tomonidan tasdiqlangan rasmiy elektron QR-kodli sertifikat", "Faqat tabriknoma", "Kitob"], 1)
        ]
      }
    ]
  },
  {
    title: "Java va Android Dasturlash",
    description: "Katta va xavfsiz tizimlar hamda Android mobil ilovalar yaratishni o'rganing.",
    hash: "java",
    lessons: [
      {
        order_num: 1,
        title: "Java ga kirish va Sintaksis asoslari",
        description: "JVM, JRE, JDK, asosiy metod (main), tizimga chiqarish va sintaksis.",
        video_url: "https://www.youtube.com/embed/eIrMbAQSU34",
        duration_mins: 32,
        content_text: `📌 1-Dars: Java arxitekturasi (JVM, JRE, JDK), public static void main va konsol.`,
        quiz: [
          Q("Java dasturlari qaysi shior bilan mashhur?", ["Read Once, Write Everywhere", "Write Once, Run Anywhere (WORA)", "Fast and Furious", "Simple and Clean"], 1),
          Q("Java baytkodini mashina kodiga o'girib ishga tushiruvchi virtual mashina qaysi?", ["JDK", "JVM (Java Virtual Machine)", "JRE", "IDE"], 1),
          Q("Dasturning boshlang'ich nuqtasi (entry point) qaysi metod hisoblanadi?", ["start()", "run()", "public static void main(String[] args)", "init()"], 2),
          Q("Konsolga yangi qator bilan ma'lumot chiqarish kodi qaysi?", ["print()", "System.out.println()", "Console.write()", "echo()"], 1),
          Q("Java fayllari qanday kengaytma bilan saqlanadi?", [".class", ".java", ".jar", ".jvm"], 1),
          Q("Har bir buyruq (operator) oxirida qaysi belgi qo'yilishi shart?", [":", "; (nuqtali vergul)", ".", "hech narsa"], 1),
          Q("Java da sinf nomi bilan fayl nomi qanday bo'lishi kerak?", ["Har xil bo'lishi mumkin", "Bir xil bo'lishi shart", "Kichik harfda bo'lishi shart", "Fayl nomi raqam bo'lishi kerak"], 1),
          Q("Java da bir qatorli izoh qanday belgilanadi?", ["#", "//", "<!-- -->", "--"], 1),
          Q("JDK nimani anglatadi?", ["Java Development Kit", "Java Device Kernel", "Java Data Knowledge", "Java Design Key"], 0),
          Q("Java qanday tipli dasturlash tili?", ["Dinamik tipli", "Kuchli statik tipli (strongly statically typed)", "Faqat skript tili", "Belgilash tili"], 1)
        ]
      },
      {
        order_num: 2,
        title: "O'zgaruvchilar, Primitiv tiplar va Operatorlar",
        description: "byte, short, int, long, float, double, char, boolean va kasting.",
        video_url: "https://www.youtube.com/embed/grEKMHGYyns",
        duration_mins: 30,
        content_text: `📌 2-Dars: Primitiv turlar, xotira hajmlari va arifmetik operatorlar.`,
        quiz: [
          Q("Java da nechta primitiv ma'lumot turi mavjud?", ["4 ta", "8 ta", "10 ta", "12 ta"], 1),
          Q("Butun sonlar uchun eng ko'p ishlatiladigan standart tip qaysi?", ["short", "int", "byte", "long"], 1),
          Q("Haqiqiy (o'nli) sonlar uchun standart tip qaysi?", ["float", "double", "decimal", "real"], 1),
          Q("Bitta belgini (character) saqlovchi tip qaysi?", ["string", "char", "letter", "symbol"], 1),
          Q("Mantiqiy qiymat saqlovchi tip qaysi?", ["bool", "boolean", "binary", "flag"], 1),
          Q("Kichik turni katta turga avtomatik o'tkazish nima deb ataladi?", ["Widening Casting (Implicit)", "Narrowing Casting (Explicit)", "Error casting", "Downcasting"], 0),
          Q("int a = 10; double b = a; qilinsa xato bo'ladimi?", ["Ha, xato", "Yo'q, avtomatik o'tadi", "Faqat kompilyatsiyada", "0 ga aylanadi"], 1),
          Q("O'zgarmas (konstanta) e'lon qilish uchun qaysi kalit so'z ishlatiladi?", ["const", "final", "static", "constant"], 1),
          Q("Matnlar bilan ishlash uchun qaysi sinf ishlatiladi?", ["char[]", "String", "Text", "Sentence"], 1),
          Q("String Java da primitiv turmi yoki havola (reference) turimi?", ["Primitiv", "Havola (Reference/Object) turi", "Ikkisi ham emas", "Maxsus bayt"], 1)
        ]
      },
      {
        order_num: 3,
        title: "Shart operatorlari va Sikllar",
        description: "if-else, switch, for, while va for-each sikllari.",
        video_url: "https://www.youtube.com/embed/WPvGqX-TXP0",
        duration_mins: 34,
        content_text: `📌 3-Dars: Shart operatorlari va takrorlanuvchi amallar.`,
        quiz: [
          Q("Tenglikni tekshirish operatori qaysi?", ["=", "==", "===", "equals"], 1),
          Q("String larni qiymat bo'yicha tengligini tekshirish uchun nima ishlatiladi?", ["==", ".equals() metodi", "===", "compareTo()"], 1),
          Q("for sikli sintaksisi to'g'ri qator qaysi?", ["for (int i=0; i<5; i++)", "for (i in 0..5)", "for i = 1 to 5", "for (let i=0; i<5)"], 0),
          Q("for-each sikli Java da qanday yoziladi?", ["for (item in list)", "for (int num : array)", "foreach (item in list)", "loop (array as item)"], 1),
          Q("Siklni muddatidan oldin to'xtatish operatori qaysi?", ["stop", "break", "exit", "return"], 1),
          Q("Keyingi iteratsiyaga o'tish operatori qaysi?", ["skip", "continue", "next", "pass"], 1),
          Q("do-while siklining o'ziga xosligi nima?", ["Hech qachon ishlamasligi", "Kamida 1 marta shart tekshirilmasdan oldin ishlashi", "Doim cheksiz aylanishi", "Faqat matnlar uchunligi"], 1),
          Q("switch da case tugagach keyingisiga o'tib ketmaslik uchun nima qo'yiladi?", ["stop", "break", "halt", "end"], 1),
          Q("Ternary operator belgisi qaysi?", ["? :", ": ?", "??", "->"], 0),
          Q("Mantiqiy 'VA' operatori qaysi?", ["and", "&&", "&", "AND"], 1)
        ]
      },
      {
        order_num: 4,
        title: "Massivlar (Arrays) va Metodlar",
        description: "Bir va ko'p o'lchovli massivlar, metodlar yaratish, parametr va qaytish turi.",
        video_url: "https://www.youtube.com/embed/VHbSopMyc4M",
        duration_mins: 35,
        content_text: `📌 4-Dars: Massivlar, metodlar yaratish va return qiymatlari.`,
        quiz: [
          Q("5 ta butun sonli massiv qanday e'lon qilinadi?", ["int arr = new int[5];", "int[] arr = new int[5];", "Array arr = new Array(5);", "int arr[5];"], 1),
          Q("Massivning birinchi elementi indeksi nechadan boshlanadi?", ["1", "0", "-1", "ixtiyoriy"], 1),
          Q("Massiv uzunligini bilish xususiyati qaysi?", [".length", ".size()", ".count()", ".len"], 0),
          Q("Hech narsa qaytarmaydigan metodning qaytish turi nima deb ko'rsatiladi?", ["null", "empty", "void", "none"], 2),
          Q("Metodlarni bitta sinf ichida bir xil nom bilan har xil parametrlar orqali qayta yozish nima deyiladi?", ["Overriding", "Overloading (Haddan tashqari yuklash)", "Hiding", "Shadowing"], 1),
          Q("Massiv chegarasidan tashqariga chiqilganda qanday xato bo'ladi?", ["NullPointerException", "ArrayIndexOutOfBoundsException", "ClassCastException", "ArithmeticException"], 1),
          Q("Metoddan qiymat qaytarish kalit so'zi qaysi?", ["give", "send", "return", "back"], 2),
          Q("Ikki o'lchovli massiv qanday e'lon qilinadi?", ["int[][] matrix = new int[3][3];", "int[,] matrix = new int[3,3];", "Array2D matrix;", "int[2] matrix;"], 0),
          Q("static metodning xususiyati nima?", ["Obyekt yaratmasdan sinf nomi orqali chaqirilishi mumkin", "Hech qachon chaqirib bo'lmaydi", "Faqat bir marta ishlaydi", "Faqat sonlar bilan ishlaydi"], 0),
          Q("Metodga uzatiladigan qiymatlar nima deyiladi?", ["Argumentlar / Parametrlar", "Kolleksiyalar", "Xotiralar", "Teglar"], 0)
        ]
      },
      {
        order_num: 5,
        title: "OOP Asoslari: Sinf (Class) va Obyekt (Object)",
        description: "Klasslar, obyektlar, konstruktor, this kalit so'zi va xotira boshqaruvi.",
        video_url: "https://www.youtube.com/embed/A74TOX803D0",
        duration_mins: 38,
        content_text: `📌 5-Dars: Klasslar, obyekt yaratish, konstruktorlar va this.`,
        quiz: [
          Q("Klassdan yangi obyekt nusxasi qaysi kalit so'z bilan yaratiladi?", ["make", "create", "new", "init"], 2),
          Q("Konstruktor qachon ishga tushadi?", ["Metod chaqirilganda", "Yangi obyekt (new) yaratilayotganda", "Dastur tugaganda", "Xato bo'lganda"], 1),
          Q("Konstruktor nomi qanday bo'lishi shart?", ["Sinf nomi bilan bir xil", "init bo'lishi shart", "main bo'lishi shart", "ixtiyoriy"], 0),
          Q("Konstruktor qaytish turiga (return type) egami?", ["Ha, void", "Ha, int", "Yo'q, hech qanday qaytish turi ko'rsatilmaydi", "Ha, Object"], 2),
          Q("'this' kalit so'zi nimani anglatadi?", ["Ota sinfni", "Joriy obyektning o'zini", "Statik maydonni", "Global paketni"], 1),
          Q("Obyektlar Java xotirasining qaysi qismida saqlanadi?", ["Stack", "Heap", "Registers", "Cache"], 1),
          Q("Keraksiz xotirani avtomatik tozalovchi tizim qanday nomlanadi?", ["Garbage Collector (GC)", "Memory Eraser", "Deleter", "AutoCleaner"], 0),
          Q("Agar dasturchi konstruktor yozmasa nima sodir bo'ladi?", ["Xatolik chiqadi", "Kompilyator standart bo'sh (default) konstruktor yaratadi", "Obyekt yaratib bo'lmaydi", "Hech narsa"], 1),
          Q("Sinf maydonlari (fields) nima?", ["Sinf o'zgaruvchilari (xususiyatlari)", "Faqat metodlar", "Paket nomi", "Konsol"], 0),
          Q("null qiymatga ega o'zgaruvchi metodiga murojaat qilinsa nima yuz beradi?", ["0 qaytadi", "NullPointerException", "IndexError", "Dastur davom etadi"], 1)
        ]
      },
      {
        order_num: 6,
        title: "Vorislik (Inheritance) va Polimorfizm",
        description: "extends, super, Method Overriding va dinamik polimorfizm.",
        video_url: "https://www.youtube.com/embed/xk4_1vDrzzo",
        duration_mins: 40,
        content_text: `📌 6-Dars: Vorislik, voris sinflar, super va metodlarni qayta aniqlash.`,
        quiz: [
          Q("Boshqa sinfdan meros (vorislik) olish kalit so'zi qaysi?", ["implements", "inherits", "extends", "super"], 2),
          Q("Java da sinf birdaniga bir nechta sinfdan to'g'ridan-to'g'ri meros ola oladimi?", ["Ha", "Yo'q, faqat bitta sinfdan (Multiple inheritance yo'q)", "Faqat 2 tadan", "Xohlagancha"], 1),
          Q("Ota sinf konstruktori yoki metodini chaqirish uchun nima ishlatiladi?", ["parent", "super", "base", "root"], 1),
          Q("Ota sinfdagi metodni bola sinfda qayta aniqlash nima deyiladi?", ["Method Overloading", "Method Overriding", "Method Hiding", "Casting"], 1),
          Q("Overriding qilingan metod tepasiga qaysi annotatsiya qo'yiladi?", ["@Override", "@Parent", "@NewMethod", "@Inherited"], 0),
          Q("Barcha Java sinflarining boshlang'ich ota sinfi (root class) qaysi?", ["Main", "Object", "System", "Root"], 1),
          Q("Sinfdan meros olinishini taqiqlash uchun qaysi so'z ishlatiladi?", ["private", "final", "static", "sealed"], 1),
          Q("Polimorfizm nimani anglatadi?", ["Bir obyektning turli shakllarda harakat qila olish qobiliyati", "Faqat bitta turda ishlash", "Kodni ko'paytirish", "Xotirani tozalash"], 0),
          Q("instanceof operatori nima qiladi?", ["Obyekt ma'lum sinfga tegishli ekanligini tekshiradi", "Yangi obyekt yaratadi", "Obyektni o'chiradi", "Nusxa oladi"], 0),
          Q("private a'zolar bola sinfga to'g'ridan-to'g'ri o'tadimi?", ["Ha", "Yo'q, faqat public va protected a'zolar o'tadi", "Faqat statik bo'lsa", "Doim"], 1)
        ]
      },
      {
        order_num: 7,
        title: "Inkapsulyatsiya va Abstraksiya",
        description: "private, public, protected, Getter va Setter, abstract sinflar va interface.",
        video_url: "https://www.youtube.com/embed/ZBalWWHYFQc",
        duration_mins: 38,
        content_text: `📌 7-Dars: Kirish huquqlari (access modifiers), getter/setter, abstract va interfeyslar.`,
        quiz: [
          Q("Faqat o'z sinfi ichidagina ko'rinadigan o'zgartirgich qaysi?", ["public", "protected", "private", "default"], 2),
          Q("Barcha paket va sinflar uchun ochiq kirish darajasi qaysi?", ["public", "private", "protected", "final"], 0),
          Q("Xususiy (private) maydonlarga xavfsiz qiymat berish va olish metodlari nima deyiladi?", ["Read va Write", "Getter va Setter", "Input va Output", "Start va Stop"], 1),
          Q("Abstrakt sinf yaratish kalit so'zi qaysi?", ["virtual", "abstract", "interface", "draft"], 1),
          Q("Abstrakt sinfdan 'new' orqali to'g'ridan-to'g'ri obyekt yaratish mumkinmi?", ["Ha", "Yo'q, undan faqat meros olish mumkin", "Faqat bir marta", "Doim"], 1),
          Q("Interfeys (interface) ni sinfga tatbiq etish (ulash) kalit so'zi qaysi?", ["extends", "implements", "uses", "connects"], 1),
          Q("Sinf bir vaqtning o'zida bir nechta interfeysni implements qila oladimi?", ["Ha, bir nechta interfeys mumkin", "Yo'q, faqat bitta", "Faqat 2 ta", "Mumkin emas"], 0),
          Q("Interfeys ichidagi metodlar sukut bo'yicha qanday hisoblanadi?", ["private", "public abstract", "protected", "final"], 1),
          Q("protected modifikatori qayerda ko'rinadi?", ["Faqat sinfda", "O'z paketi va bola (meros olgan) sinflarda", "Hamma joyda", "Hech qayerda"], 1),
          Q("Inkapsulyatsiyaning bosh maqsadi nima?", ["Ma'lumotlar yaxlitligini ta'minlash va noto'g'ri o'zgarishlardan himoyalash", "Tezlikni 10 barobar oshirish", "Rang berish", "Grafika chizish"], 0)
        ]
      },
      {
        order_num: 8,
        title: "Kolleksiyalar: ArrayList va HashMap",
        description: "Java Collections Framework, List, Set, Map, ArrayList va HashMap bilan ishlash.",
        video_url: "https://www.youtube.com/embed/fis26HvvDII",
        duration_mins: 42,
        content_text: `📌 8-Dars: Dinamik massivlar (ArrayList) va kalit-qiymatli xaritalar (HashMap).`,
        quiz: [
          Q("Oddiy massivdan ArrayList ning asosiy afzalligi nima?", ["Hajmi dinamik o'zgaradi (avtomatik kattalashadi)", "Faqat son saqlaydi", "Tezroq kompilyatsiya bo'ladi", "O'zgarmasdir"], 0),
          Q("ArrayList ga element qo'shish metodi qaysi?", ["push()", "add()", "append()", "insert()"], 1),
          Q("ArrayList dan elementni o'chirish metodi qaysi?", ["delete()", "remove()", "pop()", "clear()"], 1),
          Q("Kalit va qiymat (Key-Value) juftligini saqlovchi kolleksiya qaysi?", ["ArrayList", "LinkedList", "HashMap", "HashSet"], 2),
          Q("HashMap ga ma'lumot kiritish metodi qaysi?", ["add()", "put()", "insert()", "set()"], 1),
          Q("HashMap dan kalit bo'yicha qiymat olish metodi qaysi?", ["get()", "find()", "fetch()", "select()"], 0),
          Q("Takrorlanmas (unikal) elementlarni saqlovchi kolleksiya qaysi?", ["ArrayList", "HashSet", "HashMap", "Vector"], 1),
          Q("ArrayList uzunligini (elementlar sonini) aniqlovchi metod qaysi?", [".length", ".size()", ".count()", ".capacity()"], 1),
          Q("Generics (<String>) nima uchun ishlatiladi?", ["Xotirani ko'paytirish", "Kolleksiyada saqlanadigan ma'lumot turini qat'iy belgilash (Type safety)", "Animatsiya", "Dizayn"], 1),
          Q("Kolleksiyadagi barcha elementlarni tozalash metodi qaysi?", ["remove()", "clear()", "reset()", "empty()"], 1)
        ]
      },
      {
        order_num: 9,
        title: "Android Studio ga kirish va XML Layout",
        description: "Android Studio muhiti, loyiha tuzilishi, XML teglari, TextView, Button, EditText.",
        video_url: "https://www.youtube.com/embed/u-HOEUo2Dbc",
        duration_mins: 45,
        content_text: `📌 9-Dars: Android ilovalar strukturasi, XML interfeys va View elementlari.`,
        quiz: [
          Q("Android ilovalarining vizual dizayni asosan qaysi tilda yaratiladi?", ["HTML", "XML", "CSS", "Python"], 1),
          Q("Android ilovalari konfiguratsiyasi va ruxsatlari qaysi faylda yoziladi?", ["AndroidManifest.xml", "build.gradle", "strings.xml", "styles.xml"], 0),
          Q("Ekranga matn chiqarish uchun qaysi View komponenti ishlatiladi?", ["ImageView", "TextView", "Button", "EditText"], 1),
          Q("Foydalanuvchidan matn kiritishni qabul qilish komponenti qaysi?", ["TextView", "EditText", "InputView", "TextBox"], 1),
          Q("Elementlarni bir qatorga gorizontal yoki vertikal joylashtiruvchi layout qaysi?", ["RelativeLayout", "LinearLayout", "FrameLayout", "ConstraintLayout"], 1),
          Q("Android da zamonaviy moslashuvchan asosiy layout qaysi?", ["ConstraintLayout", "AbsoluteLayout", "TableLayout", "GridLayout"], 0),
          Q("View elementiga unikal identifikator berish atributi qaysi?", ["android:name", "android:id=\"@+id/...\"", "android:tag", "android:key"], 1),
          Q("Kenglikni ota konteynerga moslashtirish qiymati qaysi?", ["wrap_content", "match_parent", "fill_all", "expand"], 1),
          Q("Kenglikni faqat ichidagi kontent sig'adigan hajmga moslashtirish qaysi?", ["match_parent", "wrap_content", "fixed_size", "auto"], 1),
          Q("Loyihaning kutubxonalari va qaramliklarini boshqaruvchi tizim qaysi?", ["Maven", "Gradle (build.gradle)", "Ant", "NPM"], 1)
        ]
      },
      {
        order_num: 10,
        title: "Android da Activity va Interaktiv dastur yaratish",
        description: "Activity hayot sikli (Lifecycle), findViewById, OnClickListener va yakuniy mobil loyiha.",
        video_url: "https://www.youtube.com/embed/EE1-Wf12XEQ",
        duration_mins: 48,
        content_text: `📌 10-Dars: Activity hayot sikli, interaktiv hodisalar, Intent va kurs xulosasi.`,
        quiz: [
          Q("Android da bitta ekran va uning mantiqiy kodi nima deb ataladi?", ["Screen", "Page", "Activity", "Window"], 2),
          Q("Activity ishga tushganda birinchi chaqiriladigan metod qaysi?", ["onStart()", "onResume()", "onCreate()", "onInit()"], 2),
          Q("Java kodida XML elementini ID bo'yicha topish metodi qaysi?", ["findViewById(R.id....)", "getElement(R.id....)", "findView()", "getXmlById()"], 0),
          Q("Tugma bosilishini ushlash tinglovchisi qaysi?", ["setOnClickListener", "setOnTouchListener", "setOnHoverListener", "setOnHitListener"], 0),
          Q("Ekranga vaqtinchalik kichik xabar chiqarish nima deb ataladi?", ["Alert", "Toast", "Dialog", "Popup"], 1),
          Q("Bitta Activity dan ikkinchisiga o'tish vositasi qaysi?", ["Intent", "Transfer", "Router", "Link"], 0),
          Q("Activity ning setContentView(R.layout.activity_main) kodi nima qiladi?", ["Aktivitiga XML dizayn faylini biriktiradi", "Rangini o'zgartiradi", "Dasturni yopadi", "Baza ulaydi"], 0),
          Q("Activity hayot siklining (Lifecycle) bosqichlari to'g'ri qator qaysi?", ["onCreate -> onStart -> onResume", "onStart -> onCreate -> onDestroy", "onResume -> onCreate", "start -> run -> finish"], 0),
          Q("Android o'rnatish paketining fayl kengaytmasi nima?", [".exe", ".apk / .aab", ".jar", ".dmg"], 1),
          Q("Kursning barcha 10 ta darsini to'liq o'zlashtirgan o'quvchi nima oladi?", ["Hech narsa", "InnoCode.uz tomonidan tasdiqlangan rasmiy elektron QR-kodli sertifikat", "Faqat tabriknoma", "Ruxsat"], 1)
        ]
      }
    ]
  }
];

// Har bir dars uchun 5 tadan test savolini ta'minlash
COURSES_DATA.forEach(c => {
  c.lessons.forEach(l => {
    if (l.quiz && l.quiz.length > 5) {
      l.quiz = l.quiz.slice(0, 5);
    }
  });
});

module.exports = COURSES_DATA;

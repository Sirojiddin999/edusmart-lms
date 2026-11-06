// cyber-uz — Kiberxavfsizlik kurslari: 3 ta kurs, har birida 10 ta dars, har bir darsda 5 ta test savoli
const Q = (q, opts, a) => ({ q, opts, a });

const YT = (id) => `https://www.youtube.com/embed/${id}`;
// Kiberxavfsizlik bo'yicha ochiq (YouTube) video darslar
const V_INTRO = YT('9HOpanT0GRs');   // Introduction to Cybersecurity (CS50)
const V_HANDS = YT('ug8W0sFiVJo');   // Hands-On Cybersecurity and Ethical Hacking
const V_LINUX = YT('coQ5dg8wM2o');   // Linux for Ethical Hackers (Kali Linux)
const V_ETHIC = YT('3Kq1MIfTWCE');   // Ethical Hacking (practical course)

function lesson(n, title, description, video_url, duration_mins, notes, quiz) {
  return {
    order_num: n,
    title,
    description,
    video_url,
    duration_mins,
    content_text: `📌 ${n}-Dars Konspekti:\n` + notes.map((t, i) => `${i + 1}. ${t}`).join('\n'),
    quiz
  };
}

const COURSES_DATA = [
  // ───────────────────────── 1-KURS ─────────────────────────
  {
    title: "Kiberxavfsizlik Asoslari va Axborot Himoyasi",
    description: "Kiberxavfsizlik olamiga kirish: tahdidlar, zararli dasturlar, fishing, parollar, kriptografiya va shaxsiy ma'lumotlarni himoya qilish.",
    hash: "kiberxavfsizlik",
    lessons: [
      lesson(1, "Kiberxavfsizlikka kirish va CIA triadasi",
        "Kiberxavfsizlik nima, nima uchun muhim va axborot xavfsizligining uch asosiy tamoyili.",
        V_INTRO, 30,
        [
          "Kiberxavfsizlik — kompyuter, tarmoq, dastur va ma'lumotlarni ruxsatsiz kirish va zarar yetkazishdan himoya qilish amaliyoti.",
          "CIA triadasi: Confidentiality (maxfiylik), Integrity (yaxlitlik), Availability (mavjudlik).",
          "Maxfiylik — ma'lumotni faqat ruxsat etilgan shaxslar ko'ra oladi (shifrlash, kirish nazorati).",
          "Yaxlitlik — ma'lumot ruxsatsiz o'zgartirilmaydi (xesh, raqamli imzo).",
          "Mavjudlik — tizim kerak paytda ishlaydi (zaxira nusxa, DDoS dan himoya).",
          "Tahdid (threat), zaiflik (vulnerability) va xavf (risk) — bir-biridan farq qiluvchi tushunchalar."
        ],
        [
          Q("CIA triadasidagi «C» harfi nimani anglatadi?", ["Control (nazorat)", "Confidentiality (maxfiylik)", "Cloud (bulut)", "Code (kod)"], 1),
          Q("Ma'lumotning ruxsatsiz o'zgartirilmasligi qaysi tamoyilga kiradi?", ["Maxfiylik", "Mavjudlik", "Yaxlitlik", "Anonimlik"], 2),
          Q("DDoS hujumi asosan qaysi tamoyilga zarba beradi?", ["Mavjudlik (Availability)", "Maxfiylik", "Yaxlitlik", "Hech qaysisiga"], 0),
          Q("Tizimdagi kamchilik (masalan, yamoqsiz dastur) nima deyiladi?", ["Tahdid", "Zaiflik (vulnerability)", "Himoya", "Protokol"], 1),
          Q("Kiberxavfsizlikning asosiy maqsadi nima?", ["Internet tezligini oshirish", "Axborot va tizimlarni himoya qilish", "Dastur yozishni tezlashtirish", "Reklama qilish"], 1)
        ]),
      lesson(2, "Kiberhujum turlari va hujum vektorlari",
        "Eng ko'p uchraydigan kiberhujumlar, hujumchilar turlari va hujum bosqichlari.",
        V_INTRO, 28,
        [
          "Hujum vektori — hujumchi tizimga kirish uchun foydalanadigan yo'l (email, USB, zaif dastur, zaif parol).",
          "Hujumchilar: black hat (jinoyatchi), white hat (etik xaker), gray hat (oraliq), script kiddie (tayyor vositalardan foydalanuvchi).",
          "Keng tarqalgan hujumlar: fishing, malware, DDoS, Man-in-the-Middle, SQL injection, brute force.",
          "Cyber Kill Chain: razvedka → qurollantirish → yetkazish → ekspluatatsiya → o'rnatish → boshqaruv → maqsad.",
          "Ichki tahdid (insider threat) — tashkilot xodimi tomonidan yetkaziladigan xavf.",
          "APT — uzoq muddatli, maqsadli va murakkab hujumlar."
        ],
        [
          Q("Hujumchi tizimga kirish uchun foydalanadigan yo'l nima deyiladi?", ["Hujum vektori", "Firewall", "Yamoq", "Sertifikat"], 0),
          Q("«White hat» xaker kim?", ["Ruxsatsiz buzuvchi jinoyatchi", "Ruxsat bilan tizim xavfsizligini tekshiruvchi mutaxassis", "Reklama agenti", "Virus yaratuvchi"], 1),
          Q("DDoS hujumining maqsadi nima?", ["Parolni topish", "Xizmatni ishdan chiqarish", "Faylni shifrlash", "Rasm o'zgartirish"], 1),
          Q("Man-in-the-Middle hujumida hujumchi nima qiladi?", ["Ikki tomon orasidagi trafikni ushlab turadi", "Faqat kompyuterni o'chiradi", "Elektr uzadi", "Monitorni buzadi"], 0),
          Q("Tashkilot ichidagi xodim keltirib chiqargan xavf qanday ataladi?", ["Insider threat", "Botnet", "Spoofing", "Sandbox"], 0)
        ]),
      lesson(3, "Zararli dasturlar: virus, troyan va ransomware",
        "Malware turlari, ularning tarqalish yo'llari va himoyalanish usullari.",
        V_INTRO, 32,
        [
          "Malware — zarar yetkazish maqsadida yaratilgan dasturlar umumiy nomi.",
          "Virus — boshqa fayllarga yopishib tarqaladi; qurt (worm) — o'zi mustaqil tarqaladi.",
          "Troyan — foydali dastur niqobidagi zararli kod.",
          "Ransomware — fayllarni shifrlab, ochish uchun to'lov talab qiladi.",
          "Spyware, keylogger — foydalanuvchi ma'lumotlari va bosilgan tugmalarni yashirincha yig'adi.",
          "Himoya: antivirus, yangilanishlar, noma'lum fayllarni ochmaslik, 3-2-1 zaxira qoidasi."
        ],
        [
          Q("Fayllarni shifrlab, to'lov talab qiladigan zararli dastur qaysi?", ["Spyware", "Ransomware", "Adware", "Rootkit"], 1),
          Q("Foydali dastur niqobida yashiringan zararli kod nima deyiladi?", ["Troyan", "Firewall", "Proksi", "Kuki"], 0),
          Q("Bosilgan tugmalarni yashirincha yozib oluvchi dastur nima?", ["Keylogger", "Compiler", "Browser", "Driver"], 0),
          Q("O'zi mustaqil, tarmoq orqali tarqaladigan zararli dastur qaysi?", ["Qurt (worm)", "Brauzer", "Sertifikat", "Router"], 0),
          Q("Ransomware dan himoyalanishning eng ishonchli usullaridan biri qaysi?", ["Muntazam oflayn zaxira nusxa olish", "Parolni hammaga aytish", "Antivirusni o'chirish", "Barcha havolalarni ochish"], 0)
        ]),
      lesson(4, "Fishing va ijtimoiy muhandislik",
        "Insonni aldash orqali amalga oshiriladigan hujumlar va ulardan himoyalanish.",
        V_INTRO, 30,
        [
          "Ijtimoiy muhandislik — texnik zaiflik emas, balki insonning ishonuvchanligidan foydalanish.",
          "Fishing — soxta xat, sayt yoki SMS orqali login-parol va karta ma'lumotlarini o'g'irlash.",
          "Spear phishing — aniq shaxsga mo'ljallangan, shaxsiylashtirilgan fishing.",
          "Vishing (telefon) va Smishing (SMS) — fishingning boshqa ko'rinishlari.",
          "Belgilar: shoshiltirish, qo'rqitish, xato domen (micros0ft.com), umumiy murojaat va shubhali ilova.",
          "Himoya: havolani bosishdan oldin manzilni tekshirish, ikki bosqichli tasdiqlash, shubhali xabarni xabar qilish."
        ],
        [
          Q("Fishing hujumining asosiy maqsadi nima?", ["Internetni tezlashtirish", "Foydalanuvchi ma'lumotlarini aldov orqali o'g'irlash", "Kompyuterni tozalash", "Dastur yangilash"], 1),
          Q("Aniq bir shaxsga mo'ljallangan fishing qanday ataladi?", ["Spear phishing", "Oddiy spam", "Sniffing", "Port skanerlash"], 0),
          Q("SMS orqali amalga oshiriladigan fishing nima deyiladi?", ["Vishing", "Smishing", "Phreaking", "Cloning"], 1),
          Q("Quyidagilardan qaysi biri fishing xatining belgisi?", ["«Hisobingiz 1 soatda bloklanadi, zudlik bilan bosing!»", "Rasmiy domendan kelgan oddiy xabar", "Tanish hamkasbning ish yuzasidan xati", "Hech qanday havolasi yo'q xat"], 0),
          Q("Shubhali xatga duch kelganda nima qilish kerak?", ["Havolani darhol bosish", "Ma'lumot kiritish", "Manzilni tekshirib, shubhali bo'lsa xabar berish va o'chirish", "Hammaga yuborish"], 2)
        ]),
      lesson(5, "Parollar xavfsizligi va ko'p faktorli autentifikatsiya",
        "Kuchli parol yaratish, parol menejerlari va MFA/2FA.",
        V_INTRO, 28,
        [
          "Kuchli parol: kamida 12–16 belgi, katta-kichik harf, raqam va belgilar yoki uzun parol-ibora (passphrase).",
          "Bir xil parolni bir nechta saytda ishlatmang — credential stuffing hujumi xavfi.",
          "Parol menejeri (Bitwarden, KeePass) noyob murakkab parollarni xavfsiz saqlaydi.",
          "MFA/2FA: bilasiz (parol) + egasiz (telefon, token) + siz o'zingiz (barmoq izi).",
          "Brute force — barcha kombinatsiyalarni sinash; lug'at hujumi — mashhur parollar ro'yxati.",
          "Parollar bazada oddiy matn emas, tuzlangan (salt) xesh ko'rinishida saqlanishi kerak."
        ],
        [
          Q("Qaysi parol eng xavfsiz hisoblanadi?", ["123456", "password", "Qizil-Olma_Toshkent#2026!", "qwerty"], 2),
          Q("MFA/2FA nimani ta'minlaydi?", ["Faqat parolni uzaytiradi", "Parol o'g'irlansa ham hisobni qo'shimcha qatlam bilan himoya qiladi", "Internetni tezlashtiradi", "Parolni o'chiradi"], 1),
          Q("Barcha mumkin bo'lgan kombinatsiyalarni sinab ko'rish hujumi qanday ataladi?", ["Brute force", "Phishing", "Sniffing", "Spoofing"], 0),
          Q("Parol menejerining asosiy vazifasi nima?", ["Parollarni xavfsiz saqlash va noyob parollar yaratish", "Videolarni yuklash", "Antivirus o'rnatish", "Internetni tezlashtirish"], 0),
          Q("Parollar bazada qanday saqlanishi to'g'ri?", ["Oddiy matn sifatida", "Tuz (salt) bilan xeshlangan holda", "Faqat Excelda", "Brauzer sarlavhasida"], 1)
        ]),
      lesson(6, "Kriptografiya asoslari: shifrlash va xeshlash",
        "Simmetrik va asimmetrik shifrlash, xesh funksiyalar va raqamli imzo.",
        V_INTRO, 34,
        [
          "Kriptografiya — ma'lumotni maxfiy saqlash, yaxlitligini va muallifligini tasdiqlash fani.",
          "Simmetrik shifrlash (AES): shifrlash va ochishda bitta kalit ishlatiladi — tez.",
          "Asimmetrik shifrlash (RSA, ECC): ochiq (public) va yopiq (private) kalit juftligi.",
          "Xesh funksiya (SHA-256): ma'lumotdan qaytarib bo'lmaydigan qisqa «barmoq izi» yaratadi.",
          "Raqamli imzo — yopiq kalit bilan imzolanib, ochiq kalit bilan tekshiriladi.",
          "MD5 va SHA-1 eskirgan va xavfsiz emas; zamonaviy standart — SHA-256 va undan yuqori."
        ],
        [
          Q("AES qanday turdagi shifrlash algoritmi?", ["Simmetrik", "Asimmetrik", "Xesh funksiya", "Raqamli imzo"], 0),
          Q("Asimmetrik shifrlashda nechta kalit ishlatiladi?", ["Bitta", "Ikkita (ochiq va yopiq)", "Uchta", "Kalit kerak emas"], 1),
          Q("Xesh funksiyaning asosiy xususiyati qaysi?", ["Natijadan asl ma'lumotni qaytarib bo'lmaydi", "Har doim ma'lumotni qaytaradi", "Faqat rasmlar bilan ishlaydi", "Internet talab qiladi"], 0),
          Q("Quyidagilardan qaysi biri hozirda xavfsiz deb hisoblanadi?", ["MD5", "SHA-1", "SHA-256", "Caesar shifri"], 2),
          Q("Raqamli imzo nimani tasdiqlaydi?", ["Faqat fayl hajmini", "Muallifni va ma'lumot yaxlitligini", "Kompyuter tezligini", "Brauzer turini"], 1)
        ]),
      lesson(7, "Operatsion tizimlar xavfsizligi",
        "Windows va Linux tizimlarini mustahkamlash, yangilanishlar va foydalanuvchi huquqlari.",
        V_INTRO, 32,
        [
          "Operatsion tizim va dasturlarni doimiy yangilab turish — ma'lum zaifliklarni yopadi.",
          "Minimal huquqlar tamoyili (Least Privilege): foydalanuvchiga faqat zarur ruxsatlar beriladi.",
          "Kundalik ishlash uchun administrator emas, oddiy foydalanuvchi akkaunti ishlating.",
          "Disk shifrlash: BitLocker (Windows), LUKS (Linux) — noutbuk yo'qolsa ham ma'lumot xavfsiz.",
          "Keraksiz xizmat va portlarni o'chirish tizimning hujum yuzasini (attack surface) kamaytiradi.",
          "Antivirus, o'rnatilgan firewall va audit jurnallari (log) himoya qatlamlarini to'ldiradi."
        ],
        [
          Q("«Least Privilege» tamoyili nimani anglatadi?", ["Foydalanuvchiga faqat zarur huquqlar beriladi", "Hammaga to'liq ruxsat beriladi", "Parol talab qilinmaydi", "Faqat admin kiradi"], 0),
          Q("Tizimni muntazam yangilashning asosiy foydasi nima?", ["Ma'lum zaifliklar yopiladi", "Rang o'zgaradi", "Fayllar ko'payadi", "Internet sekinlashadi"], 0),
          Q("BitLocker nima uchun ishlatiladi?", ["Diskni shifrlash uchun", "Video tahrirlash uchun", "Oyin o'ynash uchun", "Rasm chizish uchun"], 0),
          Q("Hujum yuzasini (attack surface) kamaytirish uchun nima qilinadi?", ["Keraksiz xizmat va portlar o'chiriladi", "Ko'proq dastur o'rnatiladi", "Parol olib tashlanadi", "Firewall o'chiriladi"], 0),
          Q("Kundalik ish uchun qaysi akkaunt xavfsizroq?", ["Doimiy administrator akkaunti", "Cheklangan huquqli oddiy foydalanuvchi akkaunti", "Parolsiz mehmon akkaunt", "Umumiy akkaunt"], 1)
        ]),
      lesson(8, "Xavfsiz internet: VPN, HTTPS va maxfiylik",
        "Brauzerda xavfsiz ishlash, HTTPS, VPN va shaxsiy ma'lumotlar maxfiyligi.",
        V_INTRO, 30,
        [
          "HTTPS — ma'lumotlarni TLS orqali shifrlaydi; manzil satrida qulf belgisi bo'ladi.",
          "Ommaviy Wi-Fi tarmoqlarida trafik ushlanishi mumkin — VPN dan foydalaning.",
          "VPN — trafikni shifrlangan tunnel orqali o'tkazadi va IP manzilni yashiradi.",
          "Cookie va treking — saytlar foydalanuvchi harakatini kuzatadi; maxfiylik sozlamalarini tekshiring.",
          "Ijtimoiy tarmoqlarda shaxsiy ma'lumot (manzil, telefon, hujjatlar) ulashishda ehtiyot bo'ling.",
          "Rasmiy do'kondan tashqari noma'lum manbalardan dastur yuklamang."
        ],
        [
          Q("HTTPS ning HTTP dan asosiy farqi nima?", ["Trafik shifrlanadi", "Tezroq ishlaydi", "Rasmlar chiroyli bo'ladi", "Reklamasiz bo'ladi"], 0),
          Q("Ommaviy Wi-Fi da qaysi vosita xavfsizlikni oshiradi?", ["VPN", "Kamera", "Printer", "Skaner"], 0),
          Q("VPN nima qiladi?", ["Trafikni shifrlaydi va IP manzilni yashiradi", "Kompyuterni tezlashtiradi", "Fayllarni o'chiradi", "Parolni almashtiradi"], 0),
          Q("Dasturni qayerdan yuklash xavfsizroq?", ["Rasmiy sayt yoki rasmiy do'kondan", "Noma'lum torrentdan", "Telegramdagi tasodifiy havoladan", "Reklama bannerdan"], 0),
          Q("Brauzer manzil satridagi qulf belgisi nimani bildiradi?", ["Aloqa shifrlangan (HTTPS)", "Sayt 100% xavfsiz", "Sayt o'chirilgan", "Parol kerak emas"], 0)
        ]),
      lesson(9, "Zaxira nusxa va hodisalarga javob berish",
        "Ma'lumotlarni zaxiralash, tiklash rejasi va kiber hodisaga javob berish bosqichlari.",
        V_INTRO, 28,
        [
          "3-2-1 qoidasi: 3 ta nusxa, 2 xil muhit, 1 tasi boshqa joyda (oflayn/bulut).",
          "Zaxira nusxani muntazam tiklab sinab ko'rish shart — aks holda ishlashiga ishonch yo'q.",
          "Incident Response bosqichlari: tayyorgarlik → aniqlash → cheklash → yo'q qilish → tiklash → xulosalar.",
          "Hodisani tezda aniqlash va izolyatsiya qilish zararni kamaytiradi.",
          "BCP/DRP — biznesni uzluksiz saqlash va falokatdan tiklash rejalari.",
          "Har bir hodisa hujjatlashtirilib, xulosalar kelajakdagi himoyani yaxshilash uchun ishlatiladi."
        ],
        [
          Q("3-2-1 zaxira qoidasidagi «1» nimani bildiradi?", ["1 ta nusxa boshqa joyda (oflayn/bulutda) saqlanadi", "1 ta fayl", "1 ta parol", "1 ta kompyuter"], 0),
          Q("Incident Response ning birinchi bosqichi qaysi?", ["Tayyorgarlik", "Tiklash", "Xulosalar", "Jazolash"], 0),
          Q("Zaxira nusxaning ishlashiga ishonch hosil qilish uchun nima qilinadi?", ["Muntazam tiklab sinab ko'riladi", "Hech narsa qilinmaydi", "Fayl nomi o'zgartiriladi", "Arxivlanadi va unutiladi"], 0),
          Q("Hodisa aniqlangach, zararni kamaytirish uchun darhol nima qilinadi?", ["Zararlangan tizim tarmoqdan izolyatsiya qilinadi", "Parol hammaga yuboriladi", "Tizim yoqib qo'yiladi", "Hech narsa"], 0),
          Q("DRP qisqartmasi nimani bildiradi?", ["Disaster Recovery Plan (falokatdan tiklash rejasi)", "Data Reading Program", "Digital Random Password", "Direct Router Protocol"], 0)
        ]),
      lesson(10, "Kiberhuquq, standartlar va kiberxavfsizlik kasblari",
        "Xalqaro standartlar, qonunchilik asoslari va kiberxavfsizlik sohasidagi karyera yo'llari.",
        V_INTRO, 26,
        [
          "ISO/IEC 27001 — axborot xavfsizligi boshqaruv tizimi (AXBT) bo'yicha xalqaro standart.",
          "NIST Cybersecurity Framework: Identify, Protect, Detect, Respond, Recover.",
          "O'zbekistonda «Kiberxavfsizlik to'g'risida»gi qonun va shaxsga doir ma'lumotlarni himoya qilish qonunchiligi mavjud.",
          "Kasblar: SOC analitik, pentester, xavfsizlik muhandisi, kriminalist, CISO.",
          "Xalqaro sertifikatlar: CompTIA Security+, CEH, OSCP, CISSP.",
          "Etika: faqat yozma ruxsat bilan tekshirish; ruxsatsiz kirish — jinoyat."
        ],
        [
          Q("ISO/IEC 27001 nimaga oid standart?", ["Axborot xavfsizligini boshqarish tizimiga", "Dasturlash tiliga", "Rasm formatiga", "Video kodekka"], 0),
          Q("NIST Framework funksiyalaridan qaysi biri ro'yxatda YO'Q?", ["Identify", "Protect", "Advertise", "Recover"], 2),
          Q("Quyidagilardan qaysi biri xalqaro kiberxavfsizlik sertifikati?", ["CompTIA Security+", "Photoshop CC", "Excel Pro", "IELTS"], 0),
          Q("Tizimni tekshirishdan oldin nima talab qilinadi?", ["Egasidan yozma ruxsat", "Hech narsa kerak emas", "Do'stning roziligi", "Ijtimoiy tarmoqdagi e'lon"], 0),
          Q("SOC analitik asosan nima bilan shug'ullanadi?", ["Xavfsizlik hodisalarini monitoring qilish va tahlil qilish", "Veb sayt dizayni", "Video montaj", "Buxgalteriya"], 0)
        ])
    ]
  },

  // ───────────────────────── 2-KURS ─────────────────────────
  {
    title: "Etik Xakerlik va Penetratsion Testlash",
    description: "Kali Linux, razvedka, Nmap, zaifliklarni baholash, Metasploit va penetratsion test hisobotini tayyorlash bo'yicha amaliy kurs.",
    hash: "etikxakerlik",
    lessons: [
      lesson(1, "Etik xakerlik nima? Huquqiy asoslar va pentest bosqichlari",
        "Etik xakerlik, ruxsat va kelishuv (scope) hamda penetratsion testning asosiy bosqichlari.",
        V_ETHIC, 30,
        [
          "Etik xakerlik — tashkilot ruxsati bilan uning tizimlaridagi zaifliklarni topish va bartaraf etish.",
          "Rules of Engagement va Scope — nimani, qachon va qanday tekshirish mumkinligi yozma kelishiladi.",
          "Pentest bosqichlari: razvedka → skanerlash → ekspluatatsiya → huquqni oshirish → izlarni saqlash → hisobot.",
          "Black-box (ma'lumotsiz), white-box (to'liq ma'lumot) va gray-box (qisman ma'lumot) test turlari.",
          "Ruxsatsiz kirish qonunga xilof va jinoiy javobgarlikka olib keladi.",
          "Mashhur uslubiyatlar: PTES, OSSTMM, OWASP Testing Guide."
        ],
        [
          Q("Etik xakerlikni jinoiy xakerlikdan ajratib turadigan asosiy omil nima?", ["Egasining yozma ruxsati", "Ishlatilgan dastur", "Kompyuter markasi", "Internet tezligi"], 0),
          Q("«Scope» nimani belgilaydi?", ["Tekshiriladigan tizimlar va cheklovlar doirasini", "Xaker ismini", "Dastur rangini", "Narxni"], 0),
          Q("Tizim haqida hech qanday ma'lumotsiz o'tkaziladigan test qanday ataladi?", ["Black-box", "White-box", "Gray-box", "Blue-box"], 0),
          Q("Quyidagilardan qaysi biri pentest bosqichi EMAS?", ["Razvedka", "Skanerlash", "Hisobot", "Reklama kampaniyasi"], 3),
          Q("PTES nima?", ["Penetration Testing Execution Standard", "Python Test Engine System", "Public Test Email Service", "Private Terminal Encryption Standard"], 0)
        ]),
      lesson(2, "Kali Linux va terminal bilan ishlash",
        "Kali Linux o'rnatish, virtual muhit va asosiy terminal buyruqlari.",
        V_LINUX, 34,
        [
          "Kali Linux — xavfsizlik testlari uchun 600 dan ortiq vositaga ega Debian asosidagi tizim.",
          "Virtual mashina (VirtualBox/VMware) ichida o'rnatish xavfsiz va qulay laboratoriya yaratadi.",
          "Asosiy buyruqlar: ls, cd, pwd, cat, grep, find, chmod, sudo.",
          "Fayl ruxsatlari: r (o'qish), w (yozish), x (bajarish) — chmod 755 kabi raqamli ko'rinishda.",
          "Paket menejeri: apt update && apt install <paket>.",
          "Faqat o'z laboratoriyangizda yoki ruxsat berilgan muhitda mashq qiling."
        ],
        [
          Q("Kali Linux nima uchun mo'ljallangan?", ["Xavfsizlik testi va pentest uchun", "Faqat o'yin uchun", "Faqat ofis ishlari uchun", "Telefon uchun"], 0),
          Q("Joriy papka yo'lini ko'rsatuvchi buyruq qaysi?", ["pwd", "cat", "grep", "mv"], 0),
          Q("Fayl ichidan matn qidirish uchun qaysi buyruq ishlatiladi?", ["grep", "pwd", "sudo", "apt"], 0),
          Q("Linuxda paketlarni o'rnatish uchun nima ishlatiladi?", ["apt install", "run install", "make cake", "open pkg"], 0),
          Q("Mashq qilish uchun eng xavfsiz muhit qaysi?", ["O'z virtual laboratoriyasi", "Birovning serveri", "Maktab serveri", "Bank sayti"], 0)
        ]),
      lesson(3, "Razvedka: OSINT va footprinting",
        "Ochiq manbalardan nishon haqida ma'lumot yig'ish usullari.",
        V_ETHIC, 30,
        [
          "Razvedka (Reconnaissance) — hujumdan oldin nishon haqida ma'lumot yig'ish bosqichi.",
          "Passiv razvedka — nishon bilan bevosita aloqa qilmasdan (Google, WHOIS, ijtimoiy tarmoq).",
          "Aktiv razvedka — nishon bilan bevosita aloqa (port skanerlash, ping).",
          "OSINT vositalari: Google Dorks, Shodan, theHarvester, Maltego, Wayback Machine.",
          "WHOIS va DNS yozuvlari (A, MX, NS, TXT) tashkilot infratuzilmasi haqida ma'lumot beradi.",
          "Subdomenlarni topish hujum yuzasini aniqlashga yordam beradi."
        ],
        [
          Q("OSINT nima?", ["Ochiq manbalardan ma'lumot yig'ish", "Maxfiy serverni buzish", "Parolni tanlash", "Tarmoqni o'chirish"], 0),
          Q("Passiv razvedka qanday amalga oshiriladi?", ["Nishon bilan bevosita bog'lanmasdan", "Port skanerlash orqali", "Zararli dastur yuborib", "Parol tanlab"], 0),
          Q("Qaysi vosita ulangan qurilmalar va ochiq servislarni qidirish uchun mashhur?", ["Shodan", "Paint", "Notepad", "Calculator"], 0),
          Q("Domen egasi haqidagi ro'yxatdan o'tish ma'lumotini qaysi xizmat ko'rsatadi?", ["WHOIS", "FTP", "SSH", "RDP"], 0),
          Q("DNS dagi MX yozuvi nimani bildiradi?", ["Pochta serverini", "Veb saytni", "IP versiyasini", "Parolni"], 0)
        ]),
      lesson(4, "Nmap yordamida tarmoqni skanerlash",
        "Port skanerlash, servis va operatsion tizimni aniqlash.",
        V_ETHIC, 34,
        [
          "Nmap (Network Mapper) — tarmoqdagi hostlar, ochiq portlar va xizmatlarni aniqlovchi vosita.",
          "nmap -sS — SYN (yashirin) skanerlash; nmap -sT — TCP connect skanerlash.",
          "nmap -sV — servis versiyasini, nmap -O — operatsion tizimni aniqlaydi.",
          "nmap -p 1-1000 yoki -p- — port diapazonini tanlash; -A — keng qamrovli skaner.",
          "NSE (Nmap Scripting Engine) skriptlari zaifliklarni avtomatik tekshiradi.",
          "Ruxsatsiz skanerlash qonunga xilof bo'lishi mumkin — faqat ruxsat etilgan nishonlarda ishlating."
        ],
        [
          Q("Nmap nima uchun ishlatiladi?", ["Tarmoq va portlarni skanerlash", "Rasm tahrirlash", "Matn yozish", "Video yuklash"], 0),
          Q("Servis versiyasini aniqlash uchun qaysi parametr ishlatiladi?", ["-sV", "-O", "-p-", "-v6"], 0),
          Q("Operatsion tizimni aniqlash parametri qaysi?", ["-O", "-sV", "-sS", "-Pn"], 0),
          Q("SYN skanerlash qanday ham ataladi?", ["Yashirin (stealth) skanerlash", "Parol skaneri", "Fayl skaneri", "Virus skaneri"], 0),
          Q("NSE nima?", ["Nmap skriptlar mexanizmi", "Network Secure Email", "Node Server Engine", "Network Speed Extension"], 0)
        ]),
      lesson(5, "Zaifliklarni baholash: CVE, CVSS va skanerlar",
        "Zaifliklarni aniqlash, baholash va ustuvorlik berish.",
        V_HANDS, 30,
        [
          "Zaiflik (vulnerability) — dastur yoki tizimdagi xavfsizlik kamchiligi.",
          "CVE — ma'lum zaifliklarning noyob identifikatori (masalan, CVE-2021-44228 — Log4Shell).",
          "CVSS — zaiflik jiddiyligini 0.0 dan 10.0 gacha baholash tizimi (9.0+ — kritik).",
          "Zaiflik skanerlari: Nessus, OpenVAS, Nikto, Nuclei.",
          "Natijalardagi noto'g'ri ijobiy (false positive) holatlarni qo'lda tekshirish kerak.",
          "Ustuvorlik: jiddiylik, ekspluatatsiya imkoniyati va biznes ta'siriga qarab beriladi."
        ],
        [
          Q("CVE nima?", ["Ma'lum zaifliklar identifikatori", "Kompyuter virusi turi", "Parol turi", "Tarmoq kabeli"], 0),
          Q("CVSS shkalasi qaysi oraliqda baholaydi?", ["0.0 dan 10.0 gacha", "1 dan 5 gacha", "0 dan 100 gacha", "A dan Z gacha"], 0),
          Q("Quyidagilardan qaysi biri zaiflik skaneri?", ["Nessus", "Photoshop", "Word", "Spotify"], 0),
          Q("«False positive» nimani anglatadi?", ["Aslida mavjud bo'lmagan zaiflik topilgan deb ko'rsatilishi", "Haqiqiy zaiflik", "Tarmoq tezligi", "Yangi dastur"], 0),
          Q("Zaifliklarga ustuvorlik berishda nimalar hisobga olinadi?", ["Jiddiylik va biznes ta'siri", "Faqat fayl nomi", "Kompyuter rangi", "Foydalanuvchi yoshi"], 0)
        ]),
      lesson(6, "Metasploit va ekspluatatsiya asoslari",
        "Ekspluatatsiya tushunchasi, Metasploit Framework va payloadlar.",
        V_ETHIC, 34,
        [
          "Ekspluatatsiya (exploit) — zaiflikdan foydalanib tizimda kod bajarish usuli.",
          "Metasploit Framework — exploit, payload va yordamchi modullar to'plami.",
          "Payload — ekspluatatsiyadan so'ng nishonda bajariladigan kod (masalan, Meterpreter).",
          "Asosiy buyruqlar: search, use, show options, set RHOSTS, run/exploit.",
          "Reverse shell — nishon hujumchi tomoniga ulanadi; bind shell — nishon port ochadi.",
          "Faqat o'z laboratoriyangizdagi (Metasploitable) mashinalarda mashq qiling."
        ],
        [
          Q("Metasploit Framework nima?", ["Exploit va payloadlar to'plami (pentest vositasi)", "Antivirus", "Matn muharriri", "Brauzer"], 0),
          Q("Payload nima?", ["Ekspluatatsiyadan so'ng nishonda bajariladigan kod", "Parol", "Tarmoq kabeli", "Fayl nomi"], 0),
          Q("Metasploitda nishon IP manzilini belgilovchi parametr qaysi?", ["RHOSTS", "LHOME", "PORTMAP", "NAMEIP"], 0),
          Q("Reverse shell da ulanishni kim boshlaydi?", ["Nishon tizim hujumchiga ulanadi", "Hujumchi to'g'ridan-to'g'ri ulanadi", "Router", "Printer"], 0),
          Q("Mashq uchun mos zaif laboratoriya mashinasi qaysi?", ["Metasploitable", "Haqiqiy bank serveri", "Davlat sayti", "Birovning kompyuteri"], 0)
        ]),
      lesson(7, "Parol hujumlari: brute force va xeshlarni buzish",
        "Parol xeshlari, hashcat va John the Ripper vositalari hamda himoya choralari.",
        V_ETHIC, 30,
        [
          "Xesh — paroldan olingan qaytarib bo'lmaydigan qiymat; buzish — parollarni xeshlab solishtirish.",
          "Lug'at hujumi (dictionary) — mashhur parollar ro'yxatidan foydalanadi (rockyou.txt).",
          "Brute force — barcha kombinatsiyalarni sinash; vaqt parol uzunligi bilan eksponensial o'sadi.",
          "Hashcat (GPU) va John the Ripper (CPU) — xeshlarni buzish vositalari.",
          "Salt va sekin algoritmlar (bcrypt, Argon2) hujumlarni juda qiyinlashtiradi.",
          "Himoya: uzun parol, MFA, urinishlar sonini cheklash (account lockout)."
        ],
        [
          Q("Lug'at hujumida nimadan foydalaniladi?", ["Mashhur parollar ro'yxatidan", "Faqat raqamlardan", "Rasmlardan", "Videolardan"], 0),
          Q("Qaysi vosita GPU yordamida xeshlarni tez buzishi bilan mashhur?", ["Hashcat", "Notepad", "Paint", "Chrome"], 0),
          Q("Salt nima uchun ishlatiladi?", ["Bir xil parollar xeshi turlicha chiqishi va oldindan hisoblangan jadvallarni ishdan chiqarish uchun", "Parolni qisqartirish uchun", "Rasm siqish uchun", "Internetni tezlashtirish uchun"], 0),
          Q("Parollarni saqlash uchun qaysi algoritm eng yaxshi?", ["bcrypt / Argon2", "MD5", "Oddiy matn", "Base64"], 0),
          Q("Brute force dan himoyalanishning samarali usuli qaysi?", ["Urinishlar sonini cheklash va MFA", "Parolni qisqartirish", "Parolni hammaga aytish", "Firewallni o'chirish"], 0)
        ]),
      lesson(8, "Wi-Fi tarmoqlari xavfsizligi",
        "Simsiz tarmoq shifrlash standartlari, hujumlar va himoya usullari.",
        V_HANDS, 28,
        [
          "Wi-Fi shifrlash standartlari: WEP (eskirgan, buzilgan), WPA2, WPA3 (eng xavfsiz).",
          "WPA2 handshake ushlab, oflayn parol tanlash hujumi mumkin — parol uzun bo'lishi shart.",
          "Evil Twin — haqiqiy tarmoq nomidagi soxta nuqta bilan foydalanuvchilarni aldash.",
          "Aircrack-ng to'plami — Wi-Fi xavfsizligini tekshirish vositasi (faqat o'z tarmog'ingizda).",
          "Himoya: WPA3/WPA2-AES, uzun parol, WPS ni o'chirish, router yangilanishlari.",
          "Router standart login-parolini albatta almashtiring."
        ],
        [
          Q("Qaysi Wi-Fi standarti eng xavfsiz hisoblanadi?", ["WEP", "WPA3", "Ochiq tarmoq", "WPS PIN"], 1),
          Q("Evil Twin hujumi nima?", ["Haqiqiy tarmoq nomidagi soxta Wi-Fi nuqtasi", "Printer buzilishi", "Elektr uzilishi", "Brauzer xatosi"], 0),
          Q("WEP shifrlash holati qanday?", ["Eskirgan va oson buziladi", "Eng yangi standart", "Kvant shifrlash", "Xavfsiz va tavsiya etiladi"], 0),
          Q("Routerning standart login-parolini nima qilish kerak?", ["Almashtirish", "O'zgartirmaslik", "Internetga yozish", "Qog'ozga yopishtirish"], 0),
          Q("Aircrack-ng dan qayerda foydalanish to'g'ri?", ["Faqat o'z yoki ruxsat berilgan tarmoqda", "Qo'shni tarmoqda", "Kafe tarmog'ida", "Istalgan joyda"], 0)
        ]),
      lesson(9, "Imtiyozlarni oshirish va post-exploitation",
        "Tizimga kirgandan keyingi bosqich: huquqlarni oshirish, harakat va iz qoldirmaslik.",
        V_LINUX, 32,
        [
          "Privilege Escalation — oddiy foydalanuvchi huquqidan administrator/root huquqiga o'tish.",
          "Vertikal oshirish — yuqori huquq olish; gorizontal — boshqa foydalanuvchi huquqlariga o'tish.",
          "Linuxda tekshiriladigan joylar: SUID fayllar, sudo -l, cron vazifalari, eskirgan yadro.",
          "Windowsda: noto'g'ri sozlangan xizmatlar, saqlangan hisob ma'lumotlari, AlwaysInstallElevated.",
          "Vositalar: LinPEAS, WinPEAS, GTFOBins.",
          "Himoya: minimal huquqlar, yamoqlar, sudo qoidalarini qat'iy sozlash, loglarni monitoring qilish."
        ],
        [
          Q("Privilege Escalation nima?", ["Huquqlarni oshirish", "Parolni o'chirish", "Fayl nusxalash", "Tarmoqni uzish"], 0),
          Q("Linuxda root huquqli SUID fayllar nima uchun tekshiriladi?", ["Huquqni oshirish imkoniyatini topish uchun", "Rasm uchun", "Musiqa uchun", "Printer uchun"], 0),
          Q("Qaysi vosita Linuxda huquqni oshirish yo'llarini avtomatik qidiradi?", ["LinPEAS", "Paint", "Excel", "Zoom"], 0),
          Q("Himoya nuqtai nazaridan eng muhim tamoyil qaysi?", ["Minimal huquqlar (Least Privilege)", "Hammaga admin huquqi", "Parolsiz kirish", "Loglarni o'chirish"], 0),
          Q("«sudo -l» buyrug'i nimani ko'rsatadi?", ["Foydalanuvchi sudo orqali bajara oladigan buyruqlarni", "Disk hajmini", "Internet tezligini", "Fayl nomlarini"], 0)
        ]),
      lesson(10, "Pentest hisoboti va Bug Bounty",
        "Natijalarni hujjatlashtirish, tavsiyalar berish va Bug Bounty dasturlarida qatnashish.",
        V_HANDS, 28,
        [
          "Hisobot — pentestning eng muhim natijasi: topilmalar, dalillar, jiddiylik va tavsiyalar.",
          "Struktura: ijroiya xulosa (rahbarlar uchun) va texnik tafsilotlar (mutaxassislar uchun).",
          "Har bir zaiflik uchun: tavsif, qayta ishlab chiqarish qadamlari, ta'sir, CVSS va tuzatish usuli.",
          "Bug Bounty — kompaniyalar zaifliklarni mas'uliyatli topgan tadqiqotchilarga mukofot to'laydi.",
          "Platformalar: HackerOne, Bugcrowd, Intigriti.",
          "Mas'uliyatli oshkor qilish (responsible disclosure) — avval egasiga xabar beriladi, keyin e'lon qilinadi."
        ],
        [
          Q("Pentest hisobotida nima bo'lishi shart?", ["Topilmalar, dalillar va tuzatish tavsiyalari", "Faqat xaker ismi", "Faqat rasm", "Reklama"], 0),
          Q("Ijroiya xulosa kimlar uchun yoziladi?", ["Rahbariyat va menejerlar uchun", "Faqat dasturchilar uchun", "Faqat xakerlar uchun", "Hech kim uchun"], 0),
          Q("Bug Bounty dasturi nima?", ["Zaiflik topganlarga mukofot to'lash dasturi", "Hasharotlarga qarshi dastur", "O'yin turi", "Antivirus"], 0),
          Q("Quyidagilardan qaysi biri Bug Bounty platformasi?", ["HackerOne", "Netflix", "Spotify", "Instagram"], 0),
          Q("Mas'uliyatli oshkor qilish (responsible disclosure) nima?", ["Avval egasiga xabar berib, tuzatish uchun vaqt berish", "Zaiflikni darhol ijtimoiy tarmoqda e'lon qilish", "Zaiflikni sotish", "Zaiflikni yashirish"], 0)
        ])
    ]
  },

  // ───────────────────────── 3-KURS ─────────────────────────
  {
    title: "Tarmoq va Veb Ilovalar Xavfsizligi",
    description: "Tarmoq asoslari, firewall, VPN, Wireshark, OWASP Top 10, SQL Injection, XSS, SIEM va raqamli kriminalistika.",
    hash: "tarmoqxavfsizligi",
    lessons: [
      lesson(1, "Tarmoq asoslari: OSI va TCP/IP modellari",
        "Tarmoq qatlamlari, IP manzillar, portlar va asosiy protokollar.",
        V_HANDS, 32,
        [
          "OSI modeli 7 qatlamdan iborat: Fizik, Kanal, Tarmoq, Transport, Seans, Taqdimot, Ilova.",
          "TCP/IP modeli amaliyotda ishlatiladi: Ilova, Transport, Internet, Tarmoq interfeysi.",
          "IP manzil qurilmani tarmoqda aniqlaydi (IPv4 — 32 bit, IPv6 — 128 bit).",
          "Port — xizmatni aniqlovchi raqam: HTTP 80, HTTPS 443, SSH 22, DNS 53, FTP 21.",
          "TCP — ishonchli, ulanishga asoslangan (3-bosqichli qo'l siqish); UDP — tez, kafolatsiz.",
          "DNS domen nomini IP manzilga, DHCP esa avtomatik IP manzil beradi."
        ],
        [
          Q("OSI modeli nechta qatlamdan iborat?", ["4", "5", "7", "9"], 2),
          Q("HTTPS odatda qaysi portda ishlaydi?", ["80", "443", "22", "53"], 1),
          Q("TCP va UDP dan qaysi biri kafolatlangan yetkazib berishni ta'minlaydi?", ["TCP", "UDP", "Ikkalasi ham", "Hech biri"], 0),
          Q("SSH protokoli standart porti qaysi?", ["22", "21", "25", "110"], 0),
          Q("DNS ning vazifasi nima?", ["Domen nomini IP manzilga o'girish", "Fayl shifrlash", "Parol saqlash", "Video yuklash"], 0)
        ]),
      lesson(2, "Firewall va tarmoq segmentatsiyasi",
        "Firewall turlari, qoidalar, DMZ va VLAN yordamida tarmoqni bo'lish.",
        V_HANDS, 28,
        [
          "Firewall — tarmoq trafigini belgilangan qoidalar asosida ruxsat beradi yoki to'sadi.",
          "Stateless filtr paketni alohida tekshiradi; stateful firewall ulanish holatini kuzatadi.",
          "NGFW (yangi avlod firewall) ilova darajasida tekshirish, IPS va kontent filtrlashni qo'shadi.",
          "DMZ — ommaviy xizmatlar (veb-server) uchun ichki tarmoqdan ajratilgan zona.",
          "VLAN va segmentatsiya hujum tarqalishini cheklaydi (lateral movement).",
          "Qoidalar «default deny» tamoyilida: ruxsat berilmagan hamma narsa taqiqlanadi."
        ],
        [
          Q("Firewall ning asosiy vazifasi nima?", ["Trafikni qoidalar asosida filtrlash", "Fayllarni arxivlash", "Rasm tahrirlash", "Video ko'rsatish"], 0),
          Q("DMZ nima uchun ishlatiladi?", ["Ommaviy xizmatlarni ichki tarmoqdan ajratib joylashtirish uchun", "Parol saqlash uchun", "Disk tozalash uchun", "Printer ulash uchun"], 0),
          Q("«Default deny» tamoyili nimani anglatadi?", ["Aniq ruxsat berilmagan hamma narsa taqiqlanadi", "Hammaga ruxsat beriladi", "Faqat admin kiradi", "Qoida talab qilinmaydi"], 0),
          Q("Stateful firewall ning afzalligi nima?", ["Ulanish holatini kuzatib, aqlliroq qaror qiladi", "Faqat rasmlarni ko'radi", "Internetni uzadi", "Parolni o'zgartiradi"], 0),
          Q("Tarmoq segmentatsiyasining foydasi nima?", ["Hujum tarqalishini cheklaydi", "Internetni sekinlashtiradi", "Disk hajmini oshiradi", "Rasm sifatini yaxshilaydi"], 0)
        ]),
      lesson(3, "VPN, IDS va IPS tizimlari",
        "Xavfsiz tunnellar va hujumlarni aniqlash hamda oldini olish tizimlari.",
        V_HANDS, 30,
        [
          "VPN — jamoat tarmog'ida shifrlangan «tunnel» yaratadi (IPsec, OpenVPN, WireGuard).",
          "Site-to-Site VPN ofislarni, Remote Access VPN esa masofadagi xodimni tarmoqqa ulaydi.",
          "IDS (Intrusion Detection System) shubhali faoliyatni aniqlaydi va ogohlantiradi — passiv.",
          "IPS (Intrusion Prevention System) hujumni aniqlab, trafikni avtomatik to'sadi — faol.",
          "Aniqlash usullari: signature (imzo) asosida va anomaliya (g'ayrioddiy xatti-harakat) asosida.",
          "Mashhur vositalar: Snort, Suricata, Zeek."
        ],
        [
          Q("IDS va IPS orasidagi asosiy farq nima?", ["IDS aniqlaydi va ogohlantiradi, IPS esa to'sadi", "Farqi yo'q", "IPS faqat ogohlantiradi", "IDS faqat parol saqlaydi"], 0),
          Q("Quyidagilardan qaysi biri IDS/IPS vositasi?", ["Snort", "Photoshop", "VLC", "Notepad"], 0),
          Q("VPN protokollaridan qaysi biri zamonaviy va tez?", ["WireGuard", "Telnet", "FTP", "HTTP"], 0),
          Q("Signature asosidagi aniqlash nimaga tayanadi?", ["Ma'lum hujum imzolariga", "Tasodifiy raqamlarga", "Foydalanuvchi ismiga", "Rasm hajmiga"], 0),
          Q("Site-to-Site VPN nimani bog'laydi?", ["Ikki ofis tarmog'ini", "Ikki telefonni", "Ikki printerni", "Ikki rasmni"], 0)
        ]),
      lesson(4, "Wireshark bilan trafik tahlili",
        "Paketlarni ushlash, filtrlash va shubhali faoliyatni aniqlash.",
        V_HANDS, 34,
        [
          "Wireshark — tarmoq paketlarini real vaqtda ushlab, chuqur tahlil qiluvchi vosita.",
          "Capture filter (ushlashda) va Display filter (ko'rsatishda) turlari mavjud.",
          "Foydali filtrlar: ip.addr == 192.168.1.10, tcp.port == 80, http, dns.",
          "Follow TCP Stream — suhbat mazmunini to'liq ko'rish imkonini beradi.",
          "Shifrlanmagan protokollar (HTTP, FTP, Telnet) da parollar ochiq ko'rinishi mumkin.",
          "Tarmoqdagi anomaliya (port skanerlash, ARP spoofing) paketlar tahlilidan aniqlanadi."
        ],
        [
          Q("Wireshark nima?", ["Tarmoq paketlarini tahlil qiluvchi vosita", "Matn muharriri", "Antivirus", "Brauzer"], 0),
          Q("http protokolidagi paketlarni ko'rsatish uchun qaysi filtr yoziladi?", ["http", "ftp-only", "show web", "net=80x"], 0),
          Q("Nima uchun HTTP o'rniga HTTPS ishlatish kerak?", ["HTTP da ma'lumot ochiq ko'rinadi, HTTPS esa shifrlangan", "HTTPS sekinroq", "Farqi yo'q", "HTTP xavfsizroq"], 0),
          Q("«Follow TCP Stream» nima qiladi?", ["Bitta ulanish suhbatini to'liq ko'rsatadi", "Faylni o'chiradi", "Tarmoqni uzadi", "Parolni almashtiradi"], 0),
          Q("Wireshark da faqat 80-port TCP trafigini ko'rsatuvchi filtr qaysi?", ["tcp.port == 80", "port=80.tcp", "show tcp 80", "filter.80"], 0)
        ]),
      lesson(5, "Veb ilovalar xavfsizligi va OWASP Top 10",
        "Veb zaifliklar reytingi va asosiy himoya yondashuvlari.",
        V_HANDS, 32,
        [
          "OWASP Top 10 — veb ilovalardagi eng xavfli 10 ta xavf ro'yxati.",
          "Muhim toifalar: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration.",
          "Broken Access Control — foydalanuvchi o'ziga tegishli bo'lmagan ma'lumotga kira olishi (IDOR).",
          "Kirish ma'lumotlarini har doim validatsiya va sanitizatsiya qilish zarur.",
          "Xavfsiz dasturlash (Secure SDLC): xavfsizlik loyiha boshidan hisobga olinadi.",
          "Vositalar: Burp Suite, OWASP ZAP; amaliyot uchun DVWA, Juice Shop, WebGoat."
        ],
        [
          Q("OWASP Top 10 nima?", ["Veb ilovalardagi eng xavfli 10 ta xavf ro'yxati", "Eng tez 10 ta sayt", "10 ta dasturlash tili", "10 ta parol"], 0),
          Q("Broken Access Control nimani anglatadi?", ["Foydalanuvchi ruxsatsiz ma'lumotlarga kirib olishi", "Sayt rangi buzilishi", "Serverning sekin ishlashi", "Internet uzilishi"], 0),
          Q("Qaysi vosita veb ilovalarni tekshirish uchun proksi vosita?", ["Burp Suite", "Paint", "Excel", "Calc"], 0),
          Q("Foydalanuvchi kiritgan ma'lumotlar bilan nima qilish kerak?", ["Validatsiya va sanitizatsiya", "Ishonib, o'zgartirmasdan ishlatish", "O'chirmaslik", "Hech narsa"], 0),
          Q("Juice Shop nima?", ["Amaliyot uchun ataylab zaif veb ilova", "Ichimlik do'koni", "Antivirus", "Brauzer"], 0)
        ]),
      lesson(6, "SQL Injection hujumi va himoya",
        "SQL injection mexanizmi, turlari va parametrlangan so'rovlar bilan himoya.",
        V_HANDS, 34,
        [
          "SQL Injection — foydalanuvchi kiritgan ma'lumot orqali ma'lumotlar bazasi so'roviga zararli kod qo'shish.",
          "Klassik misol: login maydoniga ' OR '1'='1 kiritish orqali parol tekshiruvini aylanib o'tish.",
          "Turlari: in-band (error/union), blind (boolean/time-based), out-of-band.",
          "Ta'siri: ma'lumotlarni o'qish, o'zgartirish, o'chirish va ba'zan tizimni to'liq egallash.",
          "Asosiy himoya: parametrlangan so'rovlar (prepared statements) va ORM dan foydalanish.",
          "Qo'shimcha himoya: minimal huquqli DB foydalanuvchisi, WAF, kirishni validatsiya qilish."
        ],
        [
          Q("SQL Injection hujumi nimaga qaratilgan?", ["Ma'lumotlar bazasiga", "Printerga", "Monitorga", "Klaviaturaga"], 0),
          Q("SQL Injectiondan eng samarali himoya usuli qaysi?", ["Parametrlangan so'rovlar (prepared statements)", "Foydalanuvchi kiritganini to'g'ridan-to'g'ri qo'shish", "Parolni qisqartirish", "Saytni o'chirish"], 0),
          Q("' OR '1'='1 kiritish nimani maqsad qiladi?", ["Shartni doim rost qilib, tekshiruvni aylanib o'tish", "Saytni tezlashtirish", "Rasm yuklash", "Parolni o'zgartirish"], 0),
          Q("«Blind SQL injection» nimani bildiradi?", ["Natija to'g'ridan-to'g'ri ko'rinmaydi, javobdan xulosa chiqariladi", "Sayt ko'zga ko'rinmaydi", "Rasm yuklanmaydi", "Parol yo'q"], 0),
          Q("DB foydalanuvchisiga qanday huquq berilishi to'g'ri?", ["Faqat zarur bo'lgan minimal huquqlar", "Har doim DBA huquqi", "Hech qanday cheklovsiz", "Faqat o'chirish"], 0)
        ]),
      lesson(7, "XSS va CSRF hujumlari",
        "Cross-Site Scripting va Cross-Site Request Forgery hujumlari hamda himoya.",
        V_HANDS, 30,
        [
          "XSS — veb sahifaga zararli JavaScript kodini kiritish; kod boshqa foydalanuvchi brauzerida bajariladi.",
          "XSS turlari: Reflected, Stored (saqlanadigan, eng xavfli) va DOM-based.",
          "XSS himoyasi: chiquvchi ma'lumotni kodlash (output encoding), CSP sarlavhasi, HttpOnly cookie.",
          "CSRF — foydalanuvchi tizimga kirgan paytda uning nomidan istalmagan so'rov yuborish.",
          "CSRF himoyasi: CSRF token, SameSite cookie, muhim amallarda qayta tasdiqlash.",
          "XSS va CSRF ni farqlang: XSS — saytga kod kiritish, CSRF — foydalanuvchi ishonchidan foydalanish."
        ],
        [
          Q("XSS hujumida nima kiritiladi?", ["Zararli JavaScript kodi", "Faqat rasm", "Printer drayveri", "Elektr signali"], 0),
          Q("Qaysi XSS turida zararli kod serverda (masalan, izohda) saqlanib qoladi?", ["Stored XSS", "Reflected XSS", "DOM-based XSS", "Hech birida"], 0),
          Q("CSRF dan himoyalanishda ishlatiladigan asosiy vosita qaysi?", ["CSRF token", "Parolni uzaytirish", "Sahifa rangini o'zgartirish", "Rasm siqish"], 0),
          Q("HttpOnly cookie nimadan himoya qiladi?", ["JavaScript orqali cookie o'g'irlanishidan", "Internet uzilishidan", "Disk to'lishidan", "Elektr o'chishidan"], 0),
          Q("CSP (Content Security Policy) nima uchun ishlatiladi?", ["Qaysi manbalardan kod yuklanishi mumkinligini cheklash", "Rasm kattalashtirish", "Parol saqlash", "Video yuklash"], 0)
        ]),
      lesson(8, "Autentifikatsiya, sessiya va JWT xavfsizligi",
        "Foydalanuvchini tasdiqlash, sessiyalarni boshqarish va JWT tokenlar xavfsizligi.",
        V_HANDS, 30,
        [
          "Autentifikatsiya — «kimsiz?»; avtorizatsiya — «nima qilishga haqqingiz bor?».",
          "Sessiya identifikatori tasodifiy, uzun va cookie da Secure, HttpOnly, SameSite bilan saqlanishi kerak.",
          "Sessiya fiksatsiyasi va o'g'irlanishidan himoya: kirishdan keyin sessiya ID ni yangilash.",
          "JWT (JSON Web Token) — header, payload va signature qismlaridan iborat.",
          "JWT xavfi: alg=none, zaif maxfiy kalit, tokenni localStorage da saqlash, uzoq amal qilish muddati.",
          "Parol tiklash va OAuth/SSO jarayonlari ham xavfsiz loyihalanishi shart."
        ],
        [
          Q("Autentifikatsiya va avtorizatsiya farqi nimada?", ["Autentifikatsiya shaxsni tasdiqlaydi, avtorizatsiya huquqlarni belgilaydi", "Farqi yo'q", "Avtorizatsiya parol yaratadi", "Autentifikatsiya rasm yuklaydi"], 0),
          Q("JWT nechta qismdan iborat?", ["3 (header, payload, signature)", "1", "5", "7"], 0),
          Q("JWT da xavfli sozlama qaysi?", ["alg=none ni qabul qilish", "Kuchli maxfiy kalit", "Qisqa amal qilish muddati", "Imzoni tekshirish"], 0),
          Q("Muvaffaqiyatli kirishdan keyin sessiya ID ni yangilash nimadan himoya qiladi?", ["Session fixation hujumidan", "Disk to'lishidan", "Virusdan", "Elektr o'chishidan"], 0),
          Q("Cookie uchun qaysi atributlar xavfsizlikni oshiradi?", ["Secure, HttpOnly, SameSite", "Color, Size, Font", "Width, Height", "Music, Video"], 0)
        ]),
      lesson(9, "SOC, SIEM va loglarni tahlil qilish",
        "Xavfsizlik operatsion markazi, log yig'ish va hodisalarni korrelyatsiya qilish.",
        V_INTRO, 30,
        [
          "SOC (Security Operations Center) — 24/7 xavfsizlik hodisalarini monitoring qiluvchi jamoa.",
          "SIEM — turli manbalardan loglarni yig'ib, korrelyatsiya qiladi va ogohlantirishlar beradi (Splunk, Wazuh, ELK).",
          "Muhim log manbalari: firewall, server, autentifikatsiya, veb-server va endpoint (EDR).",
          "Shubhali belgilar: ketma-ket muvaffaqiyatsiz kirishlar, g'ayrioddiy vaqtdagi kirish, yangi administrator akkaunt.",
          "MITRE ATT&CK — hujumchi taktikalari va texnikalari bazasi.",
          "SOC tahlilchi darajalari: L1 (triage), L2 (tekshiruv), L3 (ov va chuqur tahlil)."
        ],
        [
          Q("SIEM tizimining asosiy vazifasi nima?", ["Loglarni yig'ish, korrelyatsiya qilish va ogohlantirish", "Rasm chizish", "Video yuklash", "Musiqa tinglash"], 0),
          Q("Quyidagilardan qaysi biri SIEM yechimi?", ["Splunk / Wazuh", "Photoshop", "VLC", "Notepad"], 0),
          Q("Qaysi holat shubhali faoliyat belgisi?", ["Ketma-ket ko'p muvaffaqiyatsiz kirishlar", "Kunduzgi oddiy kirish", "To'g'ri parol bilan bir marta kirish", "Brauzerni yangilash"], 0),
          Q("MITRE ATT&CK nima?", ["Hujumchi taktikalari va texnikalari bazasi", "Dasturlash tili", "Operatsion tizim", "Brauzer"], 0),
          Q("SOC L1 tahlilchisi asosan nima bilan shug'ullanadi?", ["Ogohlantirishlarni dastlabki saralash (triage)", "Dastur yozish", "Server sotib olish", "Dizayn"], 0)
        ]),
      lesson(10, "Incident Response va raqamli kriminalistika (Forensics)",
        "Kiber hodisa tergovi, dalillarni saqlash va tahlil qilish asoslari.",
        V_INTRO, 30,
        [
          "Digital Forensics — raqamli dalillarni yig'ish, saqlash va tahlil qilish fani.",
          "Order of Volatility: avval eng tez yo'qoladigan ma'lumot (RAM) yig'iladi, keyin disk.",
          "Dalil yaxlitligi xesh (SHA-256) bilan tasdiqlanadi; Chain of Custody (dalillar zanjiri) yuritiladi.",
          "Original diskka tegmasdan, uning forensic nusxasi (image) bilan ishlanadi — write blocker ishlatiladi.",
          "Vositalar: Autopsy, FTK Imager, Volatility, Wireshark.",
          "Xulosa hisobotida voqealar xronologiyasi, ta'sir, sabab va tavsiyalar bo'lishi kerak."
        ],
        [
          Q("Order of Volatility tamoyiliga ko'ra birinchi navbatda nima yig'iladi?", ["RAM (operativ xotira)", "Qattiq disk arxivi", "Qog'oz hujjatlar", "Zaxira lenta"], 0),
          Q("Dalil yaxlitligini tasdiqlash uchun nima ishlatiladi?", ["Xesh qiymat (masalan, SHA-256)", "Rasm", "Rang", "Ovoz"], 0),
          Q("Chain of Custody nima?", ["Dalillarni kim, qachon va qanday qo'lga olgani hujjati", "Zanjirli parol", "Tarmoq kabeli", "Yangi dastur"], 0),
          Q("Forensik tahlilda qanday disk bilan ishlanadi?", ["Originalning forensic nusxasi (image) bilan", "Faqat originalning o'zi bilan", "Telefon bilan", "Printer bilan"], 0),
          Q("Quyidagilardan qaysi biri forensik vosita?", ["Autopsy", "Spotify", "Instagram", "Zoom"], 0)
        ])
    ]
  }
];

module.exports = COURSES_DATA;

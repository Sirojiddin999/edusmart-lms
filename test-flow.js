// Verification script to test the educational platform end-to-end
const assert = require('assert');

async function runTests() {
  console.log("=== Boshlanish: Ta'lim platformasi sinovi ===");

  const BASE_URL = 'http://localhost:3000';

  // 1. O'quvchi ro'yxatdan o'tishi
  console.log("\n1. O'quvchini ro'yxatdan o'tkazish...");
  const regRes = await fetch(`${BASE_URL}/api/auth/register-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: 'Jasur',
      last_name: 'Rustamov',
      custom_pin: '987654'
    })
  });
  const regData = await regRes.json();
  console.log("Ro'yxatdan o'tish natijasi:", regData);
  assert(regRes.ok, "Ro'yxatdan o'tish muvaffaqiyatsiz");
  assert(regData.username, "Login shakllanmadi");
  assert.strictEqual(regData.pin_code, '987654', "PIN kod mos kelmadi");
  const studentLogin = regData.username;
  const studentPin = regData.pin_code;
  console.log(`✅ O'quvchiga unikal Login berildi: [${studentLogin}], PIN: [${studentPin}]`);

  // 2. Birinchi qurilma / Sessiya orqali darsni boshlash
  console.log("\n2. Birinchi qurilmadan kirish va 1-darsni tekshirish...");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: studentLogin, pin_code: studentPin })
  });
  const loginData = await loginRes.json();
  assert(loginRes.ok, "Kirish amalga oshmadi");
  const token = loginData.token;

  // Dashboard holati
  const dashRes = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashData = await dashRes.json();
  console.log(`Joriy dars: ${dashData.current_lesson.title}, Bajarilgan: ${dashData.progress.completed_count}/${dashData.progress.total_lessons}`);
  assert.strictEqual(dashData.progress.completed_count, 0, "Boshida 0 ta dars tugallangan bo'lishi kerak");

  // 3. 1-dars testini tekshirish (kam ball olinsa o'tmaslik va 100% yechilsa o'tish)
  console.log("\n3. 1-Dars testini sinash: avval 3/5 yechib ko'ramiz (o'tmasligi kerak)...");
  const failQuizRes = await fetch(`${BASE_URL}/api/student/lessons/${dashData.current_lesson.id}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ answers: [1, 2, 2, 0, 0] }) // 3 to'g'ri, 2 noto'g'ri
  });
  const failQuizData = await failQuizRes.json();
  console.log("3/5 natijasi (o'tmasligi kerak):", failQuizData);
  assert.strictEqual(failQuizData.passed, false, "3/5 ball bilan o'tib ketmasligi kerak");

  console.log("\nEndi 100% (5/5) to'g'ri yechamiz (dars ochilishi kerak)...");
  const passQuizRes = await fetch(`${BASE_URL}/api/student/lessons/${dashData.current_lesson.id}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ answers: [1, 2, 2, 1, 2] }) // 5/5 to'g'ri
  });
  const passQuizData = await passQuizRes.json();
  console.log("5/5 (100%) natijasi:", passQuizData);
  assert.strictEqual(passQuizData.passed, true, "100% yechilganda o'tishi kerak");
  assert.strictEqual(passQuizData.score, 5, "Ball 5/5 bo'lishi kerak");
  console.log("✅ 100% (5/5) talabi muvaffaqiyatli ishlayapti!");

  // 4. Boshqa qurilmadan kirish (Simulyatsiya)
  console.log("\n4. Boshqa qurilmadan (ikkinchi sessiya) shu login bilan kirish...");
  const secondDeviceLoginRes = await fetch(`${BASE_URL}/api/auth/login-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: studentLogin, pin_code: studentPin })
  });
  const secondDeviceToken = (await secondDeviceLoginRes.json()).token;

  const secondDashRes = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: { 'Authorization': `Bearer ${secondDeviceToken}` }
  });
  const secondDashData = await secondDashRes.json();
  console.log(`Ikkinchi qurilmadagi joriy dars: ${secondDashData.current_lesson.title}`);
  console.log(`O'zlashtirish foizi: ${secondDashData.progress.progress_percent}%`);
  assert.strictEqual(secondDashData.progress.completed_count, 1, "Boshqa qurilmada 1-dars tugallangan bo'lishi kerak");
  assert(secondDashData.current_lesson.order_num >= 2, "Boshqa qurilmada 2-darsdan davom etishi kerak");
  console.log("✅ Sinxronizatsiya mukammal: boshqa qurilmada to'xtagan joyidan (2-darsdan) ochildi!");

  // 5. O'qituvchi paneli tekshiruvi
  console.log("\n5. O'qituvchi kirishi va monitoring nazorati...");
  const teacherLogin = await fetch(`${BASE_URL}/api/auth/login-teacher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'oqituvchi', password: 'admin123' })
  });
  const teacherToken = (await teacherLogin.json()).token;

  const teacherStudentsRes = await fetch(`${BASE_URL}/api/teacher/students`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  const teacherStudentsData = await teacherStudentsRes.json();
  const jasur = teacherStudentsData.students.find(s => s.username === studentLogin);
  assert(jasur, "O'qituvchi ro'yxatida Jasur topilmadi");
  console.log(`O'qituvchi ko'rayotgan o'quvchi: ${jasur.full_name}, Login: ${jasur.username}, Oxirgi dars: ${jasur.last_lesson_title}, Progress: ${jasur.progress_percent}%`);
  console.log("✅ O'qituvchi barcha ma'lumotlarni to'g'ri kuzatib turibdi!");

  console.log("\n🎉 Barcha testlar muvaffaqiyatli yakunlandi!");
}

runTests().catch(err => {
  console.error("❌ Testda xatolik:", err);
  process.exit(1);
});

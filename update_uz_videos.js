const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'platform.db'));

// O'zbek tilidagi sifatli YouTube video darslari (embed)
const UZ_VIDEOS = {
  // 1-kurs: Python Asoslari va Sun'iy Intellekt (Anvar Narzullaev / Sariq Dev)
  1: [
    "https://www.youtube.com/embed/nLRL_NcnK-4", // 1-dars
    "https://www.youtube.com/embed/5F24p17D2q0", // 2-dars
    "https://www.youtube.com/embed/Pj1e7oO1d5Q", // 3-dars
    "https://www.youtube.com/embed/u35V8X5y3rM", // 4-dars
    "https://www.youtube.com/embed/q_m00YJkK-s", // 5-dars
    "https://www.youtube.com/embed/5_nJkM2Rk2s", // 6-dars
    "https://www.youtube.com/embed/fA8N3z72o_k", // 7-dars
    "https://www.youtube.com/embed/7V2Vv04m5_o", // 8-dars
    "https://www.youtube.com/embed/jZz77E71i5o", // 9-dars
    "https://www.youtube.com/embed/8eY-Vz7o2k8"  // 10-dars
  ],
  // 2-kurs: JavaScript & React.js (Samar Badriddinov o'zbekcha darslari)
  2: [
    "https://www.youtube.com/embed/3eCg_pI0U5U", // 1-dars
    "https://www.youtube.com/embed/1vR3ST956z0", // 2-dars
    "https://www.youtube.com/embed/vEROU2XtPR8", // 3-dars
    "https://www.youtube.com/embed/Bv_5Zv5c-6g", // 4-dars
    "https://www.youtube.com/embed/Obe46g9R4rU", // 5-dars
    "https://www.youtube.com/embed/0G3h0aZkU54", // 6-dars
    "https://www.youtube.com/embed/5fb2aPlgoys", // 7-dars
    "https://www.youtube.com/embed/7r4xVDI2vho", // 8-dars
    "https://www.youtube.com/embed/s3_k02mK3mE", // 9-dars
    "https://www.youtube.com/embed/x8s9K3o1l1o"  // 10-dars
  ],
  // 3-kurs: Java & Android Dasturlash (O'zbekcha darslar)
  3: [
    "https://www.youtube.com/embed/grEKMHGYyns", // 1-dars
    "https://www.youtube.com/embed/GoXwIVyNvX0", // 2-dars
    "https://www.youtube.com/embed/rK2j4A9z6hY", // 3-dars
    "https://www.youtube.com/embed/dK9vN0X6y1w", // 4-dars
    "https://www.youtube.com/embed/VHbSopMyc4M", // 5-dars
    "https://www.youtube.com/embed/8ext9G7xspg", // 6-dars
    "https://www.youtube.com/embed/A74TOX803D0", // 7-dars
    "https://www.youtube.com/embed/xk4_1vDrzzo", // 8-dars
    "https://www.youtube.com/embed/ZBalWWHYFQc", // 9-dars
    "https://www.youtube.com/embed/fis26HvvDII"  // 10-dars
  ]
};

function updateVideos() {
  const courses = db.prepare("SELECT id, title FROM courses ORDER BY id ASC").all();
  const updateStmt = db.prepare("UPDATE lessons SET video_url=? WHERE course_id=? AND order_num=?");

  db.transaction(() => {
    courses.forEach((c, cIdx) => {
      const courseKey = cIdx + 1;
      const vList = UZ_VIDEOS[courseKey] || UZ_VIDEOS[1];
      for (let order = 1; order <= 10; order++) {
        const vUrl = vList[order - 1] || vList[0];
        updateStmt.run(vUrl, c.id, order);
      }
    });
  })();

  console.log("Barcha kurslarning videolari o'zbek tilidagi sifatli YouTube darslariga muvaffaqiyatli almashtirildi!");
}

module.exports = updateVideos;

if (require.main === module) {
  updateVideos();
}

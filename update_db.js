const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'platform.db'));

try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Courses table created.');

    try {
        db.exec(`ALTER TABLE lessons ADD COLUMN course_id INTEGER REFERENCES courses(id);`);
        console.log('Added course_id to lessons.');
    } catch(e) {
        if(e.message.includes('duplicate column name')) {
            console.log('course_id already exists in lessons.');
        } else {
            throw e;
        }
    }
    
    // Create a default course and assign all existing lessons to it
    const course = db.prepare('SELECT id FROM courses LIMIT 1').get();
    if (!course) {
        const info = db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)").run("Asosiy Kurs", "Barcha mavjud darslar");
        db.prepare("UPDATE lessons SET course_id = ? WHERE course_id IS NULL").run(info.lastInsertRowid);
        console.log('Created default course and assigned existing lessons.');
    } else {
        db.prepare("UPDATE lessons SET course_id = ? WHERE course_id IS NULL").run(course.id);
    }
} catch (error) {
    console.error('Error updating DB:', error);
}

db.close();

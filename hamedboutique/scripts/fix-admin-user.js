const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('database.sqlite');
const username = 'admin';
const email = 'admin@site.com';
const password = 'admin123';
const name = 'مدیر سایت';
const isAdmin = 1;

(async () => {
  const hash = await bcrypt.hash(password, 12);
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, user) => {
    if (err) {
      console.error('DB error:', err);
      db.close();
      return;
    }
    if (user) {
      // اگر ادمین وجود دارد، رمز را بروزرسانی کن
      db.run('UPDATE users SET password = ?, isAdmin = 1, name = ? WHERE id = ?', [hash, name, user.id], (err2) => {
        if (err2) console.error('Update error:', err2);
        else console.log('رمز ادمین بروزرسانی شد.');
        db.close();
      });
    } else {
      // اگر ادمین وجود ندارد، بساز
      db.run('INSERT INTO users (username, email, password, name, isAdmin) VALUES (?, ?, ?, ?, ?)', [username, email, hash, name, isAdmin], (err3) => {
        if (err3) console.error('Insert error:', err3);
        else console.log('ادمین جدید ساخته شد.');
        db.close();
      });
    }
  });
})(); 
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

const columns = [
  { name: 'name', type: 'TEXT' },
  { name: 'phone', type: 'TEXT' },
  { name: 'address', type: 'TEXT' },
  { name: 'city', type: 'TEXT' },
  { name: 'postalCode', type: 'TEXT' },
  { name: 'profileImage', type: 'TEXT' },
  { name: 'birthDate', type: 'TEXT' },
  { name: 'gender', type: 'TEXT' },
  { name: 'isAdmin', type: 'INTEGER DEFAULT 0' },
];

function addColumnIfNotExists(column) {
  return new Promise((resolve) => {
    db.all(`PRAGMA table_info(users)`, (err, rows) => {
      if (err) return resolve();
      const exists = Array.isArray(rows) && rows.some(r => r.name === column.name);
      if (!exists) {
        db.run(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`, () => resolve());
      } else {
        resolve();
      }
    });
  });
}

(async () => {
  for (const col of columns) {
    await addColumnIfNotExists(col);
  }
  console.log('تمام ستون‌های لازم به جدول users اضافه شدند.');
  db.close();
})(); 
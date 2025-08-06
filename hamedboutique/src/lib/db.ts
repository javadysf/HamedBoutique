import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// ایجاد اتصال دیتابیس
export async function openDb() {
  return open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  });
}

// ایجاد جدول کاربران
export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      postalCode TEXT,
      profileImage TEXT,
      birthDate TEXT,
      gender TEXT,
      isAdmin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    -- جدول محصولات
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      images TEXT,
      description TEXT,
      category TEXT,
      discount REAL DEFAULT 0,
      colors TEXT,
      sizes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    -- جدول نظرات
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      user TEXT NOT NULL,
      text TEXT NOT NULL,
      rate INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // افزودن ادمین پیش‌فرض اگر وجود ندارد
  const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    // هش جدید برای رمز عبور admin123
    const hashedPassword = '$2b$10$ZtlU1xou6Do5Rsfmj58K.Oxd3AjyoEZeiDxSsjiHosH0Vewz2XVYK';
    
    // ایجاد ادمین با ایمیل admin@site.com
    await db.run(
      'INSERT INTO users (username, email, password, name, isAdmin) VALUES (?, ?, ?, ?, 1)',
      [
        'admin',
        'admin@site.com',
        hashedPassword,
        'مدیر سایت'
      ]
    );
    
    // ایجاد ادمین دوم با ایمیل admin@site
    await db.run(
      'INSERT INTO users (username, email, password, name, isAdmin) VALUES (?, ?, ?, ?, 1)',
      [
        'admin2',
        'admin@site',
        hashedPassword,
        'مدیر سایت 2'
      ]
    );
  }
  await db.close();
}

// ایجاد کاربر جدید
export async function createUser(username: string, email: string, hashedPassword: string, birthDate?: string) {
  const db = await openDb();
  try {
    const result = await db.run(
      'INSERT INTO users (username, email, password, birthDate) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, birthDate || null]
    );
    return result;
  } finally {
    await db.close();
  }
}

// پیدا کردن کاربر با ایمیل
export async function findUserByEmail(email: string) {
  const db = await openDb();
  try {
    // ابتدا جستجوی دقیق
    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    // اگر کاربر پیدا نشد، جستجوی انعطاف‌پذیر
    if (!user && email === 'admin@site') {
      user = await db.get('SELECT * FROM users WHERE email = ?', ['admin@site.com']);
    }
    
    return user;
  } finally {
    await db.close();
  }
}

// پیدا کردن کاربر با نام کاربری
export async function findUserByUsername(username: string) {
  const db = await openDb();
  try {
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    return user;
  } finally {
    await db.close();
  }
}

// پیدا کردن کاربر با ID
export async function findUserById(id: number) {
  const db = await openDb();
  try {
    const user = await db.get('SELECT id, username, email, name, phone, address, city, postalCode, profileImage, birthDate, gender, created_at FROM users WHERE id = ?', [id]);
    return user;
  } finally {
    await db.close();
  }
}

// بروزرسانی اطلاعات کاربر
export async function updateUser(id: number, updateData: {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  profileImage?: string;
  birthDate?: string;
  gender?: string;
}) {
  const db = await openDb();
  try {
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof typeof updateData] !== undefined);
    const values = fields.map(field => updateData[field as keyof typeof updateData]);
    
    if (fields.length === 0) {
      return null;
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = ?`;
    
    await db.run(query, [...values, id]);
    
    // بازگرداندن کاربر بروزرسانی شده
    return await findUserById(id);
  } finally {
    await db.close();
  }
} 

// افزودن نظر جدید
export async function addComment(productId: number, user: string, text: string, rate: number) {
  const db = await openDb();
  try {
    const result = await db.run(
      'INSERT INTO comments (productId, user, text, rate) VALUES (?, ?, ?, ?)',
      [productId, user, text, rate]
    );
    return result;
  } finally {
    await db.close();
  }
}

// دریافت نظرات یک محصول
export async function getCommentsByProductId(productId: number) {
  const db = await openDb();
  try {
    const comments = await db.all(
      'SELECT * FROM comments WHERE productId = ? ORDER BY created_at DESC',
      [productId]
    );
    return comments;
  } finally {
    await db.close();
  }
} 

// افزودن محصول جدید
export async function addProduct(product: { title: string; price: number; image?: string; images?: string[]; description?: string; category?: string; discount?: number; colors?: string[]; sizes?: string[]; }) {
  const db = await openDb();
  try {
    const imagesJson = product.images ? JSON.stringify(product.images) : null;
    const colorsJson = product.colors ? JSON.stringify(product.colors) : null;
    const sizesJson = product.sizes ? JSON.stringify(product.sizes) : null;
    const result = await db.run(
      'INSERT INTO products (title, price, image, images, description, category, discount, colors, sizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product.title, product.price, product.image, imagesJson, product.description, product.category, product.discount || 0, colorsJson, sizesJson]
    );
    return result;
  } finally {
    await db.close();
  }
}
// دریافت همه محصولات
export async function getAllProducts() {
  const db = await openDb();
  try {
    const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    return products;
  } finally {
    await db.close();
  }
}
// دریافت محصول با id
export async function getProductById(id: number) {
  const db = await openDb();
  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    return product;
  } finally {
    await db.close();
  }
}
// ویرایش محصول
export async function updateProduct(id: number, updateData: { title?: string; price?: number; image?: string; images?: string[]; description?: string; category?: string; discount?: number; colors?: string[]; sizes?: string[]; }) {
  const db = await openDb();
  try {
    const processedData = { ...updateData };
    if (updateData.images) {
      (processedData as any).images = JSON.stringify(updateData.images);
    }
    if (updateData.colors) {
      (processedData as any).colors = JSON.stringify(updateData.colors);
    }
    if (updateData.sizes) {
      (processedData as any).sizes = JSON.stringify(updateData.sizes);
    }
    
    const fields = Object.keys(processedData).filter(key => processedData[key as keyof typeof processedData] !== undefined);
    const values = fields.map(field => processedData[field as keyof typeof processedData]);
    if (fields.length === 0) return null;
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE products SET ${setClause} WHERE id = ?`;
    await db.run(query, [...values, id]);
    return await getProductById(id);
  } finally {
    await db.close();
  }
}
// حذف محصول
export async function deleteProduct(id: number) {
  const db = await openDb();
  try {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    return true;
  } finally {
    await db.close();
  }
} 
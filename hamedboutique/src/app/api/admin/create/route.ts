import { NextRequest, NextResponse } from 'next/server';
import { initDb, openDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, name } = await request.json();

    // اعتبارسنجی ورودی
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    // راه‌اندازی دیتابیس
    await initDb();
    const db = await openDb();

    try {
      // بررسی وجود کاربر با همین نام کاربری یا ایمیل
      const existingUser = await db.get(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser) {
        return NextResponse.json(
          { error: 'نام کاربری یا ایمیل قبلاً استفاده شده است' },
          { status: 400 }
        );
      }

      // هش کردن رمز عبور
      const hashedPassword = await hashPassword(password);

      // ایجاد کاربر ادمین جدید
      await db.run(
        'INSERT INTO users (username, email, password, name, isAdmin) VALUES (?, ?, ?, ?, 1)',
        [username, email, hashedPassword, name]
      );

      return NextResponse.json({
        message: 'کاربر ادمین با موفقیت ایجاد شد',
        username,
        email,
        name
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('خطا در ایجاد کاربر ادمین:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد کاربر ادمین', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
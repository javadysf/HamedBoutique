import { NextRequest, NextResponse } from 'next/server';
import { initDb, createUser, findUserByEmail, findUserByUsername } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // اعتبارسنجی ورودی
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
        { status: 400 }
      );
    }

    // بررسی ایمیل معتبر
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'ایمیل معتبر نیست' },
        { status: 400 }
      );
    }

    // راه‌اندازی دیتابیس
    await initDb();

    // بررسی تکراری نبودن ایمیل
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'این ایمیل قبلاً ثبت شده است' },
        { status: 409 }
      );
    }

    // بررسی تکراری نبودن نام کاربری
    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'این نام کاربری قبلاً استفاده شده است' },
        { status: 409 }
      );
    }

    // هش کردن پسورد
    const hashedPassword = await hashPassword(password);

    // ایجاد کاربر
    const result = await createUser(username, email, hashedPassword);

    return NextResponse.json(
      { 
        message: 'کاربر با موفقیت ثبت شد',
        userId: result.lastID 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('خطا در ثبت‌نام:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت‌نام کاربر' },
      { status: 500 }
    );
  }
} 
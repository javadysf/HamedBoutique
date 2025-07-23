import { NextRequest, NextResponse } from 'next/server';
import { initDb, findUserByEmail } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // اعتبارسنجی ورودی
    if (!email || !password) {
      return NextResponse.json(
        { error: 'ایمیل و رمز عبور الزامی هستند' },
        { status: 400 }
      );
    }

    // راه‌اندازی دیتابیس
    await initDb();

    // پیدا کردن کاربر
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    // تایید پسورد
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    // تولید JWT توکن
    const token = generateToken(user.id, user.username);

    // حذف پسورد از پاسخ
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'ورود موفقیت‌آمیز',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('خطا در ورود:', error);
    return NextResponse.json(
      { error: 'خطا در ورود کاربر', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 
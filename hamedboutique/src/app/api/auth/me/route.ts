import { NextRequest, NextResponse } from 'next/server';
import { initDb, findUserById } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // استخراج توکن از header
    const authHeader = request.headers.get('authorization') || undefined;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    // تایید توکن
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'توکن نامعتبر است' },
        { status: 401 }
      );
    }

    // راه‌اندازی دیتابیس
    await initDb();

    // پیدا کردن کاربر
    const user = await findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user
    });

  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاربر:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات کاربر' },
      { status: 500 }
    );
  }
} 
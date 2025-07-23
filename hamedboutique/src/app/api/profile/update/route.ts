import { NextRequest, NextResponse } from 'next/server';
import { initDb, updateUser } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function PUT(request: NextRequest) {
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

    // دریافت داده‌های ارسالی
    const body = await request.json();
    const { name, phone, address, city, postalCode, birthDate, gender } = body;

    // راه‌اندازی دیتابیس
    await initDb();

    // بروزرسانی اطلاعات کاربر
    const updatedUser = await updateUser(decoded.userId, {
      name,
      phone,
      address,
      city,
      postalCode,
      birthDate,
      gender
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'اطلاعات با موفقیت بروزرسانی شد',
      user: updatedUser
    });

  } catch (error) {
    console.error('خطا در بروزرسانی پروفایل:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اطلاعات' },
      { status: 500 }
    );
  }
} 
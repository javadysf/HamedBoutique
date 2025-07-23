import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { initDb, updateUser } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    // دریافت فایل
    const formData = await request.formData();
    const file = formData.get('profileImage') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'فایل انتخاب نشده است' },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'فقط فایل‌های تصویری مجاز هستند' },
        { status: 400 }
      );
    }

    // بررسی اندازه فایل (حداکثر 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد' },
        { status: 400 }
      );
    }

    // ایجاد نام فایل منحصر به فرد
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = path.extname(file.name);
    const fileName = `profile_${decoded.userId}_${Date.now()}${fileExtension}`;
    
    // ایجاد مسیر ذخیره فایل
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // ذخیره مسیر فایل در دیتابیس
    const imageUrl = `/uploads/profiles/${fileName}`;
    await initDb();
    await updateUser(decoded.userId, { profileImage: imageUrl });

    return NextResponse.json({
      message: 'عکس پروفایل با موفقیت آپلود شد',
      imageUrl
    });

  } catch (error) {
    console.error('خطا در آپلود عکس:', error);
    return NextResponse.json(
      { error: 'خطا در آپلود عکس' },
      { status: 500 }
    );
  }
} 
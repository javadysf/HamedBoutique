import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password, hash } = await request.json();

    if (!password || !hash) {
      return NextResponse.json(
        { error: 'رمز عبور و هش الزامی هستند' },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, hash);

    return NextResponse.json({
      isValid,
      password,
      hash
    });
  } catch (error) {
    console.error('خطا در بررسی رمز عبور:', error);
    return NextResponse.json(
      { error: 'خطا در بررسی رمز عبور', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
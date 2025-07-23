import { NextRequest, NextResponse } from 'next/server';
import { addComment, getCommentsByProductId, initDb } from '@/lib/db';

// دریافت نظرات یک محصول
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'شناسه محصول ارسال نشده است' }, { status: 400 });
  }
  await initDb();
  const comments = await getCommentsByProductId(Number(productId));
  return NextResponse.json(comments);
}

// ثبت نظر جدید
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, user, text, rate } = body;
  if (!productId || !user || !text || !rate) {
    return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 });
  }
  await initDb();
  await addComment(Number(productId), user, text, Number(rate));
  return NextResponse.json({ message: 'نظر با موفقیت ثبت شد' });
} 
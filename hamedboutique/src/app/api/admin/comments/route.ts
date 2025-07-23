import { NextRequest, NextResponse } from 'next/server';
import { initDb, getCommentsByProductId, openDb } from '@/lib/db';

// دریافت همه نظرات
export async function GET() {
  await initDb();
  const db = await openDb();
  const comments = await db.all('SELECT * FROM comments ORDER BY created_at DESC');
  await db.close();
  return NextResponse.json(comments);
}

// حذف نظر
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'شناسه نظر الزامی است' }, { status: 400 });
  }
  await initDb();
  const db = await openDb();
  await db.run('DELETE FROM comments WHERE id = ?', [id]);
  await db.close();
  return NextResponse.json({ message: 'نظر حذف شد' });
} 
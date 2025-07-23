import { NextRequest, NextResponse } from 'next/server';
import { openDb, initDb } from '@/lib/db';

// دریافت لیست کاربران
export async function GET() {
  await initDb();
  const db = await openDb();
  const users = await db.all('SELECT id, username, email, isAdmin FROM users ORDER BY created_at DESC');
  await db.close();
  return NextResponse.json(users);
}

// تغییر نقش کاربر
export async function PUT(request: NextRequest) {
  const { id, isAdmin } = await request.json();
  if (!id) return NextResponse.json({ error: 'شناسه کاربر الزامی است' }, { status: 400 });
  await initDb();
  const db = await openDb();
  await db.run('UPDATE users SET isAdmin = ? WHERE id = ?', [isAdmin, id]);
  await db.close();
  return NextResponse.json({ message: 'نقش کاربر بروزرسانی شد' });
}

// حذف کاربر
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'شناسه کاربر الزامی است' }, { status: 400 });
  await initDb();
  const db = await openDb();
  await db.run('DELETE FROM users WHERE id = ?', [id]);
  await db.close();
  return NextResponse.json({ message: 'کاربر حذف شد' });
} 
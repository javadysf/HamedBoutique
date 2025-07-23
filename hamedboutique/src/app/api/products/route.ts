import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  await initDb();
  const products = await getAllProducts();
  return NextResponse.json(products);
} 
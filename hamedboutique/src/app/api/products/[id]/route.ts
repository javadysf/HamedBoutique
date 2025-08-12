import { NextRequest, NextResponse } from 'next/server';
import { getProductById, initDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'شناسه محصول نامعتبر است' }, { status: 400 });
    }

    await initDb();
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });
    }

    // پردازش تصاویر اضافی
    if (product.images && typeof product.images === 'string') {
      try {
        product.images = JSON.parse(product.images);
      } catch {
        product.images = [];
      }
    }

    // پردازش موجودی
    if (product.inventory && typeof product.inventory === 'string') {
      try {
        product.inventory = JSON.parse(product.inventory);
      } catch {
        product.inventory = [];
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('خطا در دریافت محصول:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات محصول' },
      { status: 500 }
    );
  }
}
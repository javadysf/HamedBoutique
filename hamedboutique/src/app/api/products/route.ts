import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    await initDb();
    let products = await getAllProducts();

    // فیلتر بر اساس دسته‌بندی
    if (category) {
      products = products.filter(product => 
        product.category && product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // پردازش تصاویر اضافی برای همه محصولات
    products = products.map(product => {
      if (product.images && typeof product.images === 'string') {
        try {
          product.images = JSON.parse(product.images);
        } catch {
          product.images = [];
        }
      }
      return product;
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست محصولات' },
      { status: 500 }
    );
  }
}
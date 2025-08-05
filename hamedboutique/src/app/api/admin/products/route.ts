import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById, initDb } from '@/lib/db';

export async function GET() {
  await initDb();
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, price, image, images, description, category, discount, colors, sizes } = body;
  if (!title || !price) {
    return NextResponse.json({ error: 'عنوان و قیمت الزامی است' }, { status: 400 });
  }
  await initDb();
  const result = await addProduct({ title, price, image, images, description, category, discount, colors, sizes });
  return NextResponse.json({ message: 'محصول با موفقیت افزوده شد', id: result.lastID });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  if (!id) {
    return NextResponse.json({ error: 'شناسه محصول الزامی است' }, { status: 400 });
  }
  await initDb();
  const updated = await updateProduct(Number(id), updateData);
  return NextResponse.json({ message: 'محصول ویرایش شد', product: updated });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'شناسه محصول الزامی است' }, { status: 400 });
  }
  await initDb();
  await deleteProduct(Number(id));
  return NextResponse.json({ message: 'محصول حذف شد' });
} 
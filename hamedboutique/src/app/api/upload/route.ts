import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'فایل انتخاب نشده است' }, { status: 400 });
    }

    // برای تست: استفاده از سرویس رایگان imgbb
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // آپلود به سرویس رایگان freeimage.host
    const formDataUpload = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    formDataUpload.append('source', blob);
    formDataUpload.append('type', 'file');
    formDataUpload.append('action', 'upload');

    const uploadResponse = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formDataUpload,
    });

    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      if (result.success) {
        return NextResponse.json({
          url: result.image.url,
          public_id: result.image.id
        });
      }
    }

    // اگر آپلود ناموفق بود، از راه‌حل ساده‌تر استفاده کن
    // تبدیل فایل به data URL و ذخیره موقت
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    return NextResponse.json({
      url: dataUrl,
      public_id: `temp-${Date.now()}`
    });
  } catch (error) {
    console.error('خطا در آپلود:', error);
    
    // در صورت خطا، تصویر پیش‌فرض
    return NextResponse.json({
      url: '/images/default-product.svg',
      public_id: 'default'
    });
  }
}
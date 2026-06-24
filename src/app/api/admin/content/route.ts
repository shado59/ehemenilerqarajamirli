import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, path: relativePath, content } = body;

    // ... (mövcud qovluq yaratma məntiqi) ...

    if (action === 'update') {
      const absolutePath = path.join(process.cwd(), relativePath);
      await fs.writeFile(absolutePath, content, 'utf-8');
      
      // Saytı yenilə
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }
    
    // Şəkil yükləmə (base64)
    if (action === 'upload') {
      const absolutePath = path.join(process.cwd(), 'public', relativePath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      const buffer = Buffer.from(content, 'base64');
      await fs.writeFile(absolutePath, buffer);
      return NextResponse.json({ success: true, url: relativePath });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Bu funksiyanı Admin səhifələrinə (Artifacts, Gallery və s.) əlavə et
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string, imgIdx?: number) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = (reader.result as string).split(',')[1];
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `images/uploads/${fileName}`;

    const github = new GitHubService(getSession()!);
    const success = await github.uploadImage(filePath, base64, 'Upload image');

    if (success) {
      const finalUrl = `/${filePath}`;
      // Burada state-i yeniləyirik (Artifacts nümunəsi)
      if (typeof imgIdx === 'number') {
        handleImageChange(itemId, imgIdx, finalUrl);
      } else {
        updateItem(itemId, 'image', finalUrl);
      }
    }
  };
  reader.readAsDataURL(file);
};
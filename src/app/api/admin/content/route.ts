import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get('path');

  if (!relativePath) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  try {
    const absolutePath = path.join(process.cwd(), relativePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Vercel-də revalidatePath işləməsi üçün
    if (action === 'revalidate') {
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    // Vercel mühitində lokal yazıla bilməz
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Local writing not allowed in production. Use GitHub mode.' }, { status: 403 });
    }

    // Lokal mühitdə yazmağa davam etsin (development üçün)
    const absolutePath = path.join(process.cwd(), body.path);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, body.content, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
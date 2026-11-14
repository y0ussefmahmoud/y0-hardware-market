import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { requireSellerOrAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const authorizedUser = await requireSellerOrAdmin(request);
    if (!authorizedUser) {
      return unauthorizedAdminResponse();
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    if (!VALID_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Resolves upload target directory: respects process.env.UPLOAD_DIR or defaults to public/uploads
    // In production with symlinks, public/uploads points directly to the persistent storage
    const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { requireSellerOrAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const VALID_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

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

    const fileExt = path.extname(file.name || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        { error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!VALID_MIME_TYPES.includes(file.type) && file.type !== 'application/octet-stream') {
      return NextResponse.json({ error: 'Invalid file MIME type' }, { status: 400 });
    }

    // Resolves upload target directory: respects process.env.UPLOAD_DIR or defaults to public/uploads
    // In production with symlinks, public/uploads points directly to the persistent storage
    const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const rawBase = path.basename(file.name || 'asset', fileExt).replace(/[^a-zA-Z0-9_-]/g, '') || 'silicon-asset';
    const timestamp = Date.now();
    const filename = `${timestamp}-${rawBase}${fileExt}`;
    const filepath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Guaranteed relative URL starting with /uploads/
    const url = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url,
      path: url,
      filename
    });
  } catch (error: any) {
    console.error('Error uploading file to storage:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file to storage' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const resolvedParams = await params;
  const filename = resolvedParams?.filename;

  if (!filename) {
    return new NextResponse('Filename is required', { status: 400 });
  }

  // Persistent storage path on Hostinger VPS
  const persistentDir = process.env.UPLOAD_DIR || '/home/u732920986/domains/hardwaremarket.y0ussef.com/uploads';

  // Sanitize filename against directory traversal
  const safeFilename = path.basename(filename);
  let filePath = path.join(persistentDir, safeFilename);

  // Check persistent directory; if absent, fallback to local public/uploads for local development
  if (!fs.existsSync(filePath)) {
    const localFallback = path.join(process.cwd(), 'public', 'uploads', safeFilename);
    if (fs.existsSync(localFallback)) {
      filePath = localFallback;
    } else {
      return new NextResponse('Image not found', { status: 404 });
    }
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);

    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.avif') contentType = 'image/avif';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

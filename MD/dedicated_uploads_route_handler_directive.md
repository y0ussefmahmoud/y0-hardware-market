# ⚡ System Directive: Dedicated Uploads Route Handler for Production (v1.3.12)

## 🎯 Objective:
Bypass unreliable production symbolic links in Next.js by implementing a robust, dedicated App Router Route Handler (`src/app/uploads/[filename]/route.ts`) that serves uploaded product images directly from the persistent server directory (`/home/u732920986/domains/hardwaremarket.y0ussef.com/uploads/`).

---

## 🛠️ Implementation Tasks:

### 1. Create Route Handler File
- **Target File Path:** `src/app/uploads/[filename]/route.ts`
- **Implementation Code:**
  ```typescript
  import { NextRequest, NextResponse } from 'next/server';
  import fs from 'fs';
  import path from 'path';

  export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> | { filename: string } }
  ) {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;

    // Persistent storage path on Hostinger VPS
    const persistentDir = process.env.UPLOAD_DIR || '/home/u732920986/domains/hardwaremarket.y0ussef.com/uploads';

    // Sanitize filename against directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(persistentDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);

      const ext = path.extname(safeFilename).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
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
  ```

### 2. Verification Protocol
Run the type check and production build commands:
```bash
npx tsc --noEmit
npm run build
```
Ensure zero errors (`Exit Code 0`) and successful compilation of all routes before pushing to remote repository.
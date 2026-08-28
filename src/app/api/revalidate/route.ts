// ===== On-Demand Revalidation API Route =====
// POST /api/revalidate - Invalidate Next.js cache by tag or path
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'y0-hardware-secret-revalidation-token-2026';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const secret =
      request.headers.get('x-revalidate-secret') ||
      searchParams.get('secret') ||
      body.secret;

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid revalidation secret token' },
        { status: 401 }
      );
    }

    const tag = body.tag || searchParams.get('tag');
    const path = body.path || searchParams.get('path');

    if (!tag && !path) {
      return NextResponse.json(
        { status: 'error', message: 'Missing "tag" or "path" parameter to revalidate' },
        { status: 400 }
      );
    }

    const revalidated: { tag?: string; path?: string } = {};

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag, 'default');
      revalidated.tag = tag;
    }

    if (path) {
      // Revalidate by path
      revalidatePath(path);
      revalidated.path = path;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Revalidation triggered successfully',
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error during on-demand revalidation:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal error during revalidation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret =
      request.headers.get('x-revalidate-secret') ||
      searchParams.get('secret');

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid revalidation secret token' },
        { status: 401 }
      );
    }

    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    if (!tag && !path) {
      return NextResponse.json(
        { status: 'error', message: 'Missing "tag" or "path" query parameter' },
        { status: 400 }
      );
    }

    const revalidated: { tag?: string; path?: string } = {};

    if (tag) {
      revalidateTag(tag, 'default');
      revalidated.tag = tag;
    }

    if (path) {
      revalidatePath(path);
      revalidated.path = path;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Revalidation triggered successfully',
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error during GET on-demand revalidation:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal error during revalidation' },
      { status: 500 }
    );
  }
}

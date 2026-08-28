import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

// GET all users
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const [users] = await pool.query(`
      SELECT id, email, first_name, last_name, phone, role, created_at
      FROM users
      ORDER BY created_at DESC
    `) as any;

    return NextResponse.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching users' },
      { status: 500 }
    );
  }
}

// PUT update user role
export async function PUT(request: NextRequest) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, role } = body;

    if (!id || !role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid request' },
        { status: 400 }
      );
    }

    if (id === admin.id) {
      return NextResponse.json(
        { status: 'error', message: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    return NextResponse.json({
      status: 'success',
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error updating user role' },
      { status: 500 }
    );
  }
}

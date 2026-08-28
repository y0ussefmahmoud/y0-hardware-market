import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect(`/${locale}`);
  }

  const decoded = verifyToken(token);
  if (!decoded?.id) {
    redirect(`/${locale}`);
  }

  const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [decoded.id]);
  const user = (users as { role: string }[])[0];

  if (!user || user.role !== 'admin') {
    redirect(`/${locale}`);
  }

  return children;
}

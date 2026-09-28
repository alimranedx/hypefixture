import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}

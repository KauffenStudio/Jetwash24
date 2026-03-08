import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

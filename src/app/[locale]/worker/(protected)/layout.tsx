import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function WorkerLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/worker/login`);
  }

  const role = (session.user as { role?: string }).role;
  if (role !== 'WORKER' && role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Top bar */}
      <header className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-black tracking-widest text-sm">
            JETWASH<span className="text-gold">24</span>
          </p>
          <p className="text-white/40 text-xs mt-0.5">Agenda do Trabalhador</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm">{session.user?.name}</span>
          <Link
            href={`/api/auth/signout?callbackUrl=/${locale}/worker/login`}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Sair
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

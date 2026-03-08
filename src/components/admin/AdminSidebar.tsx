'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '◉', path: '' },
  { key: 'bookings', label: 'Reservas', icon: '📋', path: '/bookings' },
  { key: 'calendar', label: 'Calendário', icon: '📅', path: '/calendar' },
  { key: 'services', label: 'Serviços', icon: '🛠', path: '/services' },
  { key: 'gallery', label: 'Galeria', icon: '🖼', path: '/gallery' },
  { key: 'blocked-slots', label: 'Bloquear', icon: '🚫', path: '/blocked-slots' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const basePath = `/${locale}/admin`;

  return (
    <aside className="w-64 bg-[#0A0A0A] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <p className="text-xl font-black tracking-widest text-white">
          JETWASH<span className="text-gold">24</span>
        </p>
        <p className="text-xs text-white/30 mt-1">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const href = `${basePath}${item.path}`;
          const isActive = item.path === ''
            ? pathname === basePath || pathname === `${basePath}/`
            : pathname.startsWith(href);

          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          ← Ver site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <span>⏏</span> Sair
        </button>
      </div>
    </aside>
  );
}

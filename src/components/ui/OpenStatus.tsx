'use client';

import { useEffect, useState } from 'react';

function isOpen() {
  const now = new Date();
  // Always use Lisbon time regardless of visitor's timezone
  const lisbon = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const h = parseInt(lisbon.find((p) => p.type === 'hour')!.value, 10);
  const m = parseInt(lisbon.find((p) => p.type === 'minute')!.value, 10);
  const totalMin = h * 60 + m;
  return totalMin >= 9 * 60 && totalMin < 17 * 60;
}

export default function OpenStatus({ locale }: { locale: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpen());

    // recalculate every minute
    const id = setInterval(() => setOpen(isOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (open === null) return null; // avoids hydration mismatch

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className={`text-sm font-medium ${open ? 'text-green-600' : 'text-red-500'}`}>
        {open
          ? (locale === 'pt' ? 'Aberto agora' : 'Open now')
          : (locale === 'pt' ? 'Fechado agora' : 'Closed now')}
      </span>
    </div>
  );
}

/**
 * "-20%" pill shown next to a discounted price.
 *
 * Two variants so the pill keeps strong contrast on either background:
 * `light` (black pill + gold text) sits on white/surface cards, `dark`
 * (gold pill + black text) sits on the near-black panels.
 *
 * Compute the number with `discountPercent()` in lib/utils — it rounds down
 * so the badge never advertises more than the customer actually saves.
 */
export default function DiscountBadge({
  percent,
  variant = 'light',
  className = '',
}: {
  percent: number;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const palette =
    variant === 'dark'
      ? 'bg-gold text-black'
      : 'bg-black text-gold';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-black leading-none tracking-wide tabular-nums ${palette} ${className}`}
    >
      −{percent}%
    </span>
  );
}

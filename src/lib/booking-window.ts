/**
 * How far ahead a customer has to book.
 *
 * Kept free of server-only imports on purpose: the booking wizard needs the
 * same answer the API enforces, and a shared rule is the only way the dates
 * offered and the dates accepted cannot drift apart.
 */

/**
 * Minimum notice, in days. 1 means "not today, from tomorrow onwards".
 * Raise it to 2 to also rule out tomorrow.
 */
export const MIN_NOTICE_DAYS = 1;

/** The shop's timezone. Every "today" below is today *here*, not on the server. */
export const SHOP_TIMEZONE = 'Europe/Lisbon';

/**
 * Today in Guia, as 'YYYY-MM-DD'.
 *
 * Deliberately not `new Date().toISOString().slice(0, 10)`. Vercel runs in UTC,
 * and Portugal is UTC+1 for most of the year — so between midnight and 01:00
 * local, UTC is still on the previous date. Asking Intl for the date in the
 * shop's own zone is correct on both sides of a DST change, and needs no
 * extra dependency.
 */
export function shopToday(): string {
  // 'en-CA' formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SHOP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * The first date a customer may book, as 'YYYY-MM-DD'.
 *
 * Arithmetic runs in UTC on a date-only value, so adding a day can never land
 * on the wrong date because the clocks moved that night.
 */
export function earliestBookableDate(): string {
  const [year, month, day] = shopToday().split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + MIN_NOTICE_DAYS);
  return d.toISOString().slice(0, 10);
}

/**
 * Whether `dateStr` ('YYYY-MM-DD') is far enough ahead to be booked.
 * ISO dates compare correctly as strings, so no parsing is needed.
 */
export function isBookableDate(dateStr: string): boolean {
  return dateStr >= earliestBookableDate();
}

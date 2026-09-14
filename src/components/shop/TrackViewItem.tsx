'use client';

import { useEffect, useRef } from 'react';
import { trackViewItem, type AnalyticsItem } from '@/lib/analytics';

/**
 * Fires GA4 `view_item` when a product page is opened. Rendered from the
 * server component so the item is built once, from the same data the page
 * displays.
 *
 * The ref guard makes it once per product, not once per effect run — React
 * StrictMode invokes effects twice in development, and a remount would
 * otherwise count a second view.
 */
export default function TrackViewItem({ item }: { item: AnalyticsItem }) {
  const tracked = useRef<string | null>(null);

  useEffect(() => {
    if (tracked.current === item.item_id) return;
    tracked.current = item.item_id;
    trackViewItem([item]);
    // The product is fixed for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.item_id]);

  return null;
}

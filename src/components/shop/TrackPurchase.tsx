'use client';

import { useEffect } from 'react';
import { trackPurchase, type AnalyticsItem } from '@/lib/analytics';

/**
 * Fires GA4 `purchase` on the order success page — the conversion Google Ads
 * bids against. Deduplicated by transaction id inside trackPurchase, because
 * this page survives a reload.
 */
export default function TrackPurchase({
  transactionId,
  value,
  shipping,
  items,
}: {
  transactionId: string;
  value: number;
  shipping: number;
  items: AnalyticsItem[];
}) {
  useEffect(() => {
    trackPurchase({ transactionId, value, shipping, items });
    // Keyed on the order alone: the figures never change for a given order.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  return null;
}

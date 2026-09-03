'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';

/**
 * Empties the cart once the customer lands on the success page — i.e. only
 * after Stripe accepted the payment, never on an abandoned checkout.
 */
export default function ClearCartOnMount() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);

  return null;
}

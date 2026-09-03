'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'jetwash24.cart.v1';

/** Hard cap per line, matching the limit the orders API enforces. */
export const MAX_PER_LINE = 20;

export type CartItem = {
  productId: string;
  slug: string;
  namePt: string;
  nameEn: string;
  price: number;
  image: string | null;
  /** Copied at add-to-cart time so the checkout can quote the slowest item. */
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  /** False until localStorage has been read, so the UI can avoid a hydration flash. */
  ready: boolean;
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  const item = value as CartItem;
  return (
    !!item &&
    typeof item.productId === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load once on mount. Anything malformed is dropped rather than crashing the shop.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter(isCartItem));
    } catch {
      // Ignore — start with an empty cart.
    }
    setReady(true);
  }, []);

  // Persist after every change, but only once the initial read is done so we
  // never overwrite a stored cart with the empty starting state.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked (private mode) — the cart just won't persist.
    }
  }, [items, ready]);

  // A single line never exceeds MAX_PER_LINE — a typo in the stepper should not
  // turn into a 200-unit order we then have to source by hand.
  const add = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (!existing) {
        return [...current, { ...item, quantity: Math.min(quantity, MAX_PER_LINE) }];
      }
      return current.map((i) =>
        i.productId === item.productId
          ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, MAX_PER_LINE) }
          : i,
      );
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => i.productId !== productId)
        : current.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, MAX_PER_LINE) }
              : i,
          ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal =
      Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
    return { items, ready, count, subtotal, add, setQuantity, remove, clear };
  }, [items, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
}

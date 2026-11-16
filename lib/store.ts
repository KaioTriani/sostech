"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getProduct, type Product } from "@/content/produtos";

export type CartLine = { slug: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, qty = 1) =>
        set((s) => {
          const p = getProduct(slug);
          const max = p?.stock ?? 99;
          const found = s.lines.find((l) => l.slug === slug);
          if (found) return { lines: s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(max, l.qty + qty) } : l)) };
          return { lines: [...s.lines, { slug, qty: Math.min(max, qty) }] };
        }),
      setQty: (slug, qty) =>
        set((s) => {
          const max = getProduct(slug)?.stock ?? 99;
          return { lines: qty <= 0 ? s.lines.filter((l) => l.slug !== slug) : s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(max, qty) } : l)) };
        }),
      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "sostechcel-carrinho", storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);

export type ResolvedLine = CartLine & { product: Product; total: number };

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines
    .map((l) => {
      const product = getProduct(l.slug);
      return product ? { ...l, product, total: product.price * l.qty } : null;
    })
    .filter(Boolean) as ResolvedLine[];
}

type UiState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toast: { id: number; title: string; slug?: string } | null;
  bump: number;
  setCart: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  setMenu: (v: boolean) => void;
  notifyAdded: (title: string, slug: string) => void;
  dismissToast: () => void;
};

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toast: null,
  bump: 0,
  setCart: (cartOpen) => set({ cartOpen, menuOpen: false }),
  setSearch: (searchOpen) => set({ searchOpen, menuOpen: false }),
  setMenu: (menuOpen) => set({ menuOpen }),
  notifyAdded: (title, slug) => set((s) => ({ toast: { id: Date.now(), title, slug }, bump: s.bump + 1 })),
  dismissToast: () => set({ toast: null }),
}));

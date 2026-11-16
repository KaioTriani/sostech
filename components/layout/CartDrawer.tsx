"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { resolveLines, useCart, useUi } from "@/lib/store";
import { useHydrated, useLockBody } from "@/lib/hooks";
import { money } from "@/lib/format";
import { useEffect } from "react";

export function CartDrawer() {
  const { cartOpen, setCart } = useUi();
  const { lines, setQty, remove } = useCart();
  const hydrated = useHydrated();
  const items = hydrated ? resolveLines(lines) : [];
  const subtotal = items.reduce((a, l) => a + l.total, 0);
  useLockBody(cartOpen);

  useEffect(() => {
    if (!cartOpen) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setCart(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [cartOpen, setCart]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCart(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 320 }}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-[440px] flex-col border-l border-white/10 bg-[#0a0a0a] pt-[env(safe-area-inset-top)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div>
                <p className="font-display text-lg font-semibold">Seu carrinho</p>
                <p className="text-xs text-white/45">{items.length ? `${items.reduce((a, l) => a + l.qty, 0)} item(ns)` : "Nenhum item ainda"}</p>
              </div>
              <button aria-label="Fechar carrinho" onClick={() => setCart(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
                      <ShoppingBag className="h-8 w-8 text-white/40" />
                    </div>
                    <p className="mt-5 font-display text-lg font-semibold">Seu carrinho está vazio</p>
                    <p className="mt-1 text-sm text-white/50">Explore smartphones e acessórios na loja.</p>
                    <Link href="/loja" onClick={() => setCart(false)} className="btn-primary mt-6">
                      Ir para a loja <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="grid gap-3">
                  <AnimatePresence initial={false}>
                    {items.map((l) => (
                      <motion.li
                        key={l.slug}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginTop: 0 }}
                        className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
                      >
                        <Link href={`/produto/${l.slug}`} onClick={() => setCart(false)} className="grid h-24 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent">
                          <ProductArt kind={l.product.art} color={l.product.color} className="h-20 w-20" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/produto/${l.slug}`} onClick={() => setCart(false)} className="line-clamp-2 text-sm font-medium leading-snug hover:text-brand-glow">
                              {l.product.name}
                            </Link>
                            <button aria-label={`Remover ${l.product.name}`} onClick={() => remove(l.slug)} className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/40 hover:bg-white/5 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-white/40">{money(l.product.price)} cada</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <Qty value={l.qty} max={l.product.stock} onChange={(q) => setQty(l.slug, q)} />
                            <span className="font-display text-[15px] font-semibold tabular-nums">{money(l.total)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/[0.07] bg-[#070707] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-white">{money(subtotal)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-white/60">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="font-display text-base font-semibold">Total</span>
                  <span className="font-display text-2xl font-bold tabular-nums">{money(subtotal)}</span>
                </div>
                <Link href="/checkout" onClick={() => setCart(false)} className="btn-primary mt-4 w-full">
                  Finalizar compra <ArrowRight className="h-4 w-4" />
                </Link>
                <button onClick={() => setCart(false)} className="mt-2 w-full py-2 text-sm text-white/50 hover:text-white">
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Qty({ value, max, onChange, size = "sm" }: { value: number; max: number; onChange: (n: number) => void; size?: "sm" | "lg" }) {
  const h = size === "lg" ? "h-12" : "h-9";
  const w = size === "lg" ? "w-12" : "w-9";
  return (
    <div className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] ${h}`}>
      <button aria-label="Diminuir quantidade" onClick={() => onChange(value - 1)} className={`grid ${h} ${w} place-items-center rounded-full text-white/70 hover:text-white`}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[1.75rem] text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button aria-label="Aumentar quantidade" disabled={value >= max} onClick={() => onChange(value + 1)} className={`grid ${h} ${w} place-items-center rounded-full text-white/70 hover:text-white disabled:opacity-30`}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

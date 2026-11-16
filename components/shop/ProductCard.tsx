"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Eye, ShoppingBag, Check } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import type { Product } from "@/content/produtos";
import { categoryLabel } from "@/content/produtos";
import { useCart, useUi } from "@/lib/store";
import { cx, discountPct, installmentText, money } from "@/lib/format";
import { site } from "@/lib/site";
import { useState } from "react";

const tagStyle: Record<string, string> = {
  NOVO: "bg-white text-black",
  OFERTA: "bg-brand-bright text-white",
  "MAIS VENDIDO": "bg-white/10 text-white border border-white/15 backdrop-blur",
};

export function ProductCard({ p, className }: { p: Product; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const add = useCart((s) => s.add);
  const notify = useUi((s) => s.notifyAdded);
  const [added, setAdded] = useState(false);
  const off = discountPct(p.price, p.oldPrice);
  const out = p.stock <= 0;

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }
  function onAdd() {
    add(p.slug);
    notify(p.name, p.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className={cx("group relative", className)}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="card flex h-full flex-col p-3 transition-colors duration-500 hover:border-brand-bright/30"
      >
        <Link href={`/produto/${p.slug}`} className="relative block overflow-hidden rounded-[1.25rem] bg-[radial-gradient(80%_70%_at_50%_35%,#16233a_0%,#0b0e14_55%,#07080a_100%)] [perspective:900px]" aria-label={`Ver ${p.name}`}>
          <div className="pointer-events-none absolute inset-x-8 bottom-6 h-10 rounded-full bg-brand-bright/30 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100" />
          <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative aspect-[4/4.3] [transform-style:preserve-3d]">
            <div className="absolute inset-0 grid place-items-center transition duration-700 ease-out group-hover:scale-[1.06] [transform:translateZ(30px)]">
              <ProductArt kind={p.art} color={p.color} className="h-[86%] w-[86%] drop-shadow-[0_24px_30px_rgba(0,0,0,.6)]" title={p.name} />
            </div>
          </motion.div>
          <motion.div style={{ left: glareX }} className="pointer-events-none absolute -top-1/2 h-[200%] w-24 -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition group-hover:opacity-100" />

          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {p.tags?.map((t) => (
              <span key={t} className={cx("rounded-full px-2.5 py-1 text-[9.5px] font-bold tracking-[0.12em]", tagStyle[t])}>
                {t}
              </span>
            ))}
          </div>
          {off && <span className="absolute right-2.5 top-2.5 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-brand-glow backdrop-blur">-{off}%</span>}
          {site.demoCatalog && <span className="absolute bottom-2.5 left-2.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50 backdrop-blur">Demo</span>}
          {out && <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-center text-[11px] font-medium text-white/80 backdrop-blur">Indisponível no momento</span>}
        </Link>

        <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">{categoryLabel[p.category]}</p>
          <Link href={`/produto/${p.slug}`} className="mt-1.5 line-clamp-2 font-display text-[15px] font-semibold leading-snug tracking-tight hover:text-brand-glow">
            {p.name}
          </Link>
          <div className="mt-3">
            {p.oldPrice && <p className="text-xs text-white/35 line-through tabular-nums">{money(p.oldPrice)}</p>}
            <p className="font-display text-xl font-bold tabular-nums tracking-tight">{money(p.price)}</p>
            {installmentText(p.price, p.installments) && <p className="text-[12px] text-white/50">{installmentText(p.price, p.installments)}</p>}
          </div>
          <div className="mt-auto flex gap-2 pt-4">
            <button
              onClick={onAdd}
              disabled={out}
              className={cx(
                "btn flex-1 !min-h-[44px] !px-3 text-[13.5px]",
                added ? "bg-[#1fae5b] text-white" : "bg-white text-black hover:bg-brand-bright hover:text-white",
              )}
              aria-label={`Adicionar ${p.name} ao carrinho`}
            >
              <motion.span key={String(added)} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2">
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {added ? "Adicionado" : out ? "Esgotado" : "Adicionar"}
              </motion.span>
            </button>
            <Link href={`/produto/${p.slug}`} aria-label={`Detalhes de ${p.name}`} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 sm:grid text-white/70 transition hover:border-white/30 hover:text-white">
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

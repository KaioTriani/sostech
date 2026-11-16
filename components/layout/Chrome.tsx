"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Store, Wrench, ShoppingBag, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useCart, useUi, resolveLines } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { waLink, WA_GERAL } from "@/lib/site";
import { cx } from "@/lib/format";
import { ProductArt } from "@/components/art/ProductArt";
import { getProduct } from "@/content/produtos";

/** Barra inferior do mobile: Início, Loja, Assistência, Carrinho e WhatsApp. */
export function MobileNav() {
  const pathname = usePathname();
  const { setCart, bump } = useUi();
  const count = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const hydrated = useHydrated();
  const item = "flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition";
  const on = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  return (
    <nav aria-label="Navegação rápida" className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="mx-3 mb-[calc(env(safe-area-inset-bottom)+10px)] flex h-[64px] items-stretch rounded-[22px] border border-white/10 bg-[#0b0b0b]/85 px-1 shadow-[0_20px_50px_-10px_rgba(0,0,0,.9)] backdrop-blur-xl">
        <Link href="/" className={cx(item, on("/") ? "text-white" : "text-white/50")}>
          <Home className="h-5 w-5" /> Início
        </Link>
        <Link href="/loja" className={cx(item, on("/loja") || on("/produto") ? "text-white" : "text-white/50")}>
          <Store className="h-5 w-5" /> Loja
        </Link>
        <Link href="/assistencia" className={cx(item, on("/assistencia") ? "text-white" : "text-white/50")}>
          <Wrench className="h-5 w-5" /> Assistência
        </Link>
        <button onClick={() => setCart(true)} className={cx(item, "relative text-white/50")}>
          <motion.span key={bump} animate={bump ? { scale: [1, 1.3, 1] } : {}} className="relative">
            <ShoppingBag className="h-5 w-5" />
            {hydrated && count > 0 && <span className="absolute -right-2.5 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand-bright px-1 text-[9px] font-bold text-white">{count}</span>}
          </motion.span>
          Carrinho
        </button>
        <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" className={cx(item, "text-[#3ddc84]")}>
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </nav>
  );
}

/** Botão flutuante de WhatsApp (desktop e tablet; no celular ele já está na barra inferior). */
export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14 }}
          href={waLink(WA_GERAL)}
          target="_blank"
          rel="noopener"
          aria-label="Conversar pelo WhatsApp"
          className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 md:flex"
        >
          <span className="pointer-events-none translate-x-2 rounded-full border border-white/10 bg-[#0b0b0b]/90 px-4 py-2 text-sm font-medium opacity-0 backdrop-blur transition group-hover:translate-x-0 group-hover:opacity-100">
            Fale com a gente
          </span>
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1fae5b] text-white shadow-[0_12px_30px_-6px_rgba(31,174,91,.6)] transition group-hover:scale-105">
            <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#1fae5b]" />
            <WhatsAppIcon className="relative h-7 w-7" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/** Feedback visual ao adicionar produto ao carrinho. */
export function CartToast() {
  const { toast, dismissToast, setCart } = useUi();
  const lines = useCart((s) => s.lines);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 3600);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);
  const p = toast?.slug ? getProduct(toast.slug) : undefined;
  const total = resolveLines(lines).reduce((a, l) => a + l.qty, 0);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+86px)] z-[60] flex justify-center px-3 md:bottom-auto md:left-auto md:right-6 md:top-24 md:justify-end">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 340 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d0d]/95 p-3 shadow-2xl backdrop-blur-xl"
            role="status"
          >
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/[0.05]">
              {p && <ProductArt kind={p.art} color={p.color} className="h-12 w-12" />}
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring" }} className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-brand-bright text-white ring-2 ring-[#0d0d0d]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-brand-glow">Adicionado ao carrinho</p>
              <p className="truncate text-sm font-medium">{toast.title}</p>
              <p className="text-xs text-white/45">{total} item(ns) no carrinho</p>
            </div>
            <button onClick={() => { dismissToast(); setCart(true); }} className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90">
              Ver
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Abertura personalizada: logo pulsa com um anel de varredura e some. */
export function Intro() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("sos-intro")) return setDone(true);
    const t = setTimeout(() => {
      setDone(true);
      try { sessionStorage.setItem("sos-intro", "1"); } catch {}
    }, 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#050505]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden="true"
        >
          <div className="relative grid place-items-center">
            <motion.div
              className="absolute h-36 w-36 rounded-full border border-brand-bright/40"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.25], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <motion.svg viewBox="0 0 100 100" className="absolute h-28 w-28" initial={{ rotate: -90 }} animate={{ rotate: 270 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}>
              <circle cx="50" cy="50" r="46" fill="none" stroke="#168AFF" strokeWidth="1.5" strokeDasharray="60 230" strokeLinecap="round" />
            </motion.svg>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-sos-tech-cel.png" alt="" className="h-full w-full scale-110 object-contain" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

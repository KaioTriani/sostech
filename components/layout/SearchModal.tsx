"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Wrench, X, CornerDownLeft } from "lucide-react";
import { products, categoryLabel } from "@/content/produtos";
import { services } from "@/content/servicos";
import { ProductArt } from "@/components/art/ProductArt";
import { useUi } from "@/lib/store";
import { money } from "@/lib/format";
import { useLockBody } from "@/lib/hooks";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function SearchModal() {
  const { searchOpen, setSearch } = useUi();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useLockBody(searchOpen);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") setSearch(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setSearch]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => input.current?.focus(), 80);
    else setQ("");
  }, [searchOpen]);

  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return { p: products.slice(0, 4), s: [] as typeof services };
    const terms = t.split(/\s+/);
    const match = (s: string) => terms.every((w) => norm(s).includes(w));
    return {
      p: products.filter((p) => match(`${p.name} ${p.brand} ${categoryLabel[p.category]} ${p.short}`)).slice(0, 6),
      s: services.filter((s) => match(`${s.title} ${s.text}`)).slice(0, 4),
    };
  }, [q]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[calc(env(safe-area-inset-top)+12px)] sm:pt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setSearch(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pesquisar"
            initial={{ y: -20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 380 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <Search className="h-5 w-5 shrink-0 text-brand-bright" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar iPhone, película, troca de tela..."
                className="h-16 w-full bg-transparent text-base text-white outline-none placeholder:text-white/35"
                aria-label="Termo de busca"
              />
              <button aria-label="Fechar busca" onClick={() => setSearch(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-3">
              {results.p.length > 0 && (
                <>
                  <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{q ? "Produtos" : "Sugestões"}</p>
                  <ul className="grid gap-1">
                    {results.p.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/produto/${p.slug}`} onClick={() => setSearch(false)} className="group flex items-center gap-3 rounded-2xl p-2 hover:bg-white/[0.05]">
                          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/[0.04]">
                            <ProductArt kind={p.art} color={p.color} className="h-12 w-12" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{p.name}</span>
                            <span className="block text-xs text-white/45">{categoryLabel[p.category]}</span>
                          </span>
                          <span className="text-sm font-semibold tabular-nums">{money(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {results.s.length > 0 && (
                <>
                  <p className="px-2 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Assistência técnica</p>
                  <ul className="grid gap-1">
                    {results.s.map((s) => (
                      <li key={s.id}>
                        <Link href={`/assistencia#${s.id}`} onClick={() => setSearch(false)} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-white/[0.05]">
                          <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand/20 text-brand-glow">
                            <Wrench className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{s.title}</span>
                            <span className="block truncate text-xs text-white/45">{s.text}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {q && !results.p.length && !results.s.length && (
                <div className="px-4 py-10 text-center">
                  <p className="font-medium">Nada encontrado para “{q}”.</p>
                  <p className="mt-1 text-sm text-white/50">Tente outro termo ou fale com a gente pelo WhatsApp.</p>
                </div>
              )}
            </div>
            <div className="hidden items-center justify-between border-t border-white/[0.07] px-4 py-2.5 text-[11px] text-white/35 sm:flex">
              <span className="inline-flex items-center gap-1.5"><CornerDownLeft className="h-3 w-3" /> abrir</span>
              <span>Ctrl + K para buscar · Esc para fechar</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

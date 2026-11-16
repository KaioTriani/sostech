"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, Search, Info } from "lucide-react";
import { products, categoryLabel, brands, type CategoryId } from "@/content/produtos";
import { ProductCard } from "@/components/shop/ProductCard";
import { cx, money } from "@/lib/format";
import { site } from "@/lib/site";
import { useLockBody } from "@/lib/hooks";

const sorts = {
  relevancia: "Relevância",
  "mais-vendidos": "Mais vendidos",
  novidades: "Novidades",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  ofertas: "Ofertas",
} as const;
type SortKey = keyof typeof sorts;

const groups = { smartphones: "Smartphones", acessorios: "Acessórios", eletronicos: "Eletrônicos" } as const;
const priceRanges = [
  { id: "ate-100", label: "Até R$ 100", min: 0, max: 100 },
  { id: "100-500", label: "R$ 100 a R$ 500", min: 100, max: 500 },
  { id: "500-2000", label: "R$ 500 a R$ 2.000", min: 500, max: 2000 },
  { id: "acima-2000", label: "Acima de R$ 2.000", min: 2000, max: Infinity },
];

export function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useLockBody(open);

  const f = {
    grupo: params.get("grupo") ?? "",
    categoria: params.get("categoria") ?? "",
    marca: params.get("marca") ?? "",
    preco: params.get("preco") ?? "",
    estoque: params.get("estoque") === "1",
    ordem: (params.get("ordem") as SortKey) ?? "relevancia",
  };

  function set(key: string, value: string | null) {
    const p = new URLSearchParams(params.toString());
    if (!value) p.delete(key);
    else p.set(key, value);
    if (key === "grupo") p.delete("categoria");
    router.replace(`/loja${p.toString() ? `?${p}` : ""}`, { scroll: false });
  }
  const clear = () => router.replace("/loja", { scroll: false });

  const list = useMemo(() => {
    const range = priceRanges.find((r) => r.id === f.preco);
    const t = q.trim().toLowerCase();
    let l = products.filter(
      (p) =>
        (!f.grupo || p.group === f.grupo) &&
        (!f.categoria || p.category === f.categoria) &&
        (!f.marca || p.brand === f.marca) &&
        (!range || (p.price >= range.min && p.price < range.max)) &&
        (!f.estoque || p.stock > 0) &&
        (f.ordem !== "ofertas" || !!p.oldPrice) &&
        (!t || `${p.name} ${p.brand}`.toLowerCase().includes(t)),
    );
    const by: Record<SortKey, (a: (typeof l)[0], b: (typeof l)[0]) => number> = {
      relevancia: (a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.sold - a.sold,
      "mais-vendidos": (a, b) => b.sold - a.sold,
      novidades: (a, b) => b.addedAt.localeCompare(a.addedAt),
      "menor-preco": (a, b) => a.price - b.price,
      "maior-preco": (a, b) => b.price - a.price,
      ofertas: (a, b) => (b.oldPrice ?? 0) - b.price - ((a.oldPrice ?? 0) - a.price),
    };
    return [...l].sort(by[f.ordem] ?? by.relevancia);
  }, [f.grupo, f.categoria, f.marca, f.preco, f.estoque, f.ordem, q]);

  const cats = (Object.keys(categoryLabel) as CategoryId[]).filter((c) => !f.grupo || products.some((p) => p.category === c && p.group === f.grupo));
  const activeCount = [f.grupo, f.categoria, f.marca, f.preco, f.estoque ? "1" : ""].filter(Boolean).length;
  const title = f.categoria ? categoryLabel[f.categoria as CategoryId] : f.grupo ? groups[f.grupo as keyof typeof groups] : "Loja";

  const Filters = (
    <div className="grid gap-7">
      <FilterGroup title="Departamento">
        <div className="flex flex-wrap gap-2">
          <button className="chip" data-active={!f.grupo} onClick={() => set("grupo", null)}>Todos</button>
          {Object.entries(groups).map(([k, v]) => (
            <button key={k} className="chip" data-active={f.grupo === k} onClick={() => set("grupo", f.grupo === k ? null : k)}>{v}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Categoria">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} className="chip" data-active={f.categoria === c} onClick={() => set("categoria", f.categoria === c ? null : c)}>{categoryLabel[c]}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Marca">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button key={b} className="chip" data-active={f.marca === b} onClick={() => set("marca", f.marca === b ? null : b)}>{b}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Faixa de preço">
        <div className="grid gap-2">
          {priceRanges.map((r) => (
            <label key={r.id} className="flex min-h-[40px] cursor-pointer items-center gap-3 text-sm text-white/75">
              <input type="radio" name="preco" checked={f.preco === r.id} onChange={() => set("preco", r.id)} className="h-4 w-4 accent-[#168AFF]" />
              {r.label}
            </label>
          ))}
          {f.preco && <button onClick={() => set("preco", null)} className="w-fit text-xs text-brand-glow">Limpar preço</button>}
        </div>
      </FilterGroup>
      <FilterGroup title="Disponibilidade">
        <label className="flex min-h-[40px] cursor-pointer items-center justify-between gap-3 text-sm text-white/75">
          Somente disponíveis
          <button
            role="switch"
            aria-checked={f.estoque}
            onClick={() => set("estoque", f.estoque ? null : "1")}
            className={cx("relative h-7 w-12 rounded-full transition", f.estoque ? "bg-brand-bright" : "bg-white/15")}
          >
            <span className={cx("absolute top-1 h-5 w-5 rounded-full bg-white transition-all", f.estoque ? "left-6" : "left-1")} />
          </button>
        </label>
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-x pb-16 pt-28 sm:pt-32">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">SOS TECH CEL · Loja</span>
        <motion.h1 key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-display text-4xl sm:text-6xl">
          {title}
        </motion.h1>
      </div>

      {site.demoCatalog && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-bright/25 bg-brand-bright/[0.07] p-4 text-sm text-white/75">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
          <p>
            <strong className="font-semibold text-white">Catálogo demonstrativo.</strong> Produtos, preços, parcelamento e estoque são exemplos para apresentar a loja e serão substituídos pelos dados reais da SOS TECH CEL.
          </p>
        </div>
      )}

      <div className="sticky top-16 z-30 -mx-4 mt-6 flex flex-wrap items-center gap-2 border-b border-white/[0.06] bg-[#050505]/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar na loja" aria-label="Buscar na loja" className="field !rounded-full !py-2.5 pl-10" />
        </div>
        <button onClick={() => setOpen(true)} className="chip relative flex-1 justify-center sm:flex-none lg:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filtros
          {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-bright px-1 text-[10px] font-bold">{activeCount}</span>}
        </button>
        <label className="sr-only" htmlFor="ordem">Ordenar por</label>
        <select id="ordem" value={f.ordem} onChange={(e) => set("ordem", e.target.value === "relevancia" ? null : e.target.value)} className="field !w-auto flex-1 sm:flex-none !rounded-full !py-2.5 pr-8 text-sm [&>option]:bg-[#0d0d0d]">
          {Object.entries(sorts).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display font-semibold">Filtros</p>
              {activeCount > 0 && <button onClick={clear} className="text-xs text-brand-glow hover:text-white">Limpar tudo</button>}
            </div>
            {Filters}
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-white/45">{list.length} produto(s)</p>
          {list.length === 0 ? (
            <div className="card grid place-items-center px-6 py-20 text-center">
              <p className="font-display text-xl font-semibold">Nenhum produto com esses filtros.</p>
              <p className="mt-2 text-sm text-white/50">Ajuste os filtros ou consulte a disponibilidade pelo WhatsApp.</p>
              <button onClick={() => { clear(); setQ(""); }} className="btn-primary mt-6">Limpar filtros</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((p) => (
                  <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                    <ProductCard p={p} className="h-full" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* filtros mobile em bottom sheet */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[85] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, i) => i.offset.y > 120 && setOpen(false)}
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] border-t border-white/10 bg-[#0b0b0b]"
            >
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />
              <div className="flex items-center justify-between px-5 py-4">
                <p className="font-display text-lg font-semibold">Filtros</p>
                <button aria-label="Fechar filtros" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-4">{Filters}</div>
              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.07] px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
                <button onClick={clear} className="btn-ghost">Limpar</button>
                <button onClick={() => setOpen(false)} className="btn-primary">Ver {list.length} produto(s)</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{title}</p>
      {children}
    </div>
  );
}


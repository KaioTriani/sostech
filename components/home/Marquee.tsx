const items = ["Troca de telas", "Baterias", "Reparos em placas", "Smartphones", "Acessórios", "Notebooks", "Tablets", "Diagnóstico técnico", "Películas", "Carregadores"];

/** Faixa contínua entre o hero e as categorias (CSS puro, leve no mobile). */
export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-[#070707] py-4" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070707] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070707] to-transparent" />
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 motion-reduce:animate-none">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-sm font-medium uppercase tracking-[0.18em] text-white/40">
            {t}
            <span className="h-1.5 w-1.5 rotate-45 bg-brand-bright/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

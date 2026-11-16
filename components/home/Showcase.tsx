"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { products } from "@/content/produtos";
import { ProductArt } from "@/components/art/ProductArt";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHead, Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { installmentText, money, cx } from "@/lib/format";
import { waLink } from "@/lib/site";

const phones = products.filter((p) => p.group === "smartphones");

/** G. Vitrine de smartphones: palco editorial com seletor de aparelhos. */
export function Showcase() {
  const [idx, setIdx] = useState(0);
  const p = phones[idx];

  return (
    <section id="smartphones" className="relative overflow-hidden py-14 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_30%_55%,rgba(7,86,201,.22),transparent_70%)]" />
      <div className="container-x relative">
        <SectionHead eyebrow="Vitrine" title={<>Tecnologia que <br className="hidden sm:block" />combina com você.</>} />

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 [&>*]:min-w-0">
          {/* palco */}
          <Reveal className="relative lg:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[radial-gradient(70%_60%_at_50%_40%,#132544_0%,#0a0f19_50%,#060608_100%)] sm:aspect-[16/11]">
              <div className="grid-lines absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
              <div className="absolute inset-x-[15%] bottom-[8%] h-8 rounded-[50%] bg-brand-bright/25 blur-2xl" />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={p.slug}
                  className="absolute inset-0 flex items-center justify-center gap-[2%] [perspective:1400px]"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div initial={{ rotateY: 40 }} animate={{ rotateY: 18 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="h-[78%] w-[42%]">
                    <ProductArt kind={p.art} color={p.color} view="front" className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.7)]" title={`${p.name}, frente`} />
                  </motion.div>
                  <motion.div initial={{ rotateY: -40, y: 20 }} animate={{ rotateY: -14, y: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="-ml-[10%] h-[86%] w-[46%]">
                    <ProductArt kind={p.art} color={p.color} view="back" className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.7)]" title={`${p.name}, traseira`} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white/60 backdrop-blur">
                {String(idx + 1).padStart(2, "0")} / {String(phones.length).padStart(2, "0")}
              </span>
            </div>
          </Reveal>

          {/* detalhes */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div key={p.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-glow">{p.brand}</p>
                <h3 className="h-display mt-2 text-3xl sm:text-4xl">{p.name}</h3>
                <p className="mt-3 text-white/60">{p.short}</p>
                <ul className="mt-5 grid gap-2.5">
                  {p.highlights?.map((h) => (
                    <li key={h} className="flex items-center gap-3 text-sm text-white/80">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-bright/15 text-brand-bright">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-end gap-3">
                  <p className="font-display text-3xl font-bold tabular-nums">{money(p.price)}</p>
                  {p.oldPrice && <p className="pb-1 text-sm text-white/35 line-through">{money(p.oldPrice)}</p>}
                </div>
                {installmentText(p.price, p.installments) && <p className="text-sm text-white/50">{installmentText(p.price, p.installments)}</p>}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/produto/${p.slug}`} className="btn-primary">
                    Visualizar <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href={waLink(`Olá! Gostaria de consultar a disponibilidade do ${p.name}.`)} target="_blank" rel="noopener" className="btn-ghost">
                    <WhatsAppIcon className="h-4 w-4 text-[#3ddc84]" /> Consultar disponibilidade
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="scroll-x mt-8 !pb-1" role="tablist" aria-label="Escolher smartphone">
              {phones.map((ph, i) => (
                <button
                  key={ph.slug}
                  role="tab"
                  aria-selected={i === idx}
                  onClick={() => setIdx(i)}
                  className={cx(
                    "flex shrink-0 snap-start items-center gap-2 rounded-2xl border px-2 py-2 pr-4 text-left transition",
                    i === idx ? "border-brand-bright/60 bg-brand-bright/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20",
                  )}
                >
                  <ProductArt kind={ph.art} color={ph.color} className="h-12 w-12" />
                  <span className="max-w-[120px] text-[12px] font-medium leading-tight">{ph.name.replace(/ \d+ GB$/, "")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Seleção de produtos (mais vendidos) com galeria deslizável no mobile. */
export function FeaturedProducts() {
  const list = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  return (
    <section className="relative py-14 sm:py-20">
      <div className="container-x">
        <SectionHead eyebrow="Loja" title="Os mais procurados." text="Produtos demonstrativos para apresentar a experiência de compra. O catálogo real entra assim que for enviado.">
          <Link href="/loja" className="btn-ghost self-start md:self-auto">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionHead>
      </div>
      <div className="scroll-x container-x mt-10 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) * 0.06} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
            <ProductCard p={p} className="h-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

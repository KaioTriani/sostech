"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/content/produtos";
import { ProductArt } from "@/components/art/ProductArt";
import { SectionHead, stagger, rise } from "@/components/ui/Reveal";

export function CategorySection() {
  return (
    <section id="categorias" className="relative py-14 sm:py-20">
      <div className="container-x">
        <SectionHead eyebrow="Categorias" title={<>Encontre o que <span className="text-brand-bright">você procura.</span></>} text="Do smartphone novo ao cabo certo para o seu carregador, organizado para você chegar rápido.">
          <Link href="/loja" className="btn-ghost self-start md:self-auto">
            Ver loja completa <ArrowUpRight className="h-4 w-4" />
          </Link>
        </SectionHead>
      </div>

      {/* mobile: galeria deslizável · desktop: grade */}
      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="scroll-x container-x mt-10 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible"
      >
        {categories.map((c, i) => (
          <motion.li key={c.id} variants={rise} className={`shrink-0 snap-start ${i < 2 ? `w-[62%] sm:w-[40%] md:w-auto ${i === 0 ? "md:col-span-3" : "md:col-span-2"}` : "w-[42%] sm:w-[28%] md:w-auto"}`}>
            <Link
              href={c.href}
              className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#111520] to-[#0a0a0a] p-4 transition duration-500 hover:-translate-y-1 hover:border-brand-bright/40 hover:shadow-glow ${i < 2 ? "min-h-[220px] md:min-h-[260px] md:flex-row md:items-end" : "min-h-[200px]"}`}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-bright/10 blur-3xl transition duration-700 group-hover:bg-brand-bright/25" />
              <div className={`relative ${i < 2 ? "md:order-2 md:w-1/2" : ""}`}>
                <ProductArt
                  kind={c.art}
                  color={c.color}
                  view={c.id === "smartphones" ? "front" : "back"}
                  className={`mx-auto transition duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.08] group-hover:-rotate-3 ${i < 2 ? "h-36 w-36 md:h-52 md:w-52" : "h-28 w-28"}`}
                  title={c.label}
                />
              </div>
              <div className={`relative flex items-end justify-between gap-2 ${i < 2 ? "md:w-1/2 md:flex-col md:items-start" : ""}`}>
                <div>
                  <p className={`font-display font-semibold tracking-tight ${i < 2 ? "text-xl md:text-3xl" : "text-[15px]"}`}>{c.label}</p>
                  <p className="mt-0.5 text-xs text-white/40 transition group-hover:text-brand-glow">Explorar</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 transition duration-500 group-hover:rotate-45 group-hover:border-brand-bright group-hover:bg-brand-bright">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

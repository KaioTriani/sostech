"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { instagramPosts } from "@/content/servicos";
import { InstagramIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * I. Instagram integrado.
 * Galeria administrável manualmente em content/servicos.ts (instagramPosts),
 * com as imagens em public/instagram. Para integração automática, conectar a
 * Instagram Graph API (conta profissional) e trocar a fonte desta lista.
 */
export function InstagramSection() {
  const posts = instagramPosts;
  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <span className="eyebrow">{site.instagramHandle}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-display mt-4 max-w-xl text-[2rem] leading-[1.05] sm:text-5xl">Reparos, produtos e bastidores.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a href={site.instagram} target="_blank" rel="noopener" className="btn-ghost">
              <InstagramIcon /> Acompanhe a SOS TECH CEL no Instagram
            </a>
          </Reveal>
        </div>
      </div>

      {/* vitrine editorial: colunas com alturas diferentes no desktop, faixa deslizável no mobile */}
      <div className="scroll-x container-x mt-10 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible lg:grid-cols-5">
        {posts.map((p, i) => (
          <motion.a
            key={p.src}
            href={site.instagram}
            target="_blank"
            rel="noopener"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: (i % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative block w-[58%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0b] sm:w-[38%] md:w-auto ${
              i % 5 === 1 || i % 5 === 3 ? "md:translate-y-10" : ""
            } ${i >= 6 ? "md:hidden" : ""} ${i === 5 ? "lg:hidden" : ""}`}
          >
            <div className="relative aspect-[9/14]">
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 60vw, 20vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />
              <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur">{p.tag}</span>
              <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <p className="absolute bottom-3 left-3 right-14 line-clamp-2 text-[12px] leading-snug text-white/80">{p.alt}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

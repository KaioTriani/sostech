"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services, type Service } from "@/content/servicos";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { waLink, WA_ORCAMENTO } from "@/lib/site";
import { cx } from "@/lib/format";

export function ServiceCard({ s, index, featured }: { s: Service; index: number; featured?: boolean }) {
  return (
    <article
      id={s.id}
      className={cx(
        "group relative flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0a0a0a] transition duration-500 hover:border-brand-bright/35",
        featured ? "min-h-[340px] sm:min-h-[420px]" : "min-h-[220px]",
      )}
    >
      {s.image && (
        <div className="absolute inset-0">
          <Image src={s.image} alt={s.imageAlt ?? s.title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover opacity-55 grayscale-[35%] transition duration-[1.2s] ease-out group-hover:scale-105 group-hover:opacity-75 group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/10" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,86,201,.35),transparent_45%)] mix-blend-screen" />
        </div>
      )}
      {!s.image && <div className="grid-lines absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />}
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/40 text-brand-bright backdrop-blur transition duration-500 group-hover:border-brand-bright/50 group-hover:bg-brand-bright group-hover:text-white">
            <ServiceIcon name={s.icon} className="h-[22px] w-[22px]" />
          </span>
          <span className="font-display text-xs tabular-nums text-white/30">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="mt-auto pt-10">
          <h3 className={cx("font-display font-semibold tracking-tight", featured ? "text-2xl sm:text-3xl" : "text-lg")}>{s.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">{s.text}</p>
          <a
            href={waLink(`Olá! Gostaria de um orçamento para: ${s.title}.`)}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-brand-glow transition hover:gap-3 hover:text-white"
          >
            Pedir orçamento <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

/** E. Assistência técnica: o diferencial da SOS TECH CEL. */
export function Assistance({ full = false }: { full?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const list = full ? services : services.slice(0, 7);

  return (
    <section id="assistencia" className="relative overflow-hidden py-14 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand/15 blur-[120px]" />
      </div>

      <div className="container-x relative">
        <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <span className="eyebrow">Assistência técnica</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-display mt-4 text-[2.1rem] leading-[1.04] sm:text-5xl lg:text-[3.4rem]">
                Seu aparelho merece uma assistência <span className="bg-gradient-to-r from-brand-glow to-brand-bright bg-clip-text text-transparent">de verdade.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15.5px] leading-relaxed text-white/65">
                Problemas no celular ou notebook? A SOS TECH CEL oferece assistência técnica especializada para devolver o desempenho e a funcionalidade dos seus dispositivos.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a href={waLink(WA_ORCAMENTO)} target="_blank" rel="noopener" className="btn-wa h-14 px-7 text-base">
                  <WhatsAppIcon /> Solicitar orçamento pelo WhatsApp
                </a>
                {!full && (
                  <Link href="/assistencia" className="btn-ghost h-14 px-7">
                    Todos os serviços <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </Reveal>

            {/* foto real da bancada com parallax */}
            <Reveal delay={0.2} className="mt-10 hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[0.07]">
                <motion.div style={{ y }} className="absolute -inset-y-10 inset-x-0">
                  <Image src="/servicos/diagnostico.webp" alt="Smartphone em teste na bancada da SOS TECH CEL" fill sizes="40vw" className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
                  <div className="h-1/3 w-full animate-scan bg-gradient-to-b from-transparent via-brand-bright/15 to-transparent" />
                </div>
                <p className="absolute bottom-4 left-4 text-xs text-white/70">Bancada SOS TECH CEL · Mangabeira II</p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {list.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 0.08} className={i === 0 ? "sm:col-span-2" : ""}>
                <ServiceCard s={s} index={i} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

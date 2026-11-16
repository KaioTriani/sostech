"use client";

import { motion } from "framer-motion";
import { Wrench, UserRound, ScanSearch, PackageCheck, BadgeCheck, Headset } from "lucide-react";
import { Reveal, stagger, rise } from "@/components/ui/Reveal";

const items = [
  { icon: Wrench, title: "Assistência técnica especializada", text: "Celulares, tablets e notebooks avaliados e reparados em bancada própria." },
  { icon: UserRound, title: "Atendimento personalizado", text: "Você fala direto com a equipe, na loja ou pelo WhatsApp." },
  { icon: ScanSearch, title: "Diagnóstico transparente", text: "Você entende o problema e o orçamento antes de autorizar o reparo." },
  { icon: PackageCheck, title: "Produtos e acessórios selecionados", text: "Smartphones e acessórios escolhidos para o uso do dia a dia." },
  { icon: BadgeCheck, title: "Compromisso com a qualidade", text: "Cuidado em cada etapa, da abertura do aparelho ao teste final." },
  { icon: Headset, title: "Suporte ao cliente", text: "Dúvidas depois da compra ou do reparo? É só chamar." },
];

/** H. Seção de confiança e Sobre Nós (sem números, selos ou avaliações inventados). */
export function Trust() {
  return (
    <section id="sobre" className="relative scroll-mt-20 py-14 sm:py-20">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">Sobre nós</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-display mt-4 text-[2rem] leading-[1.05] sm:text-5xl">
                Tecnologia com confiança. <span className="text-white/45">Atendimento com responsabilidade.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15.5px] leading-relaxed text-white/60">
                A SOS TECH CEL fica em Mangabeira II, em João Pessoa, e reúne em um só lugar a venda de smartphones e acessórios e a assistência técnica para celulares, tablets e notebooks.
              </p>
            </Reveal>
          </div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:col-span-7"
          >
            {items.map(({ icon: I, title, text }) => (
              <motion.li key={title} variants={rise} className="group relative bg-[#070707] p-6 transition duration-500 hover:bg-[#0b0f17]">
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-bright/0 to-transparent transition duration-700 group-hover:via-brand-bright/70" />
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-brand-bright transition duration-500 group-hover:-translate-y-0.5 group-hover:border-brand-bright/50">
                  <I className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-[17px] font-semibold tracking-tight">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

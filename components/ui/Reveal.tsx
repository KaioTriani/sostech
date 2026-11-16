"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </M>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Título de seção padrão com eyebrow, título e texto opcional. */
export function SectionHead({ eyebrow, title, text, align = "left", children }: { eyebrow: string; title: React.ReactNode; text?: string; align?: "left" | "center"; children?: React.ReactNode }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"}>
      <div className={align === "center" ? "" : "max-w-2xl"}>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="h-display mt-4 text-[2rem] leading-[1.05] sm:text-5xl">{title}</h2>
        </Reveal>
        {text && (
          <Reveal delay={0.1}>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60 sm:text-base">{text}</p>
          </Reveal>
        )}
      </div>
      {children}
    </div>
  );
}

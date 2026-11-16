"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Wrench, ScanLine, Smartphone, Headphones } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";

const PhoneScene = dynamic(() => import("@/components/three/PhoneScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"none" | "simple" | "full">("none");
  const [ready, setReady] = useState(false);
  // na primeira visita a abertura dura ~1,5 s; nas seguintes o texto entra logo
  const [base] = useState(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem("sos-intro") ? 0.15 : 1.55;
    } catch {
      return 1.55;
    }
  });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yScene = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (reduce) return setMode("none");
    // detecta suporte a WebGL e escolhe a versão leve em telas pequenas / aparelhos modestos
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return setMode("none");
    const small = window.matchMedia("(max-width: 767px)").matches;
    const lowCpu = (navigator.hardwareConcurrency ?? 8) < 4;
    const t = setTimeout(() => setMode(small || lowCpu ? "simple" : "full"), 350);
    return () => clearTimeout(t);
  }, [reduce]);

  const words = "Seu próximo nível de tecnologia começa aqui.".split(" ");

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden pt-20">
      {/* fundo: luz azul, grade técnica e vinheta */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_45%,rgba(7,86,201,.35),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_15%_10%,rgba(22,138,255,.12),transparent_70%)]" />
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(70%_60%_at_60%_50%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="container-x grid min-h-[calc(100svh-5rem)] items-center gap-4 pb-24 md:grid-cols-12 md:pb-10">
        <motion.div style={{ y: reduce ? 0 : yText, opacity: fade }} className="relative z-10 order-1 pt-6 md:col-span-6 md:pt-0">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: base, duration: 0.8, ease }} className="eyebrow">
            Smartphones · Acessórios · Assistência
          </motion.span>
          <h1 className="h-display mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl md:text-[3.4rem] lg:text-[4rem] xl:text-[4.6rem]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className={`inline-block ${w === "tecnologia" ? "bg-gradient-to-r from-white via-brand-glow to-brand-bright bg-clip-text text-transparent" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: base + 0.05 + i * 0.06, duration: 0.9, ease }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: base + 0.5, duration: 0.8, ease }} className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/65 sm:text-lg">
            Smartphones, acessórios e assistência técnica especializada. Tudo o que você precisa para manter sua tecnologia funcionando perfeitamente.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: base + 0.65, duration: 0.8, ease }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/loja" className="btn-primary h-14 px-7 text-base">
              Explorar produtos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/assistencia#diagnostico" className="btn-ghost h-14 px-7 text-base">
              <Wrench className="h-4 w-4" /> Solicitar assistência
            </Link>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: base + 0.9, duration: 1 }} className="mt-10 hidden gap-6 text-[13px] text-white/50 sm:flex">
            <li className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-brand-bright" /> Smartphones</li>
            <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-brand-bright" /> Acessórios</li>
            <li className="flex items-center gap-2"><ScanLine className="h-4 w-4 text-brand-bright" /> Diagnóstico técnico</li>
          </motion.ul>
        </motion.div>

        <motion.div style={{ y: reduce ? 0 : yScene }} className="relative order-2 -mx-4 h-[52svh] min-h-[360px] sm:mx-0 md:col-span-6 md:h-[78svh] md:max-h-[760px]">
          {/* poster leve enquanto o 3D carrega, e fallback quando não há WebGL */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: ready ? 0 : 1, scale: 1 }}
            transition={{ duration: 0.9, ease, delay: ready ? 0 : base * 0.6 }}
          >
            <div className="absolute h-2/3 w-2/3 rounded-full bg-brand/30 blur-[80px]" />
            <motion.div animate={reduce ? {} : { y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-[85%] w-[85%] [perspective:1200px]">
              <div className="h-full w-full [transform:rotateY(-18deg)_rotateX(4deg)]">
                <ProductArt kind="phone-pro" color="#2a3140" view="front" className="h-full w-full drop-shadow-[0_40px_60px_rgba(7,86,201,.45)]" title="Smartphone em destaque" />
              </div>
            </motion.div>
          </motion.div>
          {mode !== "none" && (
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1.2, ease }}>
              <PhoneScene simple={mode === "simple"} onReady={() => setReady(true)} />
            </motion.div>
          )}
          {/* etiquetas técnicas flutuantes */}
          <FloatingTag className="left-[4%] top-[18%] hidden md:flex" delay={base + 1} label="Diagnóstico" value="Transparente" />
          <FloatingTag className="bottom-[16%] right-[4%] hidden md:flex" delay={base + 1.2} label="Assistência" value="Especializada" />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: base + 1.4 }} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/35 md:flex">
        Role
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scan bg-gradient-to-b from-transparent via-brand-bright to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}

function FloatingTag({ className, delay, label, value }: { className: string; delay: number; label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease }}
      className={`absolute z-10 items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md ${className}`}
    >
      <span className="relative grid h-2 w-2 place-items-center">
        <span className="absolute h-2 w-2 animate-pulseRing rounded-full bg-brand-bright" />
        <span className="h-2 w-2 rounded-full bg-brand-bright" />
      </span>
      <span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-white/45">{label}</span>
        <span className="block font-display text-sm font-semibold">{value}</span>
      </span>
    </motion.div>
  );
}

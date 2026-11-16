"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Rotate3d } from "lucide-react";
import { ProductArt, type ArtKind, type ArtView } from "@/components/art/ProductArt";
import { cx } from "@/lib/format";

/** Galeria do produto: vistas em miniatura + palco com rotação 3D por arraste. */
export function ProductGallery({ art, color, name }: { art: ArtKind; color: string; name: string }) {
  const isPhone = art.startsWith("phone");
  const views: ArtView[] = isPhone ? ["back", "front", "side"] : ["back"];
  const labels: Record<ArtView, string> = { back: "Traseira", front: "Frente", side: "Lateral" };
  const [view, setView] = useState<ArtView>(views[0]);
  const rot = useMotionValue(0);
  const rotateY = useTransform(rot, (v) => `${v}deg`);

  return (
    <div className="lg:sticky lg:top-24">
      <motion.div
        className="relative aspect-square cursor-grab touch-pan-y overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[radial-gradient(70%_60%_at_50%_40%,#162746_0%,#0a0f19_55%,#060608_100%)] active:cursor-grabbing [perspective:1200px]"
        onPan={(_, i) => rot.set(Math.max(-35, Math.min(35, rot.get() + i.delta.x * 0.4)))}
        onPanEnd={() => animate(rot, 0, { type: "spring", stiffness: 120, damping: 14 })}
      >
        <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
        <div className="absolute inset-x-[20%] bottom-[9%] h-10 rounded-[50%] bg-brand-bright/25 blur-2xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.94, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.96, rotateY: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 grid place-items-center"
          >
            <motion.div style={{ rotateY }} className="h-[82%] w-[82%]">
              <ProductArt kind={art} color={color} view={view} className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,.7)]" title={`${name}, ${labels[view].toLowerCase()}`} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] text-white/55 backdrop-blur">
          <Rotate3d className="h-3.5 w-3.5" /> Arraste para girar
        </span>
      </motion.div>
      {views.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={`Ver ${labels[v]}`}
              aria-pressed={view === v}
              className={cx(
                "group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-[#0b0e14] transition",
                view === v ? "border-brand-bright/70" : "border-white/[0.07] hover:border-white/20",
              )}
            >
              <ProductArt kind={art} color={color} view={v} className="mx-auto h-full w-auto p-2 transition group-hover:scale-105" />
              <span className="absolute bottom-1.5 left-2 text-[10px] text-white/50">{labels[v]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

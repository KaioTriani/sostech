"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Check, Truck, Store, ShieldQuestion } from "lucide-react";
import type { Product } from "@/content/produtos";
import { useCart, useUi } from "@/lib/store";
import { Qty } from "@/components/layout/CartDrawer";
import { WhatsAppIcon } from "@/components/ui/icons";
import { discountPct, installmentText, money } from "@/lib/format";
import { waLink } from "@/lib/site";

export function BuyBox({ p }: { p: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const notify = useUi((s) => s.notifyAdded);
  const router = useRouter();
  const out = p.stock <= 0;
  const off = discountPct(p.price, p.oldPrice);

  return (
    <div>
      <div className="flex items-end gap-3">
        <p className="font-display text-4xl font-bold tabular-nums tracking-tight">{money(p.price)}</p>
        {p.oldPrice && <p className="pb-1.5 text-white/35 line-through tabular-nums">{money(p.oldPrice)}</p>}
        {off && <span className="mb-2 rounded-full bg-brand-bright/15 px-2 py-0.5 text-xs font-semibold text-brand-glow">-{off}%</span>}
      </div>
      {installmentText(p.price, p.installments) && <p className="mt-1 text-sm text-white/55">{installmentText(p.price, p.installments)}</p>}

      <p className="mt-5 flex items-center gap-2 text-sm">
        <span className={`h-2 w-2 rounded-full ${out ? "bg-red-400" : p.stock <= 3 ? "bg-amber-400" : "bg-[#3ddc84]"}`} />
        {out ? "Indisponível no momento" : p.stock <= 3 ? `Últimas ${p.stock} unidades` : "Disponível"}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Qty value={qty} max={Math.max(1, p.stock)} onChange={(n) => setQty(Math.max(1, n))} size="lg" />
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={out}
          onClick={() => {
            add(p.slug, qty);
            notify(p.name, p.slug);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
          }}
          className={`btn h-12 flex-1 ${added ? "bg-[#1fae5b] text-white" : "border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.09]"}`}
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? "Adicionado" : "Adicionar ao carrinho"}
        </motion.button>
      </div>
      <button
        disabled={out}
        onClick={() => {
          add(p.slug, qty);
          router.push("/checkout");
        }}
        className="btn-primary mt-3 h-14 w-full text-base"
      >
        <Zap className="h-4 w-4" /> Comprar agora
      </button>
      <a href={waLink(`Olá! Tenho interesse no ${p.name}. Pode me passar mais informações?`)} target="_blank" rel="noopener" className="btn-wa mt-3 h-14 w-full text-base">
        <WhatsAppIcon /> Consultar pelo WhatsApp
      </a>

      <ul className="mt-6 grid gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-white/65">
        <li className="flex gap-3"><Store className="h-4 w-4 shrink-0 text-brand-bright" /> Retirada na loja em Mangabeira II, João Pessoa.</li>
        <li className="flex gap-3"><Truck className="h-4 w-4 shrink-0 text-brand-bright" /> Entrega e frete calculados no checkout.</li>
        <li className="flex gap-3"><ShieldQuestion className="h-4 w-4 shrink-0 text-brand-bright" /> Condições de garantia: consulte a loja.</li>
      </ul>
    </div>
  );
}

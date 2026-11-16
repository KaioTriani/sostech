"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Loader2, Lock, QrCode, Store, Truck, Banknote, ShoppingBag } from "lucide-react";
import { resolveLines, useCart } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { cx, money } from "@/lib/format";
import { ProductArt } from "@/components/art/ProductArt";
import { Qty } from "@/components/layout/CartDrawer";
import { WhatsAppIcon } from "@/components/ui/icons";
import { lookupCep, orderMessage, paymentProvider, shippingProvider, type Address, type DeliveryMethod, type PaymentMethod, type ShippingQuote } from "@/lib/commerce";
import { site, waLink } from "@/lib/site";

const phoneMask = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
const cepMask = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

export function Checkout() {
  const hydrated = useHydrated();
  const { lines, setQty, clear } = useCart();
  const items = hydrated ? resolveLines(lines) : [];
  const subtotal = items.reduce((a, l) => a + l.total, 0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("retirada");
  const [addr, setAddr] = useState<Address>({ cep: "", street: "", number: "", complement: "", district: "", city: "", state: "" });
  const [cepState, setCepState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [notes, setNotes] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const c = addr.cep.replace(/\D/g, "");
    if (delivery !== "entrega" || c.length !== 8) return;
    setCepState("loading");
    lookupCep(c).then(async (r) => {
      if (!r) return setCepState("error");
      setAddr((a) => ({ ...a, ...r }));
      setCepState("ok");
      setQuotes(await shippingProvider.quote(c, items));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr.cep, delivery]);

  const errors = {
    name: name.trim().length < 2,
    phone: phone.replace(/\D/g, "").length < 10,
    address: delivery === "entrega" && (!addr.street || !addr.number || !addr.city || addr.cep.replace(/\D/g, "").length !== 8),
  };
  const valid = !errors.name && !errors.phone && !errors.address && items.length > 0;

  async function finish() {
    setTried(true);
    if (!valid) {
      document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const order = { lines: items, customer: { name, phone, email }, delivery, address: delivery === "entrega" ? addr : undefined, shipping: quotes[0], payment, notes, subtotal };
    const { redirectUrl } = await paymentProvider.createCheckout(order);
    const url = redirectUrl ?? waLink(orderMessage(order));
    window.open(url, "_blank", "noopener");
    setDone(url);
    clear();
  }

  if (done) {
    return (
      <div className="container-x grid min-h-[80vh] place-items-center pt-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-bright shadow-glow">
            <Check className="h-9 w-9" strokeWidth={3} />
          </motion.div>
          <h1 className="h-display mt-6 text-3xl">Pedido enviado para a loja.</h1>
          <p className="mt-3 text-white/60">Abrimos o WhatsApp com o resumo do seu pedido. Envie a mensagem para a equipe confirmar disponibilidade, frete e pagamento.</p>
          <a href={done} target="_blank" rel="noopener" className="btn-wa mt-6 w-full">
            <WhatsAppIcon /> Abrir o WhatsApp novamente
          </a>
          <Link href="/loja" className="btn-ghost mt-3 w-full">Voltar para a loja</Link>
        </motion.div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="container-x grid min-h-[80vh] place-items-center pt-24 text-center">
        <div>
          <ShoppingBag className="mx-auto h-12 w-12 text-white/30" />
          <h1 className="h-display mt-5 text-3xl">Seu carrinho está vazio.</h1>
          <p className="mt-2 text-white/55">Adicione produtos para finalizar a compra.</p>
          <Link href="/loja" className="btn-primary mt-6">Explorar produtos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pb-40 pt-24 sm:pt-28 lg:pb-20">
      <Link href="/loja" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Continuar comprando
      </Link>
      <h1 className="h-display mt-4 text-4xl sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="grid gap-5">
          <Block n={1} title="Seus dados">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" error={tried && errors.name ? "Informe seu nome" : undefined}>
                <input className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
              </Field>
              <Field label="WhatsApp / telefone" error={tried && errors.phone ? "Informe um telefone válido" : undefined}>
                <input className="field" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(phoneMask(e.target.value))} placeholder="(83) 9 0000-0000" />
              </Field>
              <Field label="E-mail (opcional)" className="sm:col-span-2">
                <input className="field" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
              </Field>
            </div>
          </Block>

          <Block n={2} title="Entrega">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice active={delivery === "retirada"} onClick={() => setDelivery("retirada")} icon={<Store className="h-5 w-5" />} title="Retirar na loja" text={`${site.address.district}, João Pessoa · grátis`} />
              <Choice active={delivery === "entrega"} onClick={() => setDelivery("entrega")} icon={<Truck className="h-5 w-5" />} title="Receber em casa" text="Frete confirmado pela loja" />
            </div>
            <AnimatePresence initial={false}>
              {delivery === "entrega" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid gap-4 pt-5 sm:grid-cols-6" data-invalid={tried && errors.address}>
                    <Field label="CEP" className="sm:col-span-2" hint={cepState === "loading" ? "Buscando endereço…" : cepState === "error" ? "CEP não encontrado, preencha manualmente" : undefined}>
                      <div className="relative">
                        <input className="field" inputMode="numeric" autoComplete="postal-code" value={addr.cep} onChange={(e) => setAddr({ ...addr, cep: cepMask(e.target.value) })} placeholder="00000-000" />
                        {cepState === "loading" && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-bright" />}
                        {cepState === "ok" && <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3ddc84]" />}
                      </div>
                    </Field>
                    <Field label="Rua" className="sm:col-span-4">
                      <input className="field" autoComplete="address-line1" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} />
                    </Field>
                    <Field label="Número" className="sm:col-span-2" error={tried && errors.address && !addr.number ? "Obrigatório" : undefined}>
                      <input className="field" inputMode="numeric" value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} />
                    </Field>
                    <Field label="Complemento" className="sm:col-span-4">
                      <input className="field" autoComplete="address-line2" value={addr.complement} onChange={(e) => setAddr({ ...addr, complement: e.target.value })} placeholder="Apto, bloco, referência" />
                    </Field>
                    <Field label="Bairro" className="sm:col-span-2">
                      <input className="field" value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} />
                    </Field>
                    <Field label="Cidade" className="sm:col-span-3">
                      <input className="field" autoComplete="address-level2" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                    </Field>
                    <Field label="UF" className="sm:col-span-1">
                      <input className="field" maxLength={2} value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value.toUpperCase() })} />
                    </Field>
                  </div>
                  {quotes.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm">
                      {quotes.map((q) => (
                        <div key={q.id} className="flex items-center justify-between gap-3">
                          <span>
                            <span className="block font-medium">{q.label}</span>
                            <span className="text-xs text-white/45">{q.eta}</span>
                          </span>
                          <span className="text-white/70">{q.price == null ? "A confirmar" : money(q.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Block>

          <Block n={3} title="Pagamento">
            <div className="grid gap-3 sm:grid-cols-3">
              <Choice active={payment === "pix"} onClick={() => setPayment("pix")} icon={<QrCode className="h-5 w-5" />} title="Pix" />
              <Choice active={payment === "cartao"} onClick={() => setPayment("cartao")} icon={<CreditCard className="h-5 w-5" />} title="Cartão" />
              {delivery === "retirada" && <Choice active={payment === "dinheiro"} onClick={() => setPayment("dinheiro")} icon={<Banknote className="h-5 w-5" />} title="Dinheiro" text="Na retirada" />}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/45">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              O pagamento online ainda não está ativo. Ao finalizar, seu pedido vai para o WhatsApp da loja, que confirma estoque, frete e envia o link ou a chave de pagamento.
            </p>
            <Field label="Observações (opcional)" className="mt-5">
              <textarea className="field resize-none" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cor preferida, horário para retirada…" />
            </Field>
          </Block>
        </div>

        {/* resumo */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <p className="font-display text-lg font-semibold">Resumo do pedido</p>
            <ul className="mt-4 grid gap-3">
              {items.map((l) => (
                <li key={l.slug} className="flex items-center gap-3">
                  <span className="grid h-16 w-14 shrink-0 place-items-center rounded-xl bg-white/[0.04]">
                    <ProductArt kind={l.product.art} color={l.product.color} className="h-14 w-14" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 text-sm font-medium">{l.product.name}</span>
                    <span className="mt-1 flex items-center justify-between">
                      <Qty value={l.qty} max={l.product.stock} onChange={(q) => setQty(l.slug, q)} />
                      <span className="text-sm font-semibold tabular-nums">{money(l.total)}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 grid gap-2 border-t border-white/[0.07] pt-4 text-sm">
              <div className="flex justify-between text-white/60"><dt>Subtotal</dt><dd className="tabular-nums text-white">{money(subtotal)}</dd></div>
              <div className="flex justify-between text-white/60"><dt>Frete</dt><dd>{delivery === "retirada" ? "Grátis (retirada)" : "A confirmar"}</dd></div>
              <div className="mt-2 flex items-end justify-between"><dt className="font-display font-semibold">Total</dt><dd className="font-display text-2xl font-bold tabular-nums">{money(subtotal)}</dd></div>
            </dl>
            <button onClick={finish} className="btn-primary mt-5 hidden h-14 w-full text-base lg:inline-flex">
              <WhatsAppIcon /> Finalizar pedido
            </button>
            {tried && !valid && <p className="mt-3 hidden text-center text-xs text-red-300 lg:block">Confira os campos destacados.</p>}
          </div>
        </aside>
      </div>

      {/* barra fixa de finalização no mobile */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-30 px-3 lg:hidden">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d0d]/95 p-3 backdrop-blur-xl">
          <div className="min-w-0 flex-1 pl-1">
            <p className="text-[11px] text-white/45">Total</p>
            <p className="font-display text-lg font-bold tabular-nums">{money(subtotal)}</p>
          </div>
          <button onClick={finish} className="btn-primary h-12 shrink-0 px-5">
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 font-display text-lg font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-bright/15 text-xs text-brand-glow">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, error, hint, className, children }: { label: string; error?: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className} data-invalid={!!error}>
      <label className="label">{label}</label>
      <div className={cx(error && "[&_.field]:border-red-400/60")}>{children}</div>
      {(error || hint) && <p className={cx("mt-1.5 text-xs", error ? "text-red-300" : "text-white/45")}>{error ?? hint}</p>}
    </div>
  );
}

function Choice({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "flex min-h-[64px] items-center gap-3 rounded-2xl border p-4 text-left transition",
        active ? "border-brand-bright bg-brand-bright/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20",
      )}
    >
      <span className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-xl", active ? "bg-brand-bright text-white" : "bg-white/5 text-white/70")}>{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        {text && <span className="block text-xs text-white/45">{text}</span>}
      </span>
    </button>
  );
}

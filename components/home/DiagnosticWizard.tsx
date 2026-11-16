"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Smartphone, Tablet, Laptop, Watch, Box } from "lucide-react";
import { problems, deviceTypes, deviceBrands } from "@/content/servicos";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { waLink } from "@/lib/site";
import { cx } from "@/lib/format";

const typeIcon = { Celular: Smartphone, Tablet: Tablet, Notebook: Laptop, Smartwatch: Watch, Outro: Box } as const;
const steps = ["Problema", "Aparelho", "Marca", "Modelo", "Defeito"] as const;

type Data = { problem?: string; type?: string; brand?: string; brandOther?: string; model: string; details: string; name: string };

/** F. Experiência interativa: o cliente monta a solicitação e envia pelo WhatsApp. */
export function DiagnosticWizard() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<Data>({ model: "", details: "", name: "" });

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const pick = (patch: Partial<Data>) => {
    setD((s) => ({ ...s, ...patch }));
    setTimeout(() => go(step + 1), 220);
  };

  const brand = d.brand === "Outra" ? d.brandOther?.trim() || "Outra" : d.brand;
  const problemLabel = problems.find((p) => p.id === d.problem)?.label;
  const canNext = [!!d.problem, !!d.type, !!d.brand && (d.brand !== "Outra" || !!d.brandOther?.trim()), d.model.trim().length > 1, true][step];
  const done = step === steps.length;

  const message = [
    "Olá! Gostaria de solicitar um orçamento para assistência técnica.",
    "",
    `• Problema: ${problemLabel ?? "-"}`,
    `• Aparelho: ${d.type ?? "-"}`,
    `• Marca: ${brand ?? "-"}`,
    `• Modelo: ${d.model.trim() || "-"}`,
    d.details.trim() ? `• Defeito: ${d.details.trim()}` : null,
    d.name.trim() ? `\nMeu nome é ${d.name.trim()}.` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return (
    <section id="diagnostico" className="relative scroll-mt-20 py-14 sm:py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(160deg,#0d1424_0%,#080a0f_45%,#060606_100%)] p-5 sm:p-10 lg:p-14">
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_80%_at_100%_0%,black,transparent)]" />
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-bright/20 blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="eyebrow">Diagnóstico rápido</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-display mt-4 text-[2rem] leading-[1.05] sm:text-[2.75rem]">Qual é o problema do seu aparelho?</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">Responda em poucos toques. A gente recebe tudo organizado no WhatsApp e retorna com a avaliação.</p>
              </Reveal>

              {/* progresso */}
              <ol className="mt-8 hidden gap-3 lg:grid">
                {steps.map((s, i) => (
                  <li key={s}>
                    <button
                      disabled={i > step}
                      onClick={() => go(i)}
                      className={cx("flex items-center gap-3 text-sm transition", i === step ? "text-white" : i < step ? "text-white/70 hover:text-white" : "text-white/30")}
                    >
                      <span className={cx("grid h-7 w-7 place-items-center rounded-full border text-[11px] font-semibold", i < step ? "border-brand-bright bg-brand-bright text-white" : i === step ? "border-brand-bright text-brand-bright" : "border-white/15")}>
                        {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      {s}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-8">
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full bg-brand-bright" animate={{ width: `${(Math.min(step, steps.length) / steps.length) * 100}%` }} />
                </div>
                <span className="text-xs tabular-nums text-white/50">{Math.min(step + 1, steps.length)}/{steps.length}</span>
              </div>

              <div className="relative min-h-[380px]">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {step === 0 && (
                      <Step title="O que está acontecendo?">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {problems.map((p) => (
                            <Option key={p.id} active={d.problem === p.id} onClick={() => pick({ problem: p.id })}>
                              <ServiceIcon name={p.icon} className="h-6 w-6" />
                              <span>{p.label}</span>
                            </Option>
                          ))}
                        </div>
                      </Step>
                    )}
                    {step === 1 && (
                      <Step title="Qual é o tipo de aparelho?">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {deviceTypes.map((t) => {
                            const I = typeIcon[t];
                            return (
                              <Option key={t} active={d.type === t} onClick={() => pick({ type: t, brand: undefined })}>
                                <I className="h-6 w-6" strokeWidth={1.6} />
                                <span>{t}</span>
                              </Option>
                            );
                          })}
                        </div>
                      </Step>
                    )}
                    {step === 2 && (
                      <Step title="Qual é a marca?">
                        <div className="flex flex-wrap gap-2.5">
                          {(deviceBrands[d.type ?? "Outro"] ?? ["Outra"]).map((b) => (
                            <button key={b} data-active={d.brand === b} onClick={() => (b === "Outra" ? setD((s) => ({ ...s, brand: b })) : pick({ brand: b }))} className="chip min-h-[48px] px-5 text-[15px]">
                              {b}
                            </button>
                          ))}
                        </div>
                        {d.brand === "Outra" && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-sm">
                            <label className="label" htmlFor="marca">Digite a marca</label>
                            <input id="marca" autoFocus className="field" value={d.brandOther ?? ""} onChange={(e) => setD((s) => ({ ...s, brandOther: e.target.value }))} placeholder="Ex.: Realme" />
                          </motion.div>
                        )}
                      </Step>
                    )}
                    {step === 3 && (
                      <Step title="Qual é o modelo?">
                        <div className="max-w-md">
                          <label className="label" htmlFor="modelo">Modelo do aparelho</label>
                          <input
                            id="modelo"
                            autoFocus
                            className="field"
                            value={d.model}
                            onChange={(e) => setD((s) => ({ ...s, model: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && canNext && go(4)}
                            placeholder={d.type === "Notebook" ? "Ex.: Inspiron 15 3000" : "Ex.: iPhone 12, Galaxy A32"}
                          />
                          <p className="mt-2 text-xs text-white/40">Não sabe o modelo? Escreva o que souber, a gente ajuda a identificar.</p>
                        </div>
                      </Step>
                    )}
                    {step === 4 && (
                      <Step title="Descreva o defeito">
                        <div className="grid max-w-xl gap-4">
                          <div>
                            <label className="label" htmlFor="defeito">O que aconteceu? (opcional)</label>
                            <textarea id="defeito" rows={4} className="field resize-none" value={d.details} onChange={(e) => setD((s) => ({ ...s, details: e.target.value }))} placeholder="Ex.: caiu no chão e a tela ficou com listras" />
                          </div>
                          <div>
                            <label className="label" htmlFor="nome">Seu nome (opcional)</label>
                            <input id="nome" className="field" value={d.name} onChange={(e) => setD((s) => ({ ...s, name: e.target.value }))} placeholder="Como podemos te chamar?" />
                          </div>
                        </div>
                      </Step>
                    )}
                    {done && (
                      <Step title="Tudo pronto. Confira e envie.">
                        <div className="max-w-xl rounded-2xl border border-white/10 bg-black/30 p-5">
                          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
                            {[
                              ["Problema", problemLabel],
                              ["Aparelho", d.type],
                              ["Marca", brand],
                              ["Modelo", d.model],
                              ["Defeito", d.details || "Não informado"],
                            ].map(([k, v]) => (
                              <div key={k} className="contents">
                                <dt className="text-white/45">{k}</dt>
                                <dd className="font-medium">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        <a href={waLink(message)} target="_blank" rel="noopener" className="btn-wa mt-6 h-14 w-full px-7 text-base sm:w-auto">
                          <WhatsAppIcon /> Enviar solicitação pelo WhatsApp
                        </a>
                        <p className="mt-3 text-xs text-white/40">O WhatsApp abre com a mensagem pronta. Você revisa antes de enviar.</p>
                      </Step>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <button onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className="btn !min-h-[44px] px-4 text-sm text-white/60 hover:text-white">
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </button>
                {done ? (
                  <button onClick={() => { setD({ model: "", details: "", name: "" }); go(0); }} className="btn !min-h-[44px] px-4 text-sm text-white/60 hover:text-white">
                    Recomeçar
                  </button>
                ) : (
                  <button onClick={() => go(step + 1)} disabled={!canNext} className="btn-primary !min-h-[48px]">
                    {step === steps.length - 1 ? "Revisar" : "Continuar"} <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
      {children}
    </div>
  );
}

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "group relative flex min-h-[112px] flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border p-4 text-left text-[14px] font-medium leading-snug transition duration-300",
        active ? "border-brand-bright bg-brand-bright/15 text-white shadow-glow" : "border-white/[0.08] bg-white/[0.025] text-white/80 hover:border-white/25 hover:bg-white/[0.05]",
      )}
    >
      <span className={cx("transition", active ? "text-brand-glow" : "text-brand-bright")}>{(children as React.ReactNode[])[0]}</span>
      {(children as React.ReactNode[])[1]}
      {active && (
        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-brand-bright">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </motion.button>
  );
}

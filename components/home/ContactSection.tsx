"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Map as MapIcon, FileText, Copy, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { site, waLink, WA_GERAL, WA_ORCAMENTO, fullAddress } from "@/lib/site";

/** J. Localização e contato. O mapa só carrega quando a seção se aproxima da tela. */
export function ContactSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setLoadMap(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <section id="contato" className="relative scroll-mt-20 py-14 sm:py-20">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#080808] lg:grid-cols-12">
          <div className="relative p-6 sm:p-10 lg:col-span-5 lg:p-12">
            <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/25 blur-[100px]" />
            <div className="relative">
              <Reveal>
                <span className="eyebrow">Contato</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-display mt-4 text-[2rem] leading-[1.05] sm:text-[2.6rem]">Venha até a SOS TECH CEL.</h2>
              </Reveal>

              <Reveal delay={0.1}>
                <address className="mt-7 not-italic">
                  <div className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-bright/15 text-brand-bright">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="text-[15px] leading-relaxed text-white/75">
                      <p className="font-semibold text-white">{site.address.street}</p>
                      <p>{site.address.district}</p>
                      <p>
                        {site.address.city}, {site.address.state}
                      </p>
                      <p>CEP {site.address.zip}</p>
                      <button onClick={copy} className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-white">
                        {copied ? <Check className="h-3.5 w-3.5 text-[#3ddc84]" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Endereço copiado" : "Copiar endereço"}
                      </button>
                    </div>
                  </div>
                  <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" className="mt-5 flex items-center gap-4 text-[15px] text-white/75 hover:text-white">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1fae5b]/15 text-[#3ddc84]">
                      <WhatsAppIcon />
                    </span>
                    <span>
                      <span className="block text-xs text-white/45">WhatsApp</span>
                      <span className="font-semibold text-white">+55 {site.whatsappDisplay}</span>
                    </span>
                  </a>
                </address>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" className="btn-wa col-span-2 h-14">
                    <WhatsAppIcon /> Conversar pelo WhatsApp
                  </a>
                  <a href={site.directionsUrl} target="_blank" rel="noopener" className="btn-ghost !px-3 text-sm">
                    <Navigation className="h-4 w-4" /> Como chegar
                  </a>
                  <a href={site.mapsUrl} target="_blank" rel="noopener" className="btn-ghost !px-3 text-sm">
                    <MapIcon className="h-4 w-4" /> Ver localização
                  </a>
                  <a href={waLink(WA_ORCAMENTO)} target="_blank" rel="noopener" className="btn-ghost col-span-2 text-sm">
                    <FileText className="h-4 w-4" /> Solicitar orçamento
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <div ref={mapRef} className="relative min-h-[340px] border-t border-white/[0.08] bg-[#0b0b0b] lg:col-span-7 lg:min-h-[560px] lg:border-l lg:border-t-0">
            {loadMap ? (
              <iframe
                title="Mapa da SOS TECH CEL"
                src={site.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full [filter:invert(.92)_hue-rotate(180deg)_saturate(.7)_brightness(.9)_contrast(.95)]"
              />
            ) : (
              <div className="grid-lines absolute inset-0 grid place-items-center text-sm text-white/40">Carregando mapa…</div>
            )}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_30px_#080808]" />
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-md sm:right-auto">
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-bright">
                <span className="absolute inset-0 animate-pulseRing rounded-full bg-brand-bright" />
                <MapPin className="relative h-4 w-4" />
              </span>
              <span className="text-sm">
                <span className="block font-semibold">SOS TECH CEL</span>
                <span className="block text-xs text-white/55">Mangabeira II, João Pessoa</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { site, waLink, WA_GERAL } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-10 border-t border-white/[0.07] bg-[#030303] pb-28 pt-16 md:pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-bright/50 to-transparent" />
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
            Smartphones, acessórios e assistência técnica especializada em Mangabeira, João Pessoa.
          </p>
          <div className="mt-6 flex gap-2">
            <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70 hover:border-[#1fae5b] hover:text-[#3ddc84]">
              <WhatsAppIcon />
            </a>
            <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70 hover:border-brand-bright hover:text-white">
              <InstagramIcon />
            </a>
          </div>
        </div>
        <FooterCol title="Loja" links={[["Todos os produtos", "/loja"], ["Smartphones", "/loja?grupo=smartphones"], ["Acessórios", "/loja?grupo=acessorios"], ["Ofertas", "/loja?ordem=ofertas"], ["Carrinho", "/checkout"]]} />
        <FooterCol title="Assistência" links={[["Serviços", "/assistencia"], ["Qual é o problema?", "/assistencia#diagnostico"], ["Troca de tela", "/assistencia#telas"], ["Troca de bateria", "/assistencia#baterias"], ["Notebooks", "/assistencia#notebooks"]]} />
        <div className="md:col-span-3">
          <p className="font-display text-sm font-semibold">Visite a loja</p>
          <a href={site.mapsUrl} target="_blank" rel="noopener" className="mt-4 flex gap-3 text-sm leading-relaxed text-white/55 hover:text-white">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
            <span>
              {site.address.street}
              <br />
              {site.address.district}, {site.address.city}, {site.address.state}
              <br />
              CEP {site.address.zip}
            </span>
          </a>
          <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" className="mt-4 flex items-center gap-3 text-sm text-white/55 hover:text-white">
            <WhatsAppIcon className="h-4 w-4 text-[#3ddc84]" /> {site.whatsappDisplay}
          </a>
        </div>
      </div>
      <div className="container-x mt-14 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} SOS TECH CEL. Todos os direitos reservados.</p>
        <p>João Pessoa, Paraíba</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-2">
      <p className="font-display text-sm font-semibold">{title}</p>
      <ul className="mt-4 grid gap-2.5">
        {links.map(([l, h]) => (
          <li key={h}>
            <Link href={h} className="text-sm text-white/50 transition hover:text-white">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

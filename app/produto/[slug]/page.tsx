import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Info } from "lucide-react";
import { products, getProduct, relatedProducts, categoryLabel } from "@/content/produtos";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { BuyBox } from "@/components/shop/BuyBox";
import { ProductCard } from "@/components/shop/ProductCard";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} em João Pessoa`,
    description: `${p.short} Compre na SOS TECH CEL, Mangabeira II, João Pessoa, PB, ou consulte pelo WhatsApp.`,
    alternates: { canonical: `/produto/${p.slug}/` },
    openGraph: { type: "website", title: `${p.name} | SOS TECH CEL`, description: p.short, url: `${site.url}/produto/${p.slug}/` },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const related = relatedProducts(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: p.brand },
    category: categoryLabel[p.category],
    sku: p.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: p.price.toFixed(2),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/produto/${p.slug}/`,
      seller: { "@id": `${site.url}/#empresa` },
    },
  };

  return (
    <div className="container-x pb-16 pt-24 sm:pt-28">
      {/* enquanto o catálogo for demonstrativo, não publicamos dados estruturados de oferta */}
      {!site.demoCatalog && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <nav aria-label="Trilha" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/45">
        <Link href="/" className="hover:text-white">Início</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/loja" className="hover:text-white">Loja</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/loja?categoria=${p.category}`} className="hover:text-white">{categoryLabel[p.category]}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white/70">{p.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery art={p.art} color={p.color} name={p.name} />

        <div>
          <div className="flex flex-wrap gap-2">
            {p.tags?.map((t) => (
              <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white/80">{t}</span>
            ))}
            {site.demoCatalog && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white/60">PRODUTO DEMONSTRATIVO</span>}
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brand-glow">{p.brand} · {categoryLabel[p.category]}</p>
          <h1 className="h-display mt-2 text-3xl leading-tight sm:text-5xl">{p.name}</h1>
          <p className="mt-3 text-white/60">{p.short}</p>

          <div className="mt-7">
            <BuyBox p={p} />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Descrição</h2>
            <p className="mt-3 leading-relaxed text-white/65">{p.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Especificações técnicas</h2>
            <dl className="mt-4 divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07]">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[40%_1fr] gap-4 bg-white/[0.015] px-4 py-3.5 text-sm">
                  <dt className="text-white/45">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {site.demoCatalog && (
            <p className="mt-6 flex gap-2 text-xs leading-relaxed text-white/40">
              <Info className="h-3.5 w-3.5 shrink-0" /> Preço, estoque e especificações deste item são demonstrativos e serão atualizados com os dados reais da loja.
            </p>
          )}
        </div>
      </div>

      <section className="mt-20">
        <h2 className="h-display text-2xl sm:text-3xl">Produtos relacionados</h2>
        <div className="scroll-x mt-6 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
          {related.map((r) => (
            <div key={r.slug} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
              <ProductCard p={r} className="h-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

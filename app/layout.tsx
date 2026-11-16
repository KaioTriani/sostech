import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";
import { MobileNav, WhatsAppButton, CartToast, Intro } from "@/components/layout/Chrome";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | SOS TECH CEL" },
  description: site.description,
  keywords: [
    "assistência técnica celular João Pessoa",
    "troca de tela João Pessoa",
    "troca de bateria celular",
    "conserto de celular Mangabeira",
    "smartphones João Pessoa",
    "acessórios para celular João Pessoa",
    "assistência notebook João Pessoa",
    "SOS TECH CEL",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "SOS TECH CEL" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  other: { "geo.region": "BR-PB", "geo.placename": "João Pessoa" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": ["ElectronicsStore", "LocalBusiness"],
  "@id": `${site.url}/#empresa`,
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/brand/logo-sos-tech-cel.png`,
  logo: `${site.url}/brand/logo-sos-tech-cel.png`,
  telephone: "+55-83-99664-6284",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "BR",
  },
  hasMap: site.mapsUrl,
  areaServed: { "@type": "City", name: "João Pessoa" },
  sameAs: [site.instagram],
  makesOffer: [
    "Troca de telas",
    "Substituição de baterias",
    "Reparos em placas",
    "Reparo de smartphones",
    "Manutenção de tablets",
    "Assistência em notebooks",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          Pular para o conteúdo
        </a>
        <Intro />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <CartToast />
        <WhatsAppButton />
        <MobileNav />
      </body>
    </html>
  );
}

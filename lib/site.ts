/**
 * Dados oficiais da SOS TECH CEL.
 * Tudo que for informação real da empresa fica aqui, num lugar só.
 */
export const site = {
  name: "SOS TECH CEL",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sostechcel.com.br",
  title: "SOS TECH CEL | Smartphones, Acessórios e Assistência Técnica em João Pessoa",
  description:
    "Compre smartphones e acessórios ou solicite assistência técnica especializada na SOS TECH CEL, em João Pessoa, PB.",
  whatsapp: "5583996646284",
  whatsappDisplay: "(83) 99664-6284",
  instagram: "https://www.instagram.com/sostechcel_/",
  instagramHandle: "@sostechcel_",
  address: {
    street: "Rua Dr. Euclídes Neiva de Oliveira, 2355",
    district: "Mangabeira II",
    city: "João Pessoa",
    state: "PB",
    zip: "58056-000",
  },
  mapsUrl:
    "https://www.google.com/maps?q=SOS+TECH+CEL+-+R.+Dr.+Eucl%C3%ADdes+Neiva+de+Oliveira,+2355+-+Mangabeira+II,+Jo%C3%A3o+Pessoa+-+PB,+58056-000",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.+Dr.+Eucl%C3%ADdes+Neiva+de+Oliveira,+2355+-+Mangabeira+II,+Jo%C3%A3o+Pessoa+-+PB,+58056-000",
  mapsEmbed:
    "https://www.google.com/maps?q=R.+Dr.+Eucl%C3%ADdes+Neiva+de+Oliveira,+2355+-+Mangabeira+II,+Jo%C3%A3o+Pessoa+-+PB,+58056-000&output=embed",
  /**
   * Enquanto o catálogo real não for enviado, a loja roda em modo demonstração:
   * aparece um aviso no topo da loja e um selo DEMO em cada produto.
   */
  demoCatalog: true,
} as const;

export function waLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WA_ORCAMENTO = "Olá! Gostaria de solicitar um orçamento para assistência técnica.";
export const WA_GERAL = "Olá! Vim pelo site da SOS TECH CEL e gostaria de atendimento.";

export const fullAddress = `${site.address.street}, ${site.address.district}, ${site.address.city}, ${site.address.state}, CEP ${site.address.zip}`;

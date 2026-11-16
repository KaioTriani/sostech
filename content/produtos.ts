/**
 * CATÁLOGO DEMONSTRATIVO
 * ----------------------
 * Todos os itens abaixo são exemplos para montar a loja. Preços, estoque e
 * parcelamento são ilustrativos e precisam ser substituídos pelos dados reais
 * da SOS TECH CEL antes de publicar. Enquanto `site.demoCatalog` for true,
 * o site mostra o aviso de demonstração.
 */
import type { ArtKind } from "@/components/art/ProductArt";

export type CategoryId =
  | "iphones"
  | "samsung"
  | "xiaomi"
  | "carregadores"
  | "cabos"
  | "fones"
  | "capinhas"
  | "peliculas"
  | "smartwatches"
  | "outros";

export type Tag = "NOVO" | "OFERTA" | "MAIS VENDIDO";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  group: "smartphones" | "acessorios" | "eletronicos";
  price: number; // em reais
  oldPrice?: number;
  installments?: number; // parcelas sem juros, quando configurado
  stock: number;
  tags?: Tag[];
  sold: number; // usado para ordenar por mais vendidos
  addedAt: string; // usado para ordenar por novidades
  short: string;
  description: string;
  highlights?: string[];
  specs: Record<string, string>;
  art: ArtKind;
  color: string; // cor do acabamento na renderização
  accent?: string;
};

export const categories: {
  id: CategoryId | "smartphones" | "acessorios";
  label: string;
  art: ArtKind;
  color: string;
  href: string;
}[] = [
  { id: "smartphones", label: "Smartphones", art: "phone-pro", color: "#2a2f38", href: "/loja?grupo=smartphones" },
  { id: "iphones", label: "iPhones", art: "phone-pro", color: "#c9c2b6", href: "/loja?categoria=iphones" },
  { id: "samsung", label: "Samsung Galaxy", art: "phone-ultra", color: "#1d2a3d", href: "/loja?categoria=samsung" },
  { id: "xiaomi", label: "Xiaomi", art: "phone-round", color: "#2b3540", href: "/loja?categoria=xiaomi" },
  { id: "acessorios", label: "Acessórios", art: "earbuds", color: "#f2f4f7", href: "/loja?grupo=acessorios" },
  { id: "carregadores", label: "Carregadores", art: "charger", color: "#f4f5f7", href: "/loja?categoria=carregadores" },
  { id: "cabos", label: "Cabos", art: "cable", color: "#eef0f3", href: "/loja?categoria=cabos" },
  { id: "fones", label: "Fones de ouvido", art: "headphones", color: "#1f2328", href: "/loja?categoria=fones" },
  { id: "capinhas", label: "Capinhas", art: "case", color: "#0756C9", href: "/loja?categoria=capinhas" },
  { id: "peliculas", label: "Películas", art: "film", color: "#9fd0ff", href: "/loja?categoria=peliculas" },
  { id: "smartwatches", label: "Smartwatches", art: "watch", color: "#1b1f26", href: "/loja?categoria=smartwatches" },
  { id: "outros", label: "Outros eletrônicos", art: "powerbank", color: "#23272e", href: "/loja?categoria=outros" },
];

export const categoryLabel: Record<CategoryId, string> = {
  iphones: "iPhones",
  samsung: "Samsung Galaxy",
  xiaomi: "Xiaomi",
  carregadores: "Carregadores",
  cabos: "Cabos",
  fones: "Fones de ouvido",
  capinhas: "Capinhas",
  peliculas: "Películas",
  smartwatches: "Smartwatches",
  outros: "Outros eletrônicos",
};

export const products: Product[] = [
  {
    slug: "iphone-15-128gb",
    name: "iPhone 15 128 GB",
    brand: "Apple",
    category: "iphones",
    group: "smartphones",
    price: 4599,
    oldPrice: 4999,
    installments: 12,
    stock: 3,
    tags: ["OFERTA"],
    sold: 98,
    addedAt: "2026-10-02",
    short: "Dynamic Island, câmera de 48 MP e USB-C.",
    description:
      "Produto demonstrativo. O iPhone 15 traz tela Super Retina XDR de 6,1 polegadas, Dynamic Island, câmera principal de 48 MP e conector USB-C. Substitua este texto pela descrição e pelas condições reais do aparelho disponível na loja.",
    highlights: ["Tela 6,1\" Super Retina XDR", "Câmera principal 48 MP", "Chip A16 Bionic", "Conector USB-C"],
    specs: { Tela: "6,1\" OLED", Armazenamento: "128 GB", Câmera: "48 MP + 12 MP", Processador: "A16 Bionic", Conector: "USB-C", Condição: "A confirmar" },
    art: "phone-pro",
    color: "#c9c2b6",
  },
  {
    slug: "iphone-13-128gb",
    name: "iPhone 13 128 GB",
    brand: "Apple",
    category: "iphones",
    group: "smartphones",
    price: 3199,
    installments: 12,
    stock: 2,
    tags: ["MAIS VENDIDO"],
    sold: 140,
    addedAt: "2026-08-14",
    short: "Câmera dupla, ótima bateria e tela OLED.",
    description:
      "Produto demonstrativo. iPhone 13 com tela OLED de 6,1 polegadas, câmera dupla de 12 MP e chip A15 Bionic. Informe aqui a condição real do aparelho (novo, seminovo, saúde da bateria e acessórios inclusos).",
    highlights: ["Tela OLED 6,1\"", "Câmera dupla 12 MP", "Chip A15 Bionic"],
    specs: { Tela: "6,1\" OLED", Armazenamento: "128 GB", Câmera: "12 MP + 12 MP", Processador: "A15 Bionic", Conector: "Lightning", Condição: "A confirmar" },
    art: "phone-dual",
    color: "#22324a",
  },
  {
    slug: "galaxy-s24-256gb",
    name: "Samsung Galaxy S24 256 GB",
    brand: "Samsung",
    category: "samsung",
    group: "smartphones",
    price: 4299,
    installments: 12,
    stock: 4,
    tags: ["NOVO"],
    sold: 54,
    addedAt: "2026-11-01",
    short: "Galaxy AI, tela de 120 Hz e câmera tripla.",
    description:
      "Produto demonstrativo. Galaxy S24 com tela Dynamic AMOLED 2X de 120 Hz, câmera tripla com zoom óptico e recursos Galaxy AI. Ajuste preço, cor e condição conforme o estoque real.",
    highlights: ["Tela 6,2\" 120 Hz", "Câmera tripla 50 MP", "Galaxy AI"],
    specs: { Tela: "6,2\" Dynamic AMOLED 2X", Armazenamento: "256 GB", Câmera: "50 + 12 + 10 MP", Bateria: "4.000 mAh", Conector: "USB-C", Condição: "A confirmar" },
    art: "phone-ultra",
    color: "#1d2a3d",
  },
  {
    slug: "galaxy-a55-128gb",
    name: "Samsung Galaxy A55 128 GB",
    brand: "Samsung",
    category: "samsung",
    group: "smartphones",
    price: 2199,
    oldPrice: 2399,
    installments: 10,
    stock: 6,
    tags: ["OFERTA", "MAIS VENDIDO"],
    sold: 121,
    addedAt: "2026-07-20",
    short: "Corpo em metal, tela Super AMOLED e bateria de 5.000 mAh.",
    description:
      "Produto demonstrativo. Galaxy A55 com tela Super AMOLED de 120 Hz, câmera de 50 MP com estabilização e bateria de 5.000 mAh. Atualize com os dados reais.",
    highlights: ["Super AMOLED 120 Hz", "Câmera 50 MP OIS", "Bateria 5.000 mAh"],
    specs: { Tela: "6,6\" Super AMOLED", Armazenamento: "128 GB", Câmera: "50 + 12 + 5 MP", Bateria: "5.000 mAh", Conector: "USB-C", Condição: "A confirmar" },
    art: "phone-ultra",
    color: "#a9c6e8",
  },
  {
    slug: "redmi-note-13-256gb",
    name: "Xiaomi Redmi Note 13 256 GB",
    brand: "Xiaomi",
    category: "xiaomi",
    group: "smartphones",
    price: 1499,
    installments: 10,
    stock: 8,
    tags: ["MAIS VENDIDO"],
    sold: 156,
    addedAt: "2026-06-11",
    short: "Tela AMOLED, 256 GB e carregamento rápido.",
    description:
      "Produto demonstrativo. Redmi Note 13 com tela AMOLED de 120 Hz, câmera de 108 MP e carregamento rápido de 33 W. Substitua pelos dados reais da loja.",
    highlights: ["AMOLED 120 Hz", "Câmera 108 MP", "Carregamento 33 W"],
    specs: { Tela: "6,67\" AMOLED", Armazenamento: "256 GB", Câmera: "108 + 8 + 2 MP", Bateria: "5.000 mAh", Conector: "USB-C", Condição: "A confirmar" },
    art: "phone-round",
    color: "#2b3540",
  },
  {
    slug: "poco-x6-pro-256gb",
    name: "Xiaomi POCO X6 Pro 256 GB",
    brand: "Xiaomi",
    category: "xiaomi",
    group: "smartphones",
    price: 2399,
    installments: 10,
    stock: 0,
    tags: ["NOVO"],
    sold: 37,
    addedAt: "2026-10-28",
    short: "Desempenho alto para jogos e tela de 120 Hz.",
    description:
      "Produto demonstrativo. POCO X6 Pro com processador de alto desempenho, tela AMOLED de 120 Hz e carregamento de 67 W. Atualmente sem estoque neste exemplo, para mostrar o estado indisponível.",
    highlights: ["AMOLED 1,5K 120 Hz", "Carregamento 67 W", "Foco em desempenho"],
    specs: { Tela: "6,67\" AMOLED", Armazenamento: "256 GB", Câmera: "64 + 8 + 2 MP", Bateria: "5.000 mAh", Conector: "USB-C", Condição: "A confirmar" },
    art: "phone-dual",
    color: "#f2c94c",
  },
  {
    slug: "carregador-turbo-20w-usb-c",
    name: "Carregador Turbo 20 W USB-C",
    brand: "Linha SOS",
    category: "carregadores",
    group: "acessorios",
    price: 79.9,
    installments: 2,
    stock: 25,
    tags: ["MAIS VENDIDO"],
    sold: 230,
    addedAt: "2026-05-02",
    short: "Fonte compacta com Power Delivery.",
    description: "Produto demonstrativo. Fonte de 20 W com saída USB-C e Power Delivery, compatível com iPhone e Android. Ajuste marca e preço.",
    specs: { Potência: "20 W", Saída: "USB-C PD", Entrada: "Bivolt", Garantia: "A confirmar" },
    art: "charger",
    color: "#f4f5f7",
  },
  {
    slug: "cabo-usb-c-lightning-1m",
    name: "Cabo USB-C para Lightning 1 m",
    brand: "Linha SOS",
    category: "cabos",
    group: "acessorios",
    price: 49.9,
    stock: 40,
    sold: 190,
    addedAt: "2026-04-18",
    short: "Cabo reforçado com suporte a carga rápida.",
    description: "Produto demonstrativo. Cabo de 1 metro com revestimento reforçado e suporte a carregamento rápido. Ajuste conforme o produto real.",
    specs: { Comprimento: "1 m", Conectores: "USB-C / Lightning", "Carga rápida": "Sim", Garantia: "A confirmar" },
    art: "cable",
    color: "#eef0f3",
  },
  {
    slug: "fone-bluetooth-tws",
    name: "Fone Bluetooth TWS",
    brand: "Linha SOS",
    category: "fones",
    group: "acessorios",
    price: 149.9,
    oldPrice: 189.9,
    installments: 3,
    stock: 12,
    tags: ["OFERTA"],
    sold: 87,
    addedAt: "2026-09-09",
    short: "Sem fio, estojo de carga e toque inteligente.",
    description: "Produto demonstrativo. Fone intra-auricular sem fio com estojo de carregamento e controles por toque.",
    specs: { Conexão: "Bluetooth 5.3", Autonomia: "A confirmar", Estojo: "Com carregamento", Garantia: "A confirmar" },
    art: "earbuds",
    color: "#f2f4f7",
  },
  {
    slug: "headphone-bluetooth-over-ear",
    name: "Headphone Bluetooth Over-ear",
    brand: "Linha SOS",
    category: "fones",
    group: "acessorios",
    price: 249.9,
    installments: 5,
    stock: 5,
    tags: ["NOVO"],
    sold: 21,
    addedAt: "2026-11-05",
    short: "Conforto para o dia todo e som envolvente.",
    description: "Produto demonstrativo. Headphone com almofadas macias e conexão Bluetooth.",
    specs: { Conexão: "Bluetooth", Formato: "Over-ear", Microfone: "Sim", Garantia: "A confirmar" },
    art: "headphones",
    color: "#1f2328",
  },
  {
    slug: "capinha-silicone-iphone-15",
    name: "Capinha de Silicone iPhone 15",
    brand: "Linha SOS",
    category: "capinhas",
    group: "acessorios",
    price: 59.9,
    stock: 30,
    sold: 160,
    addedAt: "2026-10-10",
    short: "Toque aveludado e proteção nas bordas.",
    description: "Produto demonstrativo. Capinha de silicone com interior em microfibra e bordas elevadas para câmera e tela.",
    specs: { Material: "Silicone", Compatibilidade: "iPhone 15", Interior: "Microfibra" },
    art: "case",
    color: "#0756C9",
  },
  {
    slug: "pelicula-vidro-3d",
    name: "Película de Vidro 3D",
    brand: "Linha SOS",
    category: "peliculas",
    group: "acessorios",
    price: 39.9,
    stock: 60,
    tags: ["MAIS VENDIDO"],
    sold: 310,
    addedAt: "2026-03-30",
    short: "Cobertura total e aplicação na loja.",
    description: "Produto demonstrativo. Película de vidro temperado com cobertura de borda a borda. Confirme modelos disponíveis e se a aplicação é feita na loja.",
    specs: { Material: "Vidro temperado", Cobertura: "3D, borda a borda", Modelos: "Consulte" },
    art: "film",
    color: "#9fd0ff",
  },
  {
    slug: "smartwatch-serie-fit",
    name: "Smartwatch Série Fit",
    brand: "Linha SOS",
    category: "smartwatches",
    group: "eletronicos",
    price: 299.9,
    oldPrice: 349.9,
    installments: 6,
    stock: 7,
    tags: ["OFERTA"],
    sold: 64,
    addedAt: "2026-08-25",
    short: "Monitoramento de atividades e notificações.",
    description: "Produto demonstrativo. Smartwatch com monitoramento de atividades, notificações do celular e pulseira intercambiável.",
    specs: { Tela: "A confirmar", Compatibilidade: "Android e iOS", Resistência: "A confirmar" },
    art: "watch",
    color: "#1b1f26",
  },
  {
    slug: "power-bank-10000mah",
    name: "Power Bank 10.000 mAh",
    brand: "Linha SOS",
    category: "outros",
    group: "eletronicos",
    price: 159.9,
    installments: 3,
    stock: 9,
    sold: 72,
    addedAt: "2026-09-30",
    short: "Bateria portátil com USB-C.",
    description: "Produto demonstrativo. Carregador portátil de 10.000 mAh com entrada e saída USB-C.",
    specs: { Capacidade: "10.000 mAh", Saídas: "USB-C e USB-A", Garantia: "A confirmar" },
    art: "powerbank",
    color: "#23272e",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(p: Product, n = 4) {
  return products
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category) || Number(b.group === p.group) - Number(a.group === p.group) || b.sold - a.sold)
    .slice(0, n);
}

export const brands = Array.from(new Set(products.map((p) => p.brand)));

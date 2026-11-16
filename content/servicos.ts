/**
 * Serviços de assistência técnica.
 * As fotos vêm do Instagram oficial (@sostechcel_). Textos descrevem o serviço,
 * sem prometer prazos, garantias ou preços: isso é combinado no orçamento.
 */
export type Service = {
  id: string;
  title: string;
  text: string;
  icon: "screen" | "battery" | "chip" | "plug" | "phone" | "tablet" | "laptop" | "scan" | "wrench";
  image?: string;
  imageAlt?: string;
};

export const services: Service[] = [
  {
    id: "telas",
    title: "Troca de telas",
    text: "Tela trincada, manchada ou sem resposta ao toque. Substituição com cuidado na vedação e no acabamento.",
    icon: "screen",
    image: "/servicos/troca-de-tela.webp",
    imageAlt: "Celular com a tela trincada e o mesmo modelo com a tela nova, na bancada da SOS TECH CEL",
  },
  {
    id: "baterias",
    title: "Substituição de baterias",
    text: "Aparelho descarregando rápido, desligando sozinho ou com bateria estufada.",
    icon: "battery",
    image: "/servicos/troca-de-bateria.webp",
    imageAlt: "Substituição de bateria em tablet Samsung na bancada da SOS TECH CEL",
  },
  {
    id: "placas",
    title: "Reparos em placas",
    text: "Diagnóstico e reparo de componentes na placa para aparelhos que não ligam ou apresentam falhas.",
    icon: "chip",
  },
  {
    id: "carregamento",
    title: "Problemas de carregamento",
    text: "Conector com mau contato, carregamento lento ou que não reconhece o cabo.",
    icon: "plug",
  },
  {
    id: "smartphones",
    title: "Reparo de smartphones",
    text: "Tampas, câmeras, alto-falantes, botões e demais peças de celulares das principais marcas.",
    icon: "phone",
    image: "/servicos/reparo-smartphone.webp",
    imageAlt: "Smartphone aberto durante reparo na bancada",
  },
  {
    id: "tablets",
    title: "Manutenção de tablets",
    text: "Tela, bateria, conector e software de tablets.",
    icon: "tablet",
  },
  {
    id: "notebooks",
    title: "Assistência em notebooks",
    text: "Formatação, troca de peças e upgrades para o seu notebook voltar a render.",
    icon: "laptop",
  },
  {
    id: "diagnostico-tecnico",
    title: "Diagnóstico técnico",
    text: "Avaliação do aparelho para identificar a causa do defeito antes de qualquer reparo.",
    icon: "scan",
    image: "/servicos/diagnostico.webp",
    imageAlt: "Smartphone em teste na bancada da SOS TECH CEL",
  },
  {
    id: "outros",
    title: "Outros serviços",
    text: "Precisa de algo que não está na lista? Fale com a equipe e consulte a disponibilidade.",
    icon: "wrench",
  },
];

export const problems = [
  { id: "tela", label: "Tela quebrada", icon: "screen" },
  { id: "bateria", label: "Bateria descarregando rápido", icon: "battery" },
  { id: "nao-liga", label: "Celular não liga", icon: "power" },
  { id: "nao-carrega", label: "Aparelho não carrega", icon: "plug" },
  { id: "audio", label: "Problemas de áudio", icon: "audio" },
  { id: "software", label: "Problemas de software", icon: "software" },
  { id: "outro", label: "Outro problema", icon: "help" },
] as const;

export const deviceTypes = ["Celular", "Tablet", "Notebook", "Smartwatch", "Outro"] as const;

export const deviceBrands: Record<string, string[]> = {
  Celular: ["Apple (iPhone)", "Samsung", "Xiaomi", "Motorola", "Outra"],
  Tablet: ["Apple (iPad)", "Samsung", "Xiaomi", "Lenovo", "Outra"],
  Notebook: ["Dell", "Lenovo", "Samsung", "Acer", "Asus", "Apple (MacBook)", "Outra"],
  Smartwatch: ["Apple", "Samsung", "Xiaomi", "Outra"],
  Outro: ["Outra"],
};

export const instagramPosts = [
  { src: "/instagram/post09.webp", alt: "Troca de tela e tampa em iPhone", tag: "Reparos" },
  { src: "/instagram/post04.webp", alt: "Arte de divulgação de consertos em celulares e notebooks", tag: "Assistência" },
  { src: "/instagram/post07.webp", alt: "Carregadores veiculares e acessórios", tag: "Acessórios" },
  { src: "/instagram/post10.webp", alt: "Substituição de bateria em tablet Samsung", tag: "Bastidores" },
  { src: "/instagram/post03.webp", alt: "Mascote da SOS TECH CEL na bancada", tag: "Marca" },
  { src: "/instagram/post08.webp", alt: "Carregador 20 W USB-C e cabo Lightning", tag: "Produtos" },
  { src: "/instagram/post06.webp", alt: "Smartphone aberto em reparo", tag: "Reparos" },
  { src: "/instagram/post01.webp", alt: "Assistência em notebooks", tag: "Dicas" },
  { src: "/instagram/post05.webp", alt: "Smartphone em teste após reparo", tag: "Bastidores" },
];

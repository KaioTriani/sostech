/**
 * Camada de pagamento e frete, pronta para integração.
 *
 * Hoje o pedido é concluído pelo WhatsApp (sem cobrar online). Para ativar um
 * gateway (Mercado Pago, Pagar.me, Stripe, PagSeguro...) ou cálculo de frete
 * (Melhor Envio, Correios, Frenet...), implemente os adaptadores abaixo em uma
 * rota de API do Next (app/api/...) e troque `paymentProvider` / `shippingProvider`.
 */
import type { ResolvedLine } from "@/lib/store";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

export type Customer = { name: string; phone: string; email?: string };
export type Address = { cep: string; street: string; number: string; complement?: string; district: string; city: string; state: string };
export type DeliveryMethod = "retirada" | "entrega";
export type PaymentMethod = "pix" | "cartao" | "dinheiro";

export type ShippingQuote = { id: string; label: string; price: number | null; eta?: string };

export interface ShippingProvider {
  quote(cep: string, lines: ResolvedLine[]): Promise<ShippingQuote[]>;
}
export interface PaymentProvider {
  id: string;
  /** devolve uma URL de pagamento ou null quando o pedido segue pelo WhatsApp */
  createCheckout(order: Order): Promise<{ redirectUrl: string | null }>;
}

export type Order = {
  lines: ResolvedLine[];
  customer: Customer;
  delivery: DeliveryMethod;
  address?: Address;
  shipping?: ShippingQuote;
  payment: PaymentMethod;
  notes?: string;
  subtotal: number;
};

/** Frete ainda não configurado: a loja confirma o valor no atendimento. */
export const shippingProvider: ShippingProvider = {
  async quote() {
    return [{ id: "a-combinar", label: "Entrega em João Pessoa e região", price: null, eta: "Valor e prazo confirmados pela loja" }];
  },
};

/** Pagamento manual: gera o resumo do pedido e abre o WhatsApp da loja. */
export const paymentProvider: PaymentProvider = {
  id: "whatsapp",
  async createCheckout() {
    return { redirectUrl: null };
  },
};

export const paymentLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao: "Cartão de crédito ou débito",
  dinheiro: "Dinheiro na retirada",
};

export function orderMessage(o: Order) {
  const items = o.lines.map((l) => `• ${l.qty}x ${l.product.name}: ${money(l.total)}`).join("\n");
  const entrega =
    o.delivery === "retirada"
      ? "Retirada na loja"
      : `Entrega em: ${o.address?.street}, ${o.address?.number}${o.address?.complement ? `, ${o.address.complement}` : ""}, ${o.address?.district}, ${o.address?.city}/${o.address?.state}, CEP ${o.address?.cep}`;
  return [
    `Olá! Quero finalizar um pedido pelo site da ${site.name}.`,
    "",
    "*Itens*",
    items,
    "",
    `Subtotal: ${money(o.subtotal)}`,
    o.delivery === "entrega" ? "Frete: a confirmar" : null,
    "",
    `*Entrega:* ${entrega}`,
    `*Pagamento:* ${paymentLabels[o.payment]}`,
    "",
    `*Nome:* ${o.customer.name}`,
    `*Telefone:* ${o.customer.phone}`,
    o.customer.email ? `*E-mail:* ${o.customer.email}` : null,
    o.notes ? `*Observações:* ${o.notes}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/** Busca de endereço pelo CEP (ViaCEP, serviço público e gratuito). */
export async function lookupCep(cep: string): Promise<Partial<Address> | null> {
  const c = cep.replace(/\D/g, "");
  if (c.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${c}/json/`);
    const j = await r.json();
    if (j.erro) return null;
    return { street: j.logradouro, district: j.bairro, city: j.localidade, state: j.uf };
  } catch {
    return null;
  }
}

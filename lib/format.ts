const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const money = (v: number) => brl.format(v);

export function installmentText(price: number, n?: number) {
  if (!n || n < 2) return null;
  return `ou ${n}x de ${money(price / n)} sem juros`;
}

export function discountPct(price: number, old?: number) {
  if (!old || old <= price) return null;
  return Math.round((1 - price / old) * 100);
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

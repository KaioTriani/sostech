/** Testes de fluxo: node scripts/flows.mjs (site em BASE_URL, padrão http://localhost:3211) */
import { chromium } from "playwright-core";
const BASE = process.env.BASE_URL || "http://localhost:3211";
let b; for (const channel of ["msedge", "chrome"]) { try { b = await chromium.launch({ channel }); break; } catch {} }
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
await ctx.addInitScript(() => sessionStorage.setItem("sos-intro", "1"));
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
const ok = (c, m) => console.log(c ? "OK  " : "FALHA", m);

await p.goto(BASE + "/loja", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Adicionar Película de Vidro 3D ao carrinho" }).click();
ok(await p.getByRole("status").getByText("Adicionado ao carrinho").isVisible(), "toast ao adicionar");
await p.getByRole("button", { name: "Adicionar Carregador Turbo 20 W USB-C ao carrinho" }).click();
await p.locator("nav[aria-label='Navegação rápida'] button").click();
const drawer = p.getByRole("dialog", { name: "Carrinho" });
await drawer.waitFor();
ok((await drawer.innerText()).includes("2 item(ns)"), "drawer com 2 itens");
await drawer.getByRole("button", { name: "Aumentar quantidade" }).first().click();
ok((await drawer.innerText()).includes("159,70"), "subtotal recalculado (39,90x2 + 79,90)");
await p.reload({ waitUntil: "networkidle" });
ok((await p.evaluate(() => localStorage.getItem("sostechcel-carrinho"))).includes("pelicula-vidro-3d"), "carrinho persiste após recarregar");

await p.goto(BASE + "/loja?categoria=iphones", { waitUntil: "networkidle" });
ok((await p.getByText(/\d+ produto\(s\)/).innerText()).startsWith("2"), "filtro por categoria (2 iPhones)");
await p.goto(BASE + "/loja?estoque=1&ordem=menor-preco", { waitUntil: "networkidle" });
ok((await p.getByText(/\d+ produto\(s\)/).innerText()).startsWith("13"), "filtro disponibilidade (13)");

await p.goto(BASE + "/checkout", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Finalizar pedido" }).last().click();
ok(await p.getByText("Informe seu nome").isVisible(), "validação do checkout");
await p.getByPlaceholder("Seu nome").fill("Cliente Teste");
await p.getByPlaceholder("(83) 9 0000-0000").fill("83999999999");
const [popup] = await Promise.all([ctx.waitForEvent("page"), p.getByRole("button", { name: "Finalizar pedido" }).last().click()]);
const url = decodeURIComponent(popup.url().replaceAll("+", " "));
  console.log("   ", popup.url().slice(0, 60));
ok(url.includes("5583996646284") && url.includes("Película de Vidro 3D") && url.includes("Retirada na loja"), "pedido vai para o WhatsApp com resumo");
await popup.close();
ok(await p.getByText("Pedido enviado para a loja.").isVisible(), "tela de confirmação");

await p.goto(BASE + "/assistencia", { waitUntil: "networkidle" });
const w = p.locator("section#diagnostico");
await w.scrollIntoViewIfNeeded();
await w.getByRole("button", { name: /Tela quebrada/ }).click();
await p.waitForTimeout(800);
await w.getByRole("button", { name: "Celular", exact: true }).click();
await p.waitForTimeout(800);
await w.getByRole("button", { name: "Samsung" }).click();
await p.waitForTimeout(800);
await w.locator("#modelo").fill("Galaxy A32");
await w.getByRole("button", { name: /Continuar/ }).click();
await w.locator("#defeito").fill("Caiu e trincou");
await w.getByRole("button", { name: /Revisar/ }).click();
const href = decodeURIComponent(await w.getByRole("link", { name: /Enviar solicitação/ }).getAttribute("href"));
ok(href.includes("Tela quebrada") && href.includes("Galaxy A32") && href.includes("Samsung") && href.includes("orçamento para assistência técnica"), "diagnóstico gera mensagem completa");

await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Pesquisar" }).click();
await p.getByLabel("Termo de busca").fill("bateria");
ok(await p.getByRole("dialog", { name: "Pesquisar" }).getByText("Substituição de baterias").isVisible(), "busca encontra serviço");
const orc = await p.locator('a[href*="wa.me"]').evaluateAll((as) => as.map((a) => decodeURIComponent(a.href)));
ok(orc.some((h) => h.includes("Olá! Gostaria de solicitar um orçamento para assistência técnica.")), "CTA de orçamento com mensagem pré-preenchida");
ok(errs.length === 0, "sem erros de JS " + errs.join(" | "));
await b.close();

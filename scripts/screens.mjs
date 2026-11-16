/**
 * Fotos de QA: node scripts/screens.mjs  (site rodando em BASE_URL, padrão http://localhost:3211)
 * Gera qa/<pagina>-<largura>.png usando o Edge/Chrome instalado (playwright-core).
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3211";
const out = fileURLToPath(new URL("../qa/", import.meta.url));
fs.mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);

let browser;
for (const channel of ["msedge", "chrome"]) {
  try { browser = await chromium.launch({ channel }); break; } catch {}
}
if (!browser) throw new Error("Instale o Edge ou o Chrome.");

const pages = [
  ["home", "/"],
  ["loja", "/loja"],
  ["produto", "/produto/iphone-15-128gb"],
  ["assistencia", "/assistencia"],
  ["checkout", "/checkout"],
].filter(([n]) => !only.length || only.includes(n));

const problems = [];
for (const width of [390, 1440]) {
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height: mobile ? 844 : 900 }, deviceScaleFactor: mobile ? 2 : 1, hasTouch: mobile, reducedMotion: "reduce" });
  await ctx.addInitScript(() => {
    sessionStorage.setItem("sos-intro", "1");
    localStorage.setItem("sostechcel-carrinho", JSON.stringify({ state: { lines: [{ slug: "iphone-15-128gb", qty: 1 }, { slug: "pelicula-vidro-3d", qty: 2 }] }, version: 1 }));
  });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => problems.push(`${width} ${p.url()}: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && problems.push(`${width} console: ${m.text()}`));
  for (const [name, path] of pages) {
    await p.goto(BASE + path, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    // rola até o fim para disparar as animações de entrada, depois volta ao topo
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
    await p.waitForTimeout(1200);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 0) problems.push(`${width} ${path}: rolagem horizontal de ${overflow}px`);
    await p.screenshot({ path: `${out}${name}-${width}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "sem erros");

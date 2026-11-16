/** Gera public/og.jpg (1200x630) com a logo original. Uso: node scripts/og.mjs */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
const r = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs>
<radialGradient id="g" cx="0.78" cy="0.5" r="0.7"><stop offset="0" stop-color="#0756C9"/><stop offset="0.45" stop-color="#03132e"/><stop offset="1" stop-color="#050505"/></radialGradient>
<pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern>
</defs>
<rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#grid)"/>
<text x="196" y="132" font-family="Sora, Segoe UI, Arial" font-weight="700" font-size="34" fill="#fff">SOS TECH CEL</text>
<text x="196" y="166" font-family="Inter, Segoe UI, Arial" font-size="18" letter-spacing="4" fill="#9cc8ff">JOÃO PESSOA, PB</text>
<text x="72" y="380" font-family="Sora, Segoe UI, Arial" font-weight="800" font-size="62" fill="#fff">Seu próximo nível de</text>
<text x="72" y="452" font-family="Sora, Segoe UI, Arial" font-weight="800" font-size="62" fill="#7CC4FF">tecnologia começa aqui.</text>
<text x="72" y="540" font-family="Inter, Segoe UI, Arial" font-size="26" fill="#cfe2ff">Smartphones · Acessórios · Assistência técnica</text>
</svg>`;
const logo = await sharp(r("public/brand/logo-sos-tech-cel.png")).resize(104, 104).toBuffer();
const mask = Buffer.from('<svg width="104" height="104"><rect width="104" height="104" rx="24" fill="#fff"/></svg>');
const rounded = await sharp(logo).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
await sharp(Buffer.from(svg)).composite([{ input: rounded, left: 72, top: 78 }]).jpeg({ quality: 88 }).toFile(r("public/og.jpg"));
console.log("public/og.jpg ok");

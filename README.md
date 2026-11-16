# SOS TECH CEL: site e loja

Site da SOS TECH CEL (João Pessoa, PB): loja de smartphones e acessórios + assistência técnica.
Next.js 14, TypeScript, Tailwind, Framer Motion, React Three Fiber, Lucide.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3210
npm run build      # gera o site estático em out/
npm run preview    # testa a pasta out/ em http://localhost:3212
```

## Publicar na Hostinger

O site é exportado como **estático** (HTML, CSS, JS e imagens), então funciona em qualquer plano de hospedagem da Hostinger, sem Node.js.
O arquivo `.htaccess` (em `public/`) já vai junto: HTTPS, página 404 e cache.

**Opção A: Git da Hostinger (recomendado, atualiza sozinho)**

1. A cada push na `main`, o GitHub Actions gera o site e publica na branch **`hostinger`** (veja a aba Actions do repositório).
2. No hPanel: *Sites > Gerenciar > Avançado > Git*. Repositório `https://github.com/KaioTriani/sostech.git`, branch `hostinger`, diretório vazio (instala em `public_html`). O `public_html` precisa estar vazio na primeira vez.
3. Para atualizar depois, clique em *Deploy* no hPanel ou ative o deploy automático (webhook).
4. Em *Settings > Secrets and variables > Actions > Variables* do GitHub, crie `SITE_URL` com o domínio final (ex.: `https://sostechcel.com.br`) para sitemap e SEO saírem certos.

**Opção B: envio manual**

Rode `npm run build` e envie **o conteúdo** da pasta `out/` (inclusive o `.htaccess`) para o `public_html` pelo Gerenciador de Arquivos ou FTP.
Ou baixe a branch `hostinger` em ZIP no GitHub e extraia no `public_html`.

## Onde editar

| O quê | Arquivo |
|---|---|
| Endereço, WhatsApp, Instagram, URL do site, modo demonstração | `lib/site.ts` |
| Produtos (preço, parcelas, estoque, etiquetas, specs) | `content/produtos.ts` |
| Serviços, problemas do diagnóstico, galeria do Instagram | `content/servicos.ts` |
| Pagamento e frete (adaptadores prontos para integrar) | `lib/commerce.ts` |
| Logo | `public/brand/logo-sos-tech-cel.png` |

## Antes de publicar

1. **Catálogo real.** Os produtos atuais são demonstrativos (preço, estoque e parcelamento ilustrativos).
   Ao trocar pelos reais, mude `demoCatalog` para `false` em `lib/site.ts`: some o aviso e os selos DEMO
   e os produtos passam a publicar dados estruturados de oferta para o Google.
2. **Fotos dos produtos.** Hoje são renderizações vetoriais (`components/art/ProductArt.tsx`). Com fotos reais,
   troque por `next/image` no `ProductCard` e no `ProductGallery`.
3. **Logo em alta.** A logo veio da foto de perfil do Instagram (150 px). Substitua pelo arquivo original (PNG ou SVG).
4. **Domínio.** Defina `SITE_URL` no GitHub (ou `NEXT_PUBLIC_SITE_URL` ao rodar o build) para sitemap, canonical e Open Graph.
5. **Imagem de compartilhamento:** `node scripts/og.mjs` gera `public/og.jpg`.

## Checkout

O pedido é montado no site (dados, retirada ou entrega com busca de CEP, forma de pagamento) e enviado
para o WhatsApp da loja. Para cobrar online ou calcular frete, implemente `paymentProvider` e
`shippingProvider` em `lib/commerce.ts` (ex.: Mercado Pago, Pagar.me, Melhor Envio).

## Instagram

Galeria administrada manualmente (`instagramPosts` em `content/servicos.ts`, imagens em `public/instagram`).
Para integração automática, use a Instagram Graph API com conta profissional.

## QA

Com `npm run preview` rodando (porta 3212), use `BASE_URL=http://localhost:3212`:

```bash
node scripts/flows.mjs     # carrinho, filtros, checkout, diagnóstico, busca
node scripts/screens.mjs   # fotos de página inteira em qa/ (390 e 1440 px)
```

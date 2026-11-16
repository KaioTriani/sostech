/**
 * Exportação estática: `npm run build` gera a pasta `out/` com o site pronto
 * (HTML, CSS, JS e imagens). É só enviar o conteúdo de `out/` para o public_html
 * da Hostinger, ou usar a branch `hostinger` gerada pelo GitHub Actions.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  trailingSlash: true, // gera /loja/index.html, que o Apache da Hostinger serve sem configuração extra
  reactStrictMode: true,
  images: { unoptimized: true }, // imagens já estão otimizadas em WebP
  transpilePackages: ["three"],
};
export default nextConfig;

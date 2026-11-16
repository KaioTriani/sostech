import { fileURLToPath } from "node:url";

// caminho explícito para o tailwind funcionar mesmo se o next for iniciado de outra pasta
const config = fileURLToPath(new URL("./tailwind.config.ts", import.meta.url));

export default { plugins: { tailwindcss: { config }, autoprefixer: {} } };

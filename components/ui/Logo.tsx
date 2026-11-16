import Image from "next/image";
import Link from "next/link";
import { cx } from "@/lib/format";

/**
 * Logomarca original da SOS TECH CEL (arquivo do perfil oficial).
 * A arte original tem fundo branco e letras pretas, então ela é aplicada
 * sobre uma placa branca para manter as cores intactas no site escuro.
 * Ao receber o arquivo em alta (PNG/SVG), substitua public/brand/logo-sos-tech-cel.png.
 */
export function Logo({ className, size = 44 }: { className?: string; size?: number }) {
  return (
    <Link href="/" aria-label="SOS TECH CEL, página inicial" className={cx("group inline-flex items-center gap-3", className)}>
      <span
        className="relative grid place-items-center overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(255,255,255,.2),0_8px_30px_-8px_rgba(22,138,255,.6)] transition duration-500 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,.3),0_8px_40px_-6px_rgba(22,138,255,.9)]"
        style={{ width: size, height: size }}
      >
        <Image src="/brand/logo-sos-tech-cel.png" alt="SOS TECH CEL" width={size * 2} height={size * 2} priority className="h-full w-full scale-[1.12] object-contain" />
      </span>
      <span className="hidden leading-none sm:block">
        <span className="block font-display text-[15px] font-bold tracking-tight">SOS TECH CEL</span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-white/45">João Pessoa, PB</span>
      </span>
    </Link>
  );
}

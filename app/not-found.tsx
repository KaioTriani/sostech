import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[80vh] place-items-center pt-24 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-brand-bright">404</p>
        <h1 className="h-display mt-4 text-3xl">Página não encontrada.</h1>
        <p className="mt-2 text-white/55">O endereço pode ter mudado. Que tal voltar para o início?</p>
        <Link href="/" className="btn-primary mt-6">Ir para o início</Link>
      </div>
    </div>
  );
}

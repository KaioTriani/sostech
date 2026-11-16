import type { Metadata } from "next";
import { Suspense } from "react";
import { Shop } from "@/components/shop/Shop";

export const metadata: Metadata = {
  title: "Loja: Smartphones e Acessórios em João Pessoa",
  description:
    "Smartphones iPhone, Samsung Galaxy e Xiaomi, carregadores, cabos, fones, capinhas, películas e smartwatches na SOS TECH CEL, João Pessoa, PB.",
  alternates: { canonical: "/loja/" },
};

export default function LojaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Shop />
    </Suspense>
  );
}

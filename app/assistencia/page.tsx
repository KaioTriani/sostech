import type { Metadata } from "next";
import { Assistance } from "@/components/home/Assistance";
import { DiagnosticWizard } from "@/components/home/DiagnosticWizard";
import { ContactSection } from "@/components/home/ContactSection";
import { Trust } from "@/components/home/Trust";

export const metadata: Metadata = {
  title: "Assistência Técnica de Celular, Tablet e Notebook em João Pessoa",
  description:
    "Troca de tela, substituição de bateria, reparo em placa, problemas de carregamento e assistência em notebooks na SOS TECH CEL, Mangabeira II, João Pessoa, PB. Peça seu orçamento pelo WhatsApp.",
  alternates: { canonical: "/assistencia/" },
};

export default function AssistenciaPage() {
  return (
    <div className="pt-16">
      <Assistance full />
      <DiagnosticWizard />
      <Trust />
      <ContactSection />
    </div>
  );
}

import type { Metadata } from "next";
import FirmaGenerator from "./firma_generator";

export const metadata: Metadata = {
  title: "Firmas | Olive",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FirmasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-backColor px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">Generador de firmas</h1>
      <p className="mt-2 mb-8 text-secondary2">Firmas de correo con motivo de Olive+ 🫒</p>
      <FirmaGenerator />
    </main>
  );
}

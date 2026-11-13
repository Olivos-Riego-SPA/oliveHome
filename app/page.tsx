import Image from 'next/image';
import whatsapp from './public/images/whaza.webp';
import Footer from '@/components/footer';
import SiteHeader from '@/components/site_header';
import RedesSociales from '@/components/redes_sociales';
import HeroPlataforma from '@/components/home/hero_plataforma';
import ExploradorModulos from '@/components/home/explorador_modulos';
import SeccionPro from '@/components/home/seccion_pro';
import SeccionDemo from '@/components/home/seccion_demo';
import RutaRiego from '@/components/home/ruta_riego';
import SeccionEquipo from '@/components/home/seccion_equipo';
import CentroExtension from '@/components/home/centro_extension';
import Contacto from '@/components/home/contacto';

// Home rediseñada. Orden: hero → módulos → así funciona (demo guiada) → ruta del riego → PRO →
// equipo → Centro de Extensión → contacto.
export default function Home() {
  return (
    <div className="home flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main id="contenido">
        <HeroPlataforma />
        <ExploradorModulos />
        <SeccionDemo />
        <RutaRiego />
        <SeccionPro />
        <SeccionEquipo />
        <CentroExtension />
        <Contacto />
      </main>
      <Footer />

      {/* Botones fijos: redes sociales en vertical y, abajo, WhatsApp */}
      <div className="fixed bottom-3 right-3 z-50 flex w-14 flex-col items-center gap-2">
        <RedesSociales variante="flotante" />
        <a href="https://wa.me/56933720947" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp" className="block h-14 w-14">
          <Image src={whatsapp} alt="" height={56} width={56} className="rounded-full" />
        </a>
      </div>
    </div>
  )
}

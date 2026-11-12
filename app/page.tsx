import Image from 'next/image';
import whatsapp from './public/images/whaza.webp';
import Footer from '@/components/footer';
import SiteHeader from '@/components/site_header';
import HeroPlataforma from '@/components/home/hero_plataforma';
import ExploradorModulos from '@/components/home/explorador_modulos';
import SeccionPro from '@/components/home/seccion_pro';
import RutaRiego from '@/components/home/ruta_riego';
import SeccionEquipo from '@/components/home/seccion_equipo';
import CentroExtension from '@/components/home/centro_extension';
import Contacto from '@/components/home/contacto';

// Home rediseñada. Orden acordado en .impeccable/surfaces/app-page-tsx.md:
// hero → módulos → ruta del riego → (demo guiada, pendiente) → PRO → equipo → Centro de Extensión → contacto.
export default function Home() {
  return (
    <div className="home flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main id="contenido">
        <HeroPlataforma />
        <ExploradorModulos />
        <RutaRiego />
        {/* Demo guiada (pendiente, se arma en /lab-demo) */}
        <SeccionPro />
        <SeccionEquipo />
        <CentroExtension />
        <Contacto />
      </main>
      <Footer />

      <div className="fixed bottom-3 right-3 z-50 h-14 w-14">
        <a href="https://wa.me/56933720947" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp" className="block">
          <Image src={whatsapp} alt="" height={56} width={56} className="rounded-full" />
        </a>
      </div>
    </div>
  )
}

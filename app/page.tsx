'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image';
//!Imagenes
import logo from './public/images/logo.png';
import riego from './public/images/eficienciawidget.png';
import suelo from './public/images/iconsuelo.png';
import clima from './public/images/iconclima.png';
import pozo from './public/images/iconfuente.png';
import planta from './public/images/iconplanta.png';
import fondocentro from './public/images/fondocentro.jpg';
import analisis from './public/images/dataanalitics.png';
import mainModules from './public/images/mainModulesOpt.png';
import desktopClima from './public/images/desktopClima.png';
import desktopPlanta from './public/images/desktopPlanta.png';
import desktopRiego from './public/images/desktopRiego.png';
import desktopSuelo from './public/images/desktopSuelo.png';
import desktopPozo from './public/images/desktopPozo.png';
import desktopAnalisis from './public/images/desktopAnalisis.png';
import backPlanta from './public/images/backPlanta.jpg';
import backRiego from './public/images/backRiego.jpg';
import backClima from './public/images/backClima.jpg';
import backPozo from './public/images/backPozo.jpg';
import backSuelo from './public/images/backSuelo.jpg';
import backAnalisis from './public/images/backAnalisis.png';
import whatsapp from './public/images/whaza.webp';
import NosotrosSection from '@/components/nosotros_section'
import { motion } from 'framer-motion';
import BottomSection from '@/components/bottom_section';
import ModulesTabs, { ModuleItem } from '@/components/modules_tabs';
import TutorialesTeaser from '@/components/tutoriales_teaser';
import Footer from '@/components/footer';
import SiteHeader from '@/components/site_header';

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};

const modulesData: ModuleItem[] = [
  {
    id: 'riego',
    title: 'Módulo Riego',
    shortLabel: 'Riego',
    description: 'Revisa los volúmenes aplicados por sector, analiza desviaciones entre caudales planificados y reales, monitorea alarmas en tiempo real y compara con datos históricos de temporadas anteriores. Una visión integral para optimizar el uso del agua y tomar decisiones basadas en evidencia.',
    iconSrc: riego.src,
    previewSrc: desktopRiego.src,
    backgroundSrc: backRiego.src,
  },
  {
    id: 'pozo',
    title: 'Módulo Pozo',
    shortLabel: 'Pozo',
    description: 'Monitorea en tiempo real el caudal y el nivel freático de tus pozos, con reportes automáticos incluidos los requeridos por la DGA. Seguimiento eficiente, detección de anomalías y cumplimiento normativo para una gestión hídrica precisa.',
    iconSrc: pozo.src,
    previewSrc: desktopPozo.src,
    backgroundSrc: backPozo.src,
  },
  {
    id: 'suelo',
    title: 'Módulo Suelo',
    shortLabel: 'Suelo',
    description: 'Monitorea la humedad del suelo en tiempo real según los riegos aplicados. Gestiona umbrales personalizados para recibir alertas oportunas y ajustar las estrategias de riego, optimizando el uso del agua y la productividad.',
    iconSrc: suelo.src,
    previewSrc: desktopSuelo.src,
    backgroundSrc: backSuelo.src,
  },
  {
    id: 'clima',
    title: 'Módulo Clima',
    shortLabel: 'Clima',
    description: 'Monitorea temperatura, humedad, viento, radiación solar y precipitaciones en tiempo real. Anticipa condiciones meteorológicas y ajusta tus decisiones agrícolas para maximizar la eficiencia de tus recursos.',
    iconSrc: clima.src,
    previewSrc: desktopClima.src,
    backgroundSrc: backClima.src,
  },
  {
    id: 'planta',
    title: 'Módulo Planta',
    shortLabel: 'Planta',
    description: 'Sensores instalados directamente en los árboles entregan información precisa del estado hídrico y fisiológico. Registra también mediciones manuales de potencial hídrico e integra todo en análisis detallados para decisiones informadas.',
    iconSrc: planta.src,
    previewSrc: desktopPlanta.src,
    backgroundSrc: backPlanta.src,
  },
  {
    id: 'analisis',
    title: 'Módulo Análisis de datos',
    shortLabel: 'Análisis',
    description: 'Paneles personalizados para visualizar tendencias, identificar patrones y generar reportes detallados. Integra datos de todos los módulos en una perspectiva global que facilita la gestión eficiente de tus recursos.',
    iconSrc: analisis.src,
    previewSrc: desktopAnalisis.src,
    backgroundSrc: backAnalisis.src,
  },
];

export default function Home() {
  const modulosRef = useRef<HTMLHeadingElement>(null)
  const nosotrosRef = useRef<HTMLHeadingElement>(null)
  const statsRef = useRef<HTMLElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          //setIsStatsVisible(true)
        }
      },
      { threshold: 1 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader
        onScrollToModulos={() => scrollToSection(modulosRef)}
        onScrollToContacto={() => scrollToSection(nosotrosRef)}
      />

      {/* Hero con video y logo */}
      <section
        className="relative pt-16 mb-2 h-screen overflow-hidden w-full"
        id='section-welcome'
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInVariants}
        >
          {/* Contenedor del video */}
          <div className="absolute inset-0 w-full h-full">
            <div className="w-full h-full overflow-hidden relative">
              {/* Contenedor superpuesto para el efecto de glassmorphism */}
              {/* Video de YouTube */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={fondocentro.src}
                aria-hidden="true"
                className="absolute top-0 left-0 w-full h-full bg-black object-cover"
              >
                <source src="https://oliveplus.s3.us-east-1.amazonaws.com/public/oliveHomeBackhd2.mp4" />
                Tu navegador no soporta videos.
              </video>
              {/*<iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/re1g7DogNRc?autoplay=1&mute=1&loop=1&playlist=re1g7DogNRc"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video de fondo de Olive+"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  transform: 'translate(-50%, -50%) scale(1.8)',
                  transformOrigin: 'center center',
                }}
              />*/}
              {/* Gradient overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-80"></div>
            </div>
          </div>
          {/* Overlay para cubrir todo y prevenir clics en el video */}
          <div className="absolute inset-0 bg-black bg-opacity-20 md:bg-opacity-0"></div>
          {/* Fondo sólido para el lado izquierdo en dispositivos medianos y grandes */}
          {/* Contenido: centrado en móvil/tablet, a la izquierda en desktop */}
          <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-start">
            <div className="flex w-full flex-col items-center px-6 text-center lg:w-3/4 lg:items-start lg:px-16 lg:text-left">
              <Image
                src={logo.src}
                alt="Olive+"
                width={450}
                height={163}
                className="mb-6 h-auto w-[280px] lg:order-last lg:mb-0 lg:mt-4 lg:w-[450px]"
              />
              <h1 className="text-whit text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-8xl font-bold leading-tight">
                La manera más fácil de<br />gestionar tu riego,<br />ahora a tu alcance
              </h1>
              {/* Captura de la plataforma bajo el titular (solo bajo desktop) */}
              <Image
                src={mainModules.src}
                alt="Vista de módulos de Olive+"
                width={450}
                height={359}
                priority
                className="mt-8 h-auto w-[320px] md:w-[400px] lg:hidden"
              />
            </div>
          </div>
          {/* Captura de la plataforma, solo desktop */}
          <Image
            src={mainModules.src}
            alt="Vista general de la plataforma Olive+"
            width={450}
            height={359}
            priority
            className="absolute bottom-10 right-0 z-0 hidden h-[60vh] w-auto lg:block"
          />
        </motion.div>
      </section>

      <motion.section
        className="py-16 md:py-20 bg-white text-center flex items-center relative"
        id='bienvenidaText'
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={fondocentro.src}
            alt=""
            fill
            style={{objectFit:"cover"}}
            className="rounded-lg"
          />
        </div>
        <div className="container min-w-full px-0 flex flex-col md:flex-row items-center h-full relative z-10">
          <div className="w-full md:w-1/2 p-8 rounded-lg ml-auto mr-4 md:mr-8 lg:mr-16 bg-black/30 backdrop-blur-lg">
            <h2 className="text-2xl md:text-4xl text-whit font-bold mb-6">Bienvenido al Centro de Extensión Digital de Olive+</h2>
            <p className="text-lg md:text-2xl text-whit mb-6">
              Innovación y aprendizaje para un futuro sostenible.
            </p>
            <p className="text-base md:text-xl text-whit">
              Un espacio creado para transformar la agricultura a través de la innovación, la
              educación y las herramientas tecnológicas. Conectamos a agricultores y expertos con
              conocimientos prácticos y recursos digitales para impulsar prácticas sostenibles y un
              uso eficiente del agua. Explora, aprende y crece con Olive+.
            </p>
          </div>
        </div>
      </motion.section>
      <h2 ref={nosotrosRef} className='scroll-mt-24 text-4xl md:text-5xl text-blk md:px-14 text-center md:text-left py-8 tracking-tighter'>
        Sembramos <span className='font-bold text-primary'>Calidad</span>, Cosechamos <span className='font-bold text-primary'>Confianza</span>
      </h2>
      <NosotrosSection />

      <h2 ref={modulosRef} className='scroll-mt-24 text-4xl md:text-5xl text-blk md:px-14 text-center md:text-left py-8 tracking-tighter'>
        Hazlo <span className='font-bold text-primary'>Fácil</span>, Hazlo <span className='font-bold text-primary'>Mejor</span>
      </h2>
      <motion.section
        id="modulos"
        className="w-full"
      >
        <ModulesTabs modules={modulesData} />
      </motion.section>
      <h2 className='text-4xl md:text-5xl text-blk md:px-14 text-center md:text-left py-8 tracking-tighter'>
        Aprende <span className='font-bold text-primary'>Fácil</span>, Crece <span className='font-bold text-primary'>Con Nosotros</span>
      </h2>
      <TutorialesTeaser />
      <div className='right-3 bottom-3 fixed text-blk w-[70px] h-[70px] z-50 rounded'>
        <a href="https://wa.me/56933720947" target="_blank" rel="noopener noreferrer" className="flex items-center text-green-600 hover:text-green-700">
          <Image
            src={whatsapp.src}
            alt="Contacto"
            height={100}
            width={100}
            className="rounded-lg"
          />
        </a>
      </div>
      <h2 className='text-4xl md:text-5xl text-blk md:px-14 text-center md:text-left py-8 tracking-tighter'>
        Más que una <span className='font-bold text-primary'>plataforma</span>, un <span className='font-bold text-primary'>equipo</span>
      </h2>

      <BottomSection />

      <Footer />
    </div>
  )
}
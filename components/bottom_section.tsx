'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Building, Map, Wrench, Headphones, Sprout, GraduationCap } from "lucide-react";
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import vineyardback from './../app/public/images/vineyardback.jpg';

const accompaniment = [
  {
    icon: Wrench,
    title: 'Implementación en terreno',
    description: 'Instalamos y calibramos los sensores en tu campo junto a tu equipo.',
  },
  {
    icon: Headphones,
    title: 'Soporte técnico continuo',
    description: 'Resolvemos dudas y problemas cuando los necesites, no cuando nos desocupemos.',
  },
  {
    icon: Sprout,
    title: 'Asesoría agronómica',
    description: 'Interpretamos los datos contigo para tomar mejores decisiones de riego.',
  },
  {
    icon: GraduationCap,
    title: 'Capacitación a tu equipo',
    description: 'Formamos a las personas que van a usar Olive+ día a día en tu campo.',
  },
]

// Cifras oficiales: OlivePlus/marketing/presentacion-comercial.md (§2, 11-11-2026)
const STATS = [
  { icon: Building, label: 'Empresas', value: 258 },
  { icon: Cpu, label: 'Dispositivos', value: 678 },
  { icon: Map, label: 'Hectáreas', value: 30000 },
]

const formatCL = (n: number) => n.toLocaleString('es-CL')

const BottomSection: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isStatsVisible) return;

    // Con reduced-motion se muestran las cifras finales sin animar
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    // Conteo de ~1,4 s con desaceleración final (todas las cifras llegan juntas)
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [isStatsVisible]);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2 } },
  };

  return (
    <motion.section
      className="py-16 md:py-20 text-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInVariants}
    >
      {/* Fondo con imagen + overlay primary translúcido */}
      <div className="absolute inset-0 z-0">
        <Image src={vineyardback.src} alt="" fill style={{ objectFit: 'cover' }} />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Nuestro Impacto */}
        <div ref={statsRef} className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl text-white mb-2">
              Nuestro <span className="font-bold">Impacto</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg">
              Cifras que respaldan lo que hacemos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STATS.map(({ icon: Icon, label, value }) => (
              <Card key={label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center text-base md:text-lg font-medium text-white/80">
                    <Icon className="mr-2 w-5 h-5" aria-hidden="true" />
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-5xl font-bold text-center text-white"
                    aria-label={`Más de ${formatCL(value)} ${label.toLowerCase()}`}
                  >
                    +{formatCL(Math.round(value * progress))}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-white/70">
            En Chile, Argentina y Estados Unidos.
          </p>
        </div>

        {/* Nuestro equipo te acompaña */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl text-white mb-2">
              Nuestro equipo <span className="font-bold">te acompaña</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              No somos solo software. Somos parte de tu cadena de servicios.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {accompaniment.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/15 rounded-xl p-6 hover:bg-white/10 hover:border-white/25 transition-all"
                >
                  <div className="bg-clear/20 border border-clear/30 p-3 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-clear" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BottomSection;

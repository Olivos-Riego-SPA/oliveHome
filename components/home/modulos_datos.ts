// Módulos de Olive+ para la home (explorador con la escena 3D; las capturas de la plataforma
// quedan para el hero y la demo guiada). Fuente de los textos: OlivePlus/marketing/presentacion-comercial.md
// (§4 y §6, nov 2026). No agregar funciones que no existan (ver PRODUCT.md › Capabilities and Constraints).
import type { StaticImageData } from 'next/image'

import icRiego from '@/app/public/images/modulos/riego.png'
import icSuelo from '@/app/public/images/modulos/suelo.png'
import icClima from '@/app/public/images/modulos/clima.png'
import icPlanta from '@/app/public/images/modulos/planta.png'
import icFuente from '@/app/public/images/modulos/fuente.png'
import icIndicadores from '@/app/public/images/modulos/indicadores.png'
import icMonitor from '@/app/public/images/modulos/monitor.png'

import logoTalgil from '@/app/public/images/aliados/talgil-color.svg'
import logoPessl from '@/app/public/images/aliados/pessl-color.svg'
import logoDavis from '@/app/public/images/aliados/davis-color.svg'
import logoFlora from '@/app/public/images/aliados/florapulse-color.svg'


export interface Compatible {
  nombre: string
  logo?: StaticImageData
}

export interface Modulo {
  /** Id que entiende la escena 3D (escena_modulos_datos.ts) */
  id: 'riego' | 'suelo' | 'clima' | 'planta' | 'pozo' | 'analisis'
  nombre: string
  icono: StaticImageData
  /** Color oficial del módulo (marca): solo junto a su ícono o como tinte muy suave */
  color: string
  beneficio: string
  puntos: string[]
  funcionaCon: Compatible[]
  /** Nota corta bajo los logos */
  notaCompatibles?: string
}

const TALGIL: Compatible = { nombre: 'Talgil', logo: logoTalgil }
const PESSL: Compatible = { nombre: 'PESSL', logo: logoPessl }
const DAVIS: Compatible = { nombre: 'DAVIS', logo: logoDavis }
const FLORA: Compatible = { nombre: 'FloraPulse', logo: logoFlora }

export const ICONOS_MODULO = {
  riego: icRiego,
  suelo: icSuelo,
  clima: icClima,
  planta: icPlanta,
  pozos: icFuente,
  indicadores: icIndicadores,
  monitoreo: icMonitor,
}

export const MODULOS_HOME: Modulo[] = [
  {
    id: 'riego',
    nombre: 'Riego',
    icono: icRiego,
    color: '#00C1C6',
    beneficio: 'Los problemas saltan a la vista',
    puntos: [
      'El desempeño de cada equipo y sector, pintado sobre el mapa satelital de tu campo.',
      'Caudal real contra nominal, riego y fertirriego junto a la ETo o la ETc.',
      'Las alarmas de tu controlador, ordenadas por severidad.',
    ],
    funcionaCon: [TALGIL],
    notaCompatibles: 'Controladores DREAM y SAPIR',
  },
  {
    id: 'suelo',
    nombre: 'Suelo',
    icono: icSuelo,
    color: '#845B35',
    beneficio: 'Sabes si el agua está llegando a la raíz',
    puntos: [
      'Humedad, temperatura y salinidad por sensor y por profundidad.',
      'Bandas agronómicas según los umbrales de cada sector: saturado, óptimo, moderado y seco.',
      'Balance hídrico: riego, lluvia y ETo o ETc en un mismo gráfico.',
    ],
    funcionaCon: [PESSL, TALGIL],
    notaCompatibles: 'Sensores PESSL o conectados a tu Talgil',
  },
  {
    id: 'clima',
    nombre: 'Clima',
    icono: icClima,
    color: '#FAB500',
    beneficio: 'La ETc: la medida más precisa de cuánto regar',
    puntos: [
      'Temperatura, humedad, viento, radiación, punto de rocío y DPV de la estación de tu campo.',
      'La ETc: la ETo ajustada a la curva de tu cultivo en su etapa.',
      'Horas frío (cuatro modelos) y días grado (siete bases), con objetivo y avance.',
    ],
    funcionaCon: [DAVIS, PESSL],
    notaCompatibles: 'Estaciones DAVIS o PESSL, incluso combinadas',
  },
  {
    id: 'planta',
    nombre: 'Planta',
    icono: icPlanta,
    color: '#028C44',
    beneficio: 'La planta te dice cómo está',
    puntos: [
      'El potencial hídrico de cada sector, con su línea base y su línea de riego.',
      'Un mapa del campo pintado por nivel de estrés.',
      'Funciona también sin sensores, con lecturas manuales de bomba Scholander.',
    ],
    funcionaCon: [FLORA],
    notaCompatibles: 'Microtensiómetros o lecturas manuales',
  },
  {
    id: 'pozo',
    nombre: 'Pozos',
    icono: icFuente,
    color: '#0059C4',
    beneficio: 'Tus fuentes de agua, siempre a la vista',
    puntos: [
      'Caudal, nivel freático y volumen acumulado de cada pozo y fuente superficial.',
      'La línea del caudal máximo autorizado en el gráfico.',
      'En Chile, el envío de las mediciones a la DGA con comprobante e historial.',
    ],
    funcionaCon: [TALGIL],
    notaCompatibles: 'Telemetría de pozos conectada a tu Talgil',
  },
  {
    id: 'analisis',
    nombre: 'Indicadores',
    icono: icIndicadores,
    color: '#F98800',
    beneficio: 'Tu tablero, a tu manera',
    puntos: [
      'Tableros propios por campo con los gráficos, mapas e indicadores de todos los módulos.',
      'Ordénalos a tu gusto y preséntalos o guárdalos en PDF.',
      'Con PRO suma semáforos por equipo y sector, puntaje de calidad de riego y más.',
    ],
    funcionaCon: [{ nombre: 'Todos tus módulos' }],
  },
]

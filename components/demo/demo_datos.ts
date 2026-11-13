import type { StaticImageData } from 'next/image'
import iconPozo from '@/app/public/images/demo/pozo.png'
import iconRiego from '@/app/public/images/demo/riego.png'
import iconPlanta from '@/app/public/images/demo/planta.png'
import iconSuelo from '@/app/public/images/demo/suelo.png'
import iconClima from '@/app/public/images/demo/clima.png'
import iconAnalisis from '@/app/public/images/demo/analisis.png'
import iconIndicadores from '@/app/public/images/demo/indicadores.png'
import iconMonitoreo from '@/app/public/images/demo/monitoreo.png'
import iconSoporte from '@/app/public/images/demo/soporte.png'
import iconAjustes from '@/app/public/images/demo/ajustes.png'

/** Datos simulados de la demo. Nada sale de un backend: es un campo y un usuario ficticios. */

export const USUARIO_DEMO = {
  nombre: 'Usuario Demo',
  iniciales: 'UD',
}

export type ModuloDemo = {
  id: string
  nombre: string
  icono: StaticImageData
  /** Exclusivo del plan PRO: lleva el medallón dorado. */
  pro?: boolean
  /** No se abre en la demo: va en blanco y negro y no responde al clic */
  inactivo?: boolean
}

// Mismo orden que la grilla 5×2 del home de Olive+ (olive_next/app/home/components/HomeDesktop.tsx)
export const MODULOS_DEMO: ModuloDemo[] = [
  { id: 'pozo', nombre: 'Pozo', icono: iconPozo },
  { id: 'riego', nombre: 'Riego', icono: iconRiego },
  { id: 'planta', nombre: 'Planta', icono: iconPlanta },
  { id: 'suelo', nombre: 'Suelo', icono: iconSuelo },
  { id: 'clima', nombre: 'Clima', icono: iconClima },
  { id: 'analisis', nombre: 'Análisis de datos', icono: iconAnalisis, inactivo: true },
  { id: 'indicadores', nombre: 'Indicadores', icono: iconIndicadores },
  { id: 'monitoreo', nombre: 'Monitoreo', icono: iconMonitoreo, pro: true },
  { id: 'soporte', nombre: 'Soporte', icono: iconSoporte, pro: true, inactivo: true },
  { id: 'ajustes', nombre: 'Ajustes', icono: iconAjustes, inactivo: true },
]

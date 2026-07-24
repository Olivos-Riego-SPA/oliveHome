// Datos compartidos entre la UI (botones) y la escena 3D.
// Sin imports de three: este archivo entra al bundle inicial, la escena no.
import iconRiego from '@/app/public/images/eficienciawidget.png'
import iconPozo from '@/app/public/images/iconfuente.png'
import iconSuelo from '@/app/public/images/iconsuelo.png'
import iconPlanta from '@/app/public/images/iconplanta.png'
import iconClima from '@/app/public/images/iconclima.png'
import iconAnalisis from '@/app/public/images/dataanalitics.png'

export const MODULOS = [
  {
    id: 'riego',
    nombre: 'Riego',
    descripcion: 'Controla y monitorea el riego del campo en tiempo real.',
    icono: iconRiego.src,
    dispositivo: 'Datos desde controladores TALGIL, modelos SAPIR y DREAM.',
  },
  {
    id: 'pozo',
    nombre: 'Pozo',
    descripcion: 'Nivel y caudal del pozo: el agua disponible para regar.',
    icono: iconPozo.src,
    dispositivo: 'Monitoreo de nivel y caudal, con reporte automático a la DGA.',
  },
  {
    id: 'suelo',
    nombre: 'Suelo',
    descripcion: 'Sensores de humedad y temperatura del suelo.',
    icono: iconSuelo.src,
    dispositivo: 'Sensores de suelo mediante dispositivos TALGIL o PESSL.',
  },
  {
    id: 'planta',
    nombre: 'Planta',
    descripcion: 'Seguimiento del estado hídrico directamente en la planta.',
    icono: iconPlanta.src,
    dispositivo: 'Medición directa en la planta con sensores FLORAPULSE.',
  },
  {
    id: 'clima',
    nombre: 'Clima',
    descripcion: 'Estación meteorológica: viento, lluvia y temperatura.',
    icono: iconClima.src,
    dispositivo: 'Información de estaciones meteorológicas DAVIS o PESSL.',
  },
  {
    id: 'analisis',
    nombre: 'Análisis de datos',
    descripcion:
      'Todo el campo se acopla en Olive: paneles personalizados para decidir con datos.',
    icono: iconAnalisis.src,
    dispositivo: 'Toda la información de tu campo, consolidada en OLIVE+.',
  },
] as const

export type ModuloId = (typeof MODULOS)[number]['id']

// Datos compartidos entre la UI (botones) y la escena 3D.
// Sin imports de three: este archivo entra al bundle inicial, la escena no.
import iconRiego from '@/app/public/images/eficienciawidget.png'
import iconPozo from '@/app/public/images/iconfuente.png'
import iconSuelo from '@/app/public/images/iconsuelo.png'
import iconPlanta from '@/app/public/images/iconplanta.png'
import iconClima from '@/app/public/images/iconclima.png'
import iconIndicadores from '@/app/public/images/iconindicadores.png'

export const MODULOS = [
  {
    id: 'riego',
    nombre: 'Riego',
    descripcion: 'El desempeño de cada equipo y sector, con riego y fertirriego.',
    icono: iconRiego.src,
    dispositivo: 'Datos desde controladores TALGIL, modelos SAPIR y DREAM.',
  },
  {
    id: 'pozo',
    nombre: 'Pozo',
    descripcion: 'Nivel y caudal del pozo: el agua disponible para regar.',
    icono: iconPozo.src,
    dispositivo: 'Caudal, nivel y volumen desde tu Talgil, con envío de mediciones a la DGA.',
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
    dispositivo: 'Sensores FLORAPULSE o lecturas manuales con bomba Scholander.',
  },
  {
    id: 'clima',
    nombre: 'Clima',
    descripcion: 'Estación meteorológica: el clima del campo y la ETc de tu cultivo.',
    icono: iconClima.src,
    dispositivo: 'Estaciones DAVIS o PESSL, incluso combinadas en una sola.',
  },
  {
    // El id se mantiene como 'analisis' porque la escena 3D mapea por id (nube central)
    id: 'analisis',
    nombre: 'Indicadores',
    descripcion: 'Tu tablero, a tu manera: lo que más te importa de cada campo.',
    icono: iconIndicadores.src,
    dispositivo: 'Gráficos, mapas e indicadores de todos los módulos en un solo tablero.',
  },
] as const

export type ModuloId = (typeof MODULOS)[number]['id']

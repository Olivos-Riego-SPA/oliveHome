/**
 * Guion de la demo guiada sobre el home de Olive+. Cada paso enfoca un elemento marcado con
 * `data-guia="<objetivo>"` dentro de la demo.
 *
 * Textos basados en components/home/modulos_datos.ts (fuente: OlivePlus/marketing/presentacion-comercial.md).
 * Respetar PRODUCT.md: nada de "en tiempo real"/"en vivo", "IA", que Olive+ controla el riego,
 * ni alertas configurables.
 */
export type PasoGuia = {
  /** Valor de `data-guia` del elemento a enfocar. `null` = sin foco: la demo queda libre para explorar */
  objetivo: string | null
  titulo: string
  texto: string
  /** Segundos que dura el paso en el avance automático */
  duracion?: number
  /** Radio del foco en px del lienzo (por defecto 32, redondo como los íconos del home) */
  radio?: number
  /** El paso no avanza solo: espera que el usuario toque el objetivo dentro de la demo */
  esperaClic?: boolean
  /** Nombre para referirse al paso desde la pantalla (abrir el informe, la pantalla completa…) */
  id?: string
  /** Función del plan PRO: el panel lo marca con el sello dorado */
  pro?: boolean
  /** Cierre de la ruta: tapa la demo con la invitación a contactarnos */
  cierre?: boolean
}

/** Pantallas de la demo que tienen su propio tour */
export type PantallaDemo = 'home' | 'suelo' | 'planta' | 'pozo' | 'clima' | 'riego' | 'indicadores' | 'monitoreo'

const PASOS_HOME: PasoGuia[] = [
  {
    objetivo: 'grilla',
    titulo: 'Tu campo completo en una sola pantalla',
    texto:
      'Así se ve Olive+ al entrar. Cada módulo reúne los datos de los equipos que ya tienes en el campo. Te mostramos cómo te ayudan a decidir el riego.',
  },
  {
    objetivo: 'riego',
    titulo: 'Parte por lo que regaste',
    texto:
      'Revisa cuánto regó cada equipo y sector, pintado sobre el mapa satelital de tu campo. Los problemas saltan a la vista, junto a las alarmas de tu controlador.',
  },
  {
    objetivo: 'suelo',
    titulo: '¿El agua llegó a la raíz?',
    texto:
      'Los sensores muestran la humedad por profundidad, con bandas que indican si cada sector está saturado, óptimo, moderado o seco.',
  },
  {
    objetivo: 'planta',
    titulo: 'La planta te dice cómo está',
    texto:
      'El potencial hídrico de cada sector muestra cuándo empieza el estrés, antes de que se note en el campo. Funciona con sensores o con lecturas manuales.',
  },
  {
    objetivo: 'clima',
    titulo: '¿Regaste lo que tu cultivo necesitaba?',
    texto:
      'Con la estación de tu campo, Olive+ calcula la ETo y la ETc, la ETo ajustada a tu cultivo y su etapa. Las ves junto a tu riego, así comparas lo que regaste con lo que necesitaba.',
  },
  {
    objetivo: 'pozo',
    titulo: 'Tus fuentes de agua, siempre a la vista',
    texto:
      'Caudal, nivel freático y volumen de cada pozo, con el caudal máximo autorizado en el gráfico. En Chile, además, envías tus mediciones a la DGA.',
  },
  {
    objetivo: 'indicadores',
    titulo: 'Tu tablero, a tu manera',
    texto:
      'Arma tableros con los gráficos, mapas e indicadores de todos los módulos. Ordénalos a tu gusto y preséntalos o guárdalos en PDF.',
  },
  {
    objetivo: 'monitoreo',
    pro: true,
    titulo: 'Con PRO, una sala de control',
    texto:
      'Monitoreo reúne el mapa de riego, la humedad del suelo, el pozo y el clima de tu campo en una sola pantalla.',
  },
  {
    // Soporte no se abre en la demo (va en gris): el mensaje del equipo enfoca toda la grilla
    objetivo: 'grilla',
    titulo: 'Y detrás, un equipo que te acompaña',
    texto:
      'Instalamos, capacitamos y resolvemos tus dudas durante toda la temporada.',
  },
  {
    // Cierre del tour: se quita el oscurecido y los módulos quedan libres para abrirlos
    objetivo: null,
    titulo: 'Ahora recórrela tú',
    texto: 'Elige cualquier módulo de la demo para entrar y moverte por Olive+.',
  },
]

/**
 * Suelo, primera acción: entrar al módulo y conocer sus partes con el Sector 16 (verde), y luego
 * tocar el sector seco del mapa para ver cómo cambian ambos gráficos.
 */
const PASOS_SUELO: PasoGuia[] = [
  {
    objetivo: 'suelo-campo',
    radio: 22,
    titulo: 'Entraste a Suelo',
    texto: 'Primero eliges el campo que quieres revisar. Si tienes varios, cambias entre ellos desde aquí.',
  },
  {
    objetivo: 'suelo-fecha',
    titulo: 'Elige el período',
    texto: 'Partes viendo las últimas dos semanas. Con el calendario revisas cualquier período de la temporada.',
  },
  {
    objetivo: 'suelo-mapa',
    radio: 14,
    titulo: 'Tu campo en el mapa',
    texto:
      'Cada sector se pinta según su humedad. Estás viendo el Sector 16: en verde, porque su humedad está en el rango óptimo.',
  },
  {
    objetivo: 'suelo-graficos',
    radio: 14,
    duracion: 9,
    titulo: 'Gráficos sincronizados',
    texto:
      'Al recorrer un gráfico, el otro te sigue. Cada riego del balance coincide con una subida de la humedad, que se mantiene en la banda óptima.',
  },
  {
    objetivo: 'suelo-sector',
    radio: 14,
    esperaClic: true,
    id: 'sector',
    titulo: 'Toca el sector en rojo',
    texto: 'El Sector 13 aparece seco. Tócalo en el mapa para ver qué está pasando.',
  },
  {
    objetivo: 'suelo-graficos',
    radio: 14,
    duracion: 9,
    titulo: 'Sector 13: le está faltando agua',
    texto:
      'La humedad bajó hasta la banda seca: en dos semanas recibió un solo riego corto, mientras la ETo siguió alta.',
  },
  {
    objetivo: 'suelo-analisis',
    radio: 26,
    esperaClic: true,
    pro: true,
    titulo: 'Análisis Inteligente',
    texto:
      'Función PRO. Con un clic, Olive+ revisa el período del sector y te entrega un informe con lo importante. Tócalo.',
  },
  {
    objetivo: null,
    id: 'informe',
    pro: true,
    duracion: 11,
    titulo: 'Un informe en segundos',
    texto:
      'Resume el período del Sector 13: cuánto tiempo estuvo en cada zona, el balance de agua y hasta dónde llegó el riego. Todo apunta a lo mismo: le falta agua.',
  },
  {
    objetivo: 'suelo-pantalla-completa',
    radio: 20,
    esperaClic: true,
    titulo: 'Míralo en grande',
    texto: 'Toca pantalla completa para ver todos los gráficos del sector juntos.',
  },
  {
    objetivo: null,
    id: 'detalle',
    duracion: 11,
    titulo: 'Todo el sector en una vista',
    texto:
      'Humedad acumulada, los 5 sensores por profundidad y el balance hídrico, sincronizados. El único riego apenas movió el sensor de 20 cm: el agua no llegó a la raíz.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Suelo. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

/**
 * Planta: ruta propia, con menos acciones. Termina en el resumen de sectores, que da las conclusiones
 * de un vistazo. Cada módulo es una ruta independiente: los textos no mencionan otros módulos.
 */
const PASOS_PLANTA: PasoGuia[] = [
  {
    objetivo: 'planta-campo',
    radio: 22,
    titulo: 'Entraste a Planta',
    texto: 'Eliges el campo y el período que quieres revisar, y ves cómo está la planta en cada sector.',
  },
  {
    objetivo: 'planta-mapa',
    radio: 14,
    titulo: 'El estrés de cada sector',
    texto:
      'El mapa pinta cada sector según el estrés de la planta. Funciona con microtensiómetros o con lecturas manuales. El Sector 16 está en verde: estrés adecuado.',
  },
  {
    objetivo: 'planta-graficos',
    radio: 14,
    duracion: 9,
    titulo: 'Entre la línea de base y la de riego',
    texto:
      'El potencial hídrico del Sector 16 se mueve entre sus dos líneas. Mientras no cruce la línea de riego, la planta está bien.',
  },
  {
    objetivo: 'planta-sector',
    radio: 14,
    esperaClic: true,
    id: 'sector',
    titulo: 'Toca el sector en rojo',
    texto: 'El Sector 13 aparece con estrés moderado. Tócalo para ver qué está pasando.',
  },
  {
    objetivo: 'planta-graficos',
    radio: 14,
    duracion: 9,
    titulo: 'Sector 13: la planta pide agua',
    texto:
      'El potencial hídrico cruzó la línea de riego y siguió bajando. El balance lo explica: el riego no alcanzó a cubrir la ETc.',
  },
  {
    objetivo: 'planta-resumen-boton',
    radio: 18,
    esperaClic: true,
    titulo: 'Todos los sectores de un vistazo',
    texto: 'Toca Resumen para ver el estado de cada sector sin abrirlos uno por uno.',
  },
  {
    objetivo: 'planta-resumen',
    radio: 14,
    duracion: 10,
    id: 'resumen',
    titulo: 'Conclusiones en segundos',
    texto:
      'Cada barra ubica al sector entre su línea de riego y su línea de base. Se ve al tiro: el 13 necesita agua, el 15 va camino a necesitarla y el 14 tiene agua de más.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Planta. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

/**
 * Pozo: el listado de pozos en tarjetas y, al tocar el detalle del Pozo Norte, sus indicadores,
 * gráficos y la opción de ver los envíos a la DGA. Solo pozos (no aguas superficiales).
 */
const PASOS_POZO: PasoGuia[] = [
  {
    objetivo: 'pozo-listado',
    radio: 14,
    titulo: 'Todos tus pozos de un vistazo',
    texto:
      'Entraste a Pozo. Cada tarjeta resume la última semana de un pozo: nivel freático, profundidad, caudal y volumen total.',
  },
  {
    objetivo: 'pozo-tarjeta',
    radio: 16,
    duracion: 8,
    titulo: 'Un pozo, una tarjeta',
    texto:
      'El tubo muestra la columna de agua del pozo según su profundidad, y el gráfico cómo se movieron el nivel y el caudal en los últimos 7 días.',
  },
  {
    objetivo: 'pozo-detalle-boton',
    radio: 18,
    esperaClic: true,
    titulo: 'Revisa el detalle',
    texto: 'Toca el botón de detalle del Pozo Norte.',
  },
  {
    objetivo: 'pozo-indicadores',
    radio: 16,
    id: 'detalle',
    titulo: 'La última medición',
    texto: 'Arriba ves el caudal, el nivel freático y el volumen total del pozo, junto a su caudal permitido.',
  },
  {
    objetivo: 'pozo-graficos',
    radio: 14,
    duracion: 9,
    titulo: 'Nivel y caudal en el tiempo',
    texto:
      'El nivel freático baja cada vez que el pozo bombea y se recupera después. La línea roja marca el caudal permitido. En la otra pestaña ves el volumen acumulado.',
  },
  {
    objetivo: 'pozo-dga-detalle',
    radio: 22,
    titulo: 'Tus envíos a la DGA',
    texto: 'En Chile, desde aquí revisas el historial de envíos a la DGA de este pozo, con su comprobante.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Pozo. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

/**
 * Clima: variables y acumulaciones de la estación, y el pronóstico como función PRO. La reposición
 * (comparar riego con ETo/ETc) es tema de Riego: aquí la ETc solo aparece como un dato más.
 */
const PASOS_CLIMA: PasoGuia[] = [
  {
    objetivo: 'clima-campo',
    radio: 22,
    titulo: 'Entraste a Clima',
    texto: 'Primero eliges el campo que quieres revisar. Si tienes varios, cambias entre ellos desde aquí.',
  },
  {
    objetivo: 'clima-fecha',
    titulo: 'Elige el período',
    texto: 'Partes viendo las últimas dos semanas. Con el calendario revisas cualquier período de la temporada.',
  },
  {
    objetivo: 'clima-estacion',
    radio: 14,
    titulo: 'La estación de tu campo',
    texto: 'Ves los datos de la estación meteorológica de tu campo, ubicada en el mapa.',
  },
  {
    objetivo: 'clima-indicadores',
    radio: 20,
    titulo: 'El período de un vistazo',
    texto: 'Arriba, siempre a la vista: temperatura máxima y media, lluvia, horas frío, días grado y la ETc del día.',
  },
  {
    objetivo: 'clima-grafico',
    radio: 14,
    id: 'variables',
    titulo: 'Todas las variables',
    texto:
      'Cada variable tiene su pestaña: temperatura y humedad, DPV y punto de rocío, radiación, viento y evapotranspiración.',
  },
  {
    objetivo: 'clima-grafico',
    radio: 14,
    id: 'acumulaciones',
    duracion: 8,
    titulo: 'Las acumulaciones',
    texto:
      'Horas frío y días grado acumulados en la temporada, con el objetivo de tu cultivo y cuánto llevas.',
  },
  {
    objetivo: 'clima-pronostico-boton',
    radio: 22,
    esperaClic: true,
    pro: true,
    titulo: 'Pronóstico',
    texto: 'Función PRO. Toca el botón de pronóstico de la estación.',
  },
  {
    objetivo: 'clima-pronostico',
    radio: 14,
    id: 'pronostico',
    pro: true,
    titulo: 'Los próximos 7 días',
    texto: 'El pronóstico para tu campo: temperatura máxima y mínima, y la lluvia esperada día a día. También puedes verlo cada 6 horas.',
  },
  {
    objetivo: 'clima-dia',
    radio: 12,
    esperaClic: true,
    pro: true,
    titulo: 'Toca un día',
    texto: 'Toca el sábado para ver su detalle.',
  },
  {
    objetivo: null,
    id: 'dia',
    pro: true,
    duracion: 10,
    titulo: 'Todo el día en detalle',
    texto: 'Precipitación, radiación, viento y ráfagas, amanecer y atardecer, y la ETc proyectada para ese día.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Clima. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

/**
 * Riego: aquí vive la reposición — comparar lo regado con la ETo o la ETc.
 * Va de lo general a lo particular: campo y dispositivo → mapa → equipos (riego y fertirriego) →
 * sectores del equipo que el usuario toca. El siguiente nivel de detalle viene después.
 */
const PASOS_RIEGO: PasoGuia[] = [
  {
    objetivo: 'riego-campo',
    radio: 12,
    titulo: 'Entraste a Riego',
    texto: 'Arriba eliges el campo que quieres revisar. Si tienes varios, cambias entre ellos desde aquí.',
  },
  {
    objetivo: 'riego-dispositivo',
    radio: 22,
    titulo: 'Elige el dispositivo',
    texto: 'Luego eliges el dispositivo de riego del campo cuyos datos quieres ver.',
  },
  {
    objetivo: 'riego-fecha',
    titulo: 'Elige el período',
    texto: 'Partes viendo las últimas dos semanas. Con el calendario revisas cualquier período de la temporada.',
  },
  {
    objetivo: 'riego-indicadores',
    radio: 20,
    titulo: 'El riego del período',
    texto: 'Volumen total, horas de riego, superficie, lámina aplicada por hectárea y el desempeño de tus equipos.',
  },
  {
    objetivo: 'riego-mapa',
    radio: 14,
    duracion: 8,
    titulo: 'Tu riego en el mapa',
    texto:
      'Cada sector se pinta según su desempeño: lo que regaste comparado con la ETo del período. Verde es óptimo, rojo es sobre el máximo y rosado, bajo el mínimo.',
  },
  {
    objetivo: 'riego-comparar',
    radio: 22,
    esperaClic: true,
    pro: true,
    titulo: 'Compara dos períodos',
    texto: 'Función PRO. Toca el botón de comparar para ver este período junto a otro.',
  },
  {
    objetivo: 'riego-mapa',
    radio: 14,
    id: 'comparar',
    pro: true,
    duracion: 10,
    titulo: 'Dos períodos, un mapa',
    texto:
      'A la izquierda este período y a la derecha el mismo de la temporada pasada. Arrastra la cortina para comparar. Los indicadores de arriba también muestran la comparativa.',
  },
  {
    objetivo: 'riego-capas',
    radio: 22,
    esperaClic: true,
    pro: true,
    titulo: 'Las capas del mapa',
    texto: 'Función PRO. Toca el botón de capas.',
  },
  {
    objetivo: 'riego-mapa',
    radio: 14,
    id: 'capas',
    pro: true,
    duracion: 10,
    titulo: 'Pinta el mapa a tu manera',
    texto:
      'Desempeño, reposición o lo aplicado en mm o m³: eliges cómo pintar el mapa. En la comparativa, puedes poner una capa distinta a cada lado.',
  },
  {
    objetivo: 'riego-tab-graficos',
    radio: 14,
    esperaClic: true,
    // Aquí la comparativa del mapa ya se cerró sola
    id: 'fin-comparar',
    titulo: 'Toca Gráficos',
    texto: 'Para ver el riego de cada equipo, toca la pestaña Gráficos.',
  },
  {
    objetivo: 'riego-graficos',
    radio: 14,
    id: 'equipos',
    duracion: 8,
    titulo: 'Tus equipos',
    texto:
      'Un equipo es un conjunto de sectores que se riegan juntos. Aquí comparas de un vistazo lo que regó cada uno con la ETc del período.',
  },
  {
    objetivo: 'riego-graficos',
    radio: 14,
    duracion: 9,
    titulo: 'El desempeño de cada equipo',
    texto:
      'La línea amarilla es el desempeño: lo regado frente a la ETc, que es la ETo ajustada a tu cultivo y su etapa, la referencia más precisa (por eso el botón está en verde). El Equipo 3 quedó bajo el mínimo y el 6, sobre el máximo.',
  },
  {
    objetivo: 'riego-toggle',
    radio: 14,
    esperaClic: true,
    titulo: 'Toca Fertirriego',
    texto: 'También ves el fertirriego de cada equipo. Toca Fertirriego.',
  },
  {
    objetivo: 'riego-graficos',
    radio: 14,
    id: 'ferti',
    duracion: 8,
    titulo: 'Fertirriego acumulado por equipo',
    texto: 'Los fertilizantes que aplicó cada equipo en el período, canal por canal. Al terminar, el gráfico vuelve solo al riego.',
  },
  {
    objetivo: 'riego-comparar',
    radio: 22,
    esperaClic: true,
    id: 'vuelta-riego',
    pro: true,
    titulo: 'Compara los gráficos',
    texto: 'Función PRO. Toca comparar para ver el riego de tus equipos junto al de la temporada pasada.',
  },
  {
    objetivo: 'riego-graficos',
    radio: 14,
    id: 'comparar-graficos',
    pro: true,
    duracion: 10,
    titulo: 'Lado a lado',
    texto:
      'Los mismos gráficos de ambos períodos, uno al lado del otro: ves al tiro qué equipo cambió de una temporada a otra.',
  },
  {
    objetivo: 'riego-analisis',
    radio: 20,
    esperaClic: true,
    // Aquí la comparativa de los gráficos ya se cerró sola
    id: 'fin-comparar-graficos',
    pro: true,
    titulo: 'Análisis Inteligente',
    texto: 'Función PRO. Con un clic, Olive+ revisa el riego de tus equipos y te entrega un informe con lo importante. Tócalo.',
  },
  {
    objetivo: null,
    id: 'informe',
    pro: true,
    duracion: 11,
    titulo: 'Un informe en segundos',
    texto:
      'Cuántos equipos quedaron en rango, cuánto repusieron frente a la ETc y cuáles se salieron, y por cuánto.',
  },
  {
    objetivo: 'riego-barras',
    radio: 14,
    esperaClic: true,
    id: 'barras',
    titulo: 'Baja un nivel',
    texto: 'Toca la barra de cualquier equipo para ver sus sectores.',
  },
  {
    objetivo: 'riego-barras',
    radio: 14,
    esperaClic: true,
    id: 'sectores',
    titulo: 'Los sectores del equipo',
    texto:
      'El mismo gráfico, ahora con los sectores del equipo que elegiste: cuánto regó cada uno frente a la ETc. Toca cualquier sector para ver su detalle.',
  },
  {
    // A pantalla completa: sin foco
    objetivo: null,
    id: 'detalle',
    duracion: 10,
    titulo: 'El detalle del sector',
    texto:
      'Día a día: lo regado junto a la ETc, las horas de riego y el desempeño de cada riego. A la izquierda, el resumen del período: cuántos riegos hubo y cuántos estuvieron en rango.',
  },
  {
    objetivo: 'riego-analisis-detalle',
    radio: 20,
    esperaClic: true,
    pro: true,
    titulo: 'Analiza el sector',
    texto: 'Función PRO. El Análisis Inteligente también revisa un sector día a día. Tócalo.',
  },
  {
    objetivo: null,
    id: 'informe-sector',
    pro: true,
    duracion: 10,
    titulo: 'El sector, día a día',
    texto:
      'El informe revisa el comportamiento hidráulico y el balance hídrico del sector en cada día: qué riegos estuvieron en rango, cuáles no y los días sin riego.',
  },
  {
    objetivo: null,
    id: 'detalle-comparativa',
    pro: true,
    duracion: 10,
    titulo: 'También con comparativa',
    texto:
      'Con dos períodos, ves el detalle del sector uno arriba del otro: este período y el de la temporada pasada. El Análisis Inteligente también los compara y te dice qué cambió.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Riego. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

/**
 * Indicadores: ruta corta. Un tablero ya armado, sus opciones y agregar un widget arrastrándolo
 * desde el panel del modo edición.
 */
const PASOS_INDICADORES: PasoGuia[] = [
  {
    objetivo: 'ind-tablero',
    radio: 14,
    titulo: 'Entraste a Indicadores',
    texto:
      'Tus tableros, armados a tu manera con los mapas, gráficos e indicadores de todos tus módulos. Este es el tablero del Fundo Demo.',
  },
  {
    objetivo: 'ind-opciones',
    radio: 22,
    titulo: 'Las opciones del tablero',
    texto:
      'Eliges el campo y el período, comparas con la ETo o la ETc, lo presentas a pantalla completa o lo capturas. Y con Editar, lo armas a tu gusto.',
  },
  {
    objetivo: 'ind-editar',
    radio: 22,
    esperaClic: true,
    titulo: 'Toca Editar',
    texto: 'Para agregar un widget al tablero, toca Editar.',
  },
  {
    objetivo: 'ind-widget',
    radio: 12,
    esperaClic: true,
    id: 'editar',
    titulo: 'Arrastra un widget',
    texto:
      'En el panel están los widgets de todos tus módulos. Arrastra Potencial hídrico diario al espacio libre del tablero, o tócalo.',
  },
  {
    objetivo: 'ind-nuevo',
    radio: 14,
    id: 'agregado',
    duracion: 9,
    titulo: 'Ya está en tu tablero',
    texto: 'El widget queda junto a los demás, con los datos de tu campo. Guardas y lo tienes cada vez que entres.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Indicadores. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

/** Monitoreo (PRO): ruta corta. La sala de control da la vuelta sola y se cambia de campo. */
const PASOS_MONITOREO: PasoGuia[] = [
  {
    objetivo: 'mon-tablero',
    radio: 14,
    pro: true,
    titulo: 'Entraste a Monitoreo',
    texto:
      'Función PRO. Reúne los widgets de Olive+ en una sala de control: el mapa de riego, la humedad del suelo, el riego, el clima y el pozo, en una sola pantalla.',
  },
  {
    objetivo: 'mon-estado',
    radio: 14,
    id: 'rotacion',
    duracion: 14,
    titulo: 'Da la vuelta sola',
    texto:
      'La diferencia: va corriendo solo. Recorre cada sector, la estación y el pozo, unos segundos cada uno, y el mapa marca lo que estás viendo. Tú eliges cuánto dura cada uno: ideal para dejarlo en una pantalla.',
  },
  {
    objetivo: 'mon-campo',
    radio: 18,
    esperaClic: true,
    titulo: 'Cambia de campo',
    texto: 'Si tienes varios campos, cambias desde aquí. Toca el campo para pasar a Fundo Norte.',
  },
  {
    objetivo: 'mon-tablero',
    radio: 14,
    id: 'norte',
    duracion: 14,
    titulo: 'Otro campo, la misma vista',
    texto: 'El monitoreo sigue su vuelta, ahora por los sectores, la estación y el pozo de Fundo Norte.',
  },
  {
    objetivo: null,
    id: 'cierre',
    cierre: true,
    titulo: '¿Te interesa?',
    texto: 'Esto es solo una parte de Monitoreo. Conversemos y te mostramos todas las funciones de Olive+ con los datos de tu campo.',
  },
]

export const TOURS: Record<PantallaDemo, PasoGuia[]> = {
  home: PASOS_HOME,
  suelo: PASOS_SUELO,
  planta: PASOS_PLANTA,
  pozo: PASOS_POZO,
  clima: PASOS_CLIMA,
  riego: PASOS_RIEGO,
  indicadores: PASOS_INDICADORES,
  monitoreo: PASOS_MONITOREO,
}

/** Duración por defecto de cada paso, en segundos */
export const DURACION_PASO = 7

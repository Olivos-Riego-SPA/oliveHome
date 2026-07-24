'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import { MODULOS } from './escena_modulos_datos'

// Ángulo (en XZ) hacia el que mira la cámara isométrica: el "frente" de la escena.
const FRENTE = Math.PI / 4
const LADO = 8
// Los dispositivos van en las diagonales (esquinas del bloque): así, con el módulo
// activo al frente, el bloque se ve como rombo con la punta hacia la cámara.
const RADIO_DISPOSITIVOS = 4.0
const ESQUINAS = [0, 1, 2, 3].map((i) => Math.PI / 4 + (i * Math.PI) / 2)
// Zoom de la cámara: de viaje entre módulos vs. detenida sobre uno
const ZOOM_LEJOS = 48
const ZOOM_CERCA = 72

// Ubicación de cada dispositivo, en el mismo orden que MODULOS.
// `esquina` es a cuál rota el bloque cuando el módulo está activo: el pozo comparte
// la esquina del riego (están uno al lado del otro, alimentados por la misma agua).
// `alto` es dónde ancla el aviso flotante: justo sobre la parte más alta del dispositivo
const DISPOSICION = [
  {
    esquina: 0,
    x: Math.sin(ESQUINAS[0]) * RADIO_DISPOSITIVOS,
    z: Math.cos(ESQUINAS[0]) * RADIO_DISPOSITIVOS,
    rotY: ESQUINAS[0],
    alto: 1.45,
  },
  { esquina: 0, x: 1.7, z: 3.15, rotY: ESQUINAS[0], alto: 0.95 },
  {
    esquina: 1,
    x: Math.sin(ESQUINAS[1]) * RADIO_DISPOSITIVOS,
    z: Math.cos(ESQUINAS[1]) * RADIO_DISPOSITIVOS,
    rotY: ESQUINAS[1],
    alto: 1.05,
  },
  // Planta: el sensor va montado en la última vid de la hilera, junto a su esquina
  { esquina: 2, x: -2.7, z: -2.4, rotY: ESQUINAS[2], alto: 1.45 },
  {
    esquina: 3,
    x: Math.sin(ESQUINAS[3]) * RADIO_DISPOSITIVOS,
    z: Math.cos(ESQUINAS[3]) * RADIO_DISPOSITIVOS,
    rotY: ESQUINAS[3],
    alto: 1.35,
  },
  // Análisis: la nube de Olive sobre el centro del campo
  { esquina: 0, x: 0, z: 0, rotY: 0, alto: 3.2 },
]
const INDICE_ANALISIS = 5
// Con Análisis activo la cámara se aleja: el análisis es la vista de todo el campo
const ZOOM_ANALISIS = 40
const BORDE_Y = -0.3

// Pseudo-aleatorio determinista: misma escena en cada render, sin problemas de hidratación.
function rand(x: number, z: number, salt = 0) {
  const s = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453
  return s - Math.floor(s)
}

function elegir<T>(opciones: readonly T[], r: number): T {
  return opciones[Math.floor(r * opciones.length) % opciones.length]
}

// Relieve suave y determinista; las facetas salen de la malla gruesa + flatShading
function altura(x: number, z: number) {
  return (
    0.18 * Math.sin(x * 0.55 + 1.7) * Math.cos(z * 0.48 + 0.6) +
    0.08 * Math.sin(x * 1.4 + z * 1.1 + 2.0) +
    0.06
  )
}

const PASTOS = ['#5d8a43', '#548140', '#66934a', '#4f7a3a', '#71a052', '#83a95c'] as const
const TIERRAS = ['#8a6a4a', '#7d5f42', '#93714e'] as const
const COPAS = ['#6b8f3f', '#78994a', '#5f8238'] as const

const PETROLEO = '#084d6e'
const AMBAR = '#fab500'
const TIERRA = '#84654a'

type PropsEscena = {
  moduloActivo: number
  reducedMotion: boolean
  voxels: boolean
  /** Callout (punto → línea → letrero) sobre el dispositivo activo. Apágalo si el
   *  contexto ya muestra nombre y descripción del módulo (ej. la sección de la home). */
  mostrarAviso?: boolean
  onSeleccionModulo?: (indice: number) => void
}

/* ---------- Terreno: malla low poly facetada, o grilla de voxels ---------- */

function Terreno({ voxels }: { voxels: boolean }) {
  // Columnas para el modo voxel; usan la misma función de altura que la malla
  const celdas = useMemo(() => {
    const lista = []
    for (let i = 0; i < LADO; i++) {
      for (let j = 0; j < LADO; j++) {
        const x = i - (LADO - 1) / 2
        const z = j - (LADO - 1) / 2
        lista.push({
          x,
          z,
          t: altura(x, z),
          pasto: elegir(PASTOS, rand(i, j, 1)),
          tierra: elegir(TIERRAS, rand(i, j, 2)),
        })
      }
    }
    return lista
  }, [])

  const geometria = useMemo(() => {
    const plano = new THREE.PlaneGeometry(LADO, LADO, 9, 9)
    plano.rotateX(-Math.PI / 2)

    const pos = plano.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const enBorde = Math.abs(x) >= LADO / 2 - 0.01 || Math.abs(z) >= LADO / 2 - 0.01
      pos.setY(i, enBorde ? BORDE_Y : altura(x, z))
    }

    // Sin índices para poder pintar cada triángulo de un tono distinto
    const geo = plano.toNonIndexed()
    const vertices = geo.attributes.position.count
    const colores = new Float32Array(vertices * 3)
    const color = new THREE.Color()
    for (let f = 0; f < vertices / 3; f++) {
      const r = rand(f, 0, 11)
      color.set(r < 0.06 ? TIERRA : elegir(PASTOS, rand(f, 1, 12)))
      for (let v = 0; v < 3; v++) {
        colores[(f * 3 + v) * 3] = color.r
        colores[(f * 3 + v) * 3 + 1] = color.g
        colores[(f * 3 + v) * 3 + 2] = color.b
      }
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colores, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  if (voxels) {
    return (
      <group>
        {celdas.map((c) => (
          <group key={`${c.x}:${c.z}`} position={[c.x, 0, c.z]}>
            <mesh position={[0, c.t - 0.175, 0]} castShadow receiveShadow>
              <boxGeometry args={[1, 0.35, 1]} />
              <meshStandardMaterial color={c.pasto} />
            </mesh>
            <mesh position={[0, (c.t - 2.15) / 2, 0]}>
              <boxGeometry args={[1, c.t + 1.45, 1]} />
              <meshStandardMaterial color={c.tierra} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  return (
    <group>
      <mesh geometry={geometria} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading />
      </mesh>
      {/* Base de tierra: prisma de 4 lados biselado hacia adentro */}
      <mesh position={[0, BORDE_Y - 0.75, 0]} rotation-y={Math.PI / 4}>
        <cylinderGeometry args={[5.66, 4.6, 1.5, 4, 1]} />
        <meshStandardMaterial color={TIERRA} flatShading />
      </mesh>
    </group>
  )
}

/* ---------- Viñedo: hileras de vides sobre espaldera ---------- */

const UVA = '#6d3b7e'
// La vid que lleva el sensor del módulo Planta: Vinedo no la genera,
// la dibuja SensorPlanta (más grande y con el sensor adosado)
const VID_SENSOR = { x: -2.7, z: -2.4 }

function Vinedo() {
  const hileras = useMemo(() => {
    // Más allá de |x| ≈ 3.1 la malla interpola hacia la caída del borde y
    // altura() deja de coincidir con la superficie real
    const mitad = 3.0
    // Dispositivos a esquivar (Planta no: es una vid de la propia hilera;
    // Análisis tampoco: la nube flota sobre el campo)
    const obstaculos = DISPOSICION.filter((_, i) => i !== 3 && i !== INDICE_ANALISIS)
    const lista = []
    for (let z = -2.4; z <= 2.4; z += 0.8) {
      const ya = altura(-mitad, z)
      const yb = altura(mitad, z)
      const vides = []
      for (let x = -mitad + 0.3; x <= mitad - 0.3; x += 0.55) {
        if (Math.abs(z - VID_SENSOR.z) < 0.01 && Math.abs(x - VID_SENSOR.x) < 0.01) continue
        if (obstaculos.some((o) => Math.hypot(x - o.x, z - o.z) < 0.8)) continue
        vides.push({
          x,
          y: altura(x, z),
          radio: 0.15 + rand(x, z, 6) * 0.06,
          copa: elegir(COPAS, rand(x, z, 7)),
          conUvas: rand(x, z, 8) > 0.55,
        })
      }
      lista.push({ z, mitad, ya, yb, vides })
    }
    return lista
  }, [])

  return (
    <group>
      {hileras.map((h) => (
        <group key={h.z}>
          {/* Postes de la espaldera */}
          {[-h.mitad, h.mitad].map((x, k) => (
            <mesh key={k} position={[x, (k === 0 ? h.ya : h.yb) + 0.22, h.z]} castShadow>
              <boxGeometry args={[0.06, 0.55, 0.06]} />
              <meshStandardMaterial color="#7a5230" flatShading />
            </mesh>
          ))}
          {/* Alambre entre postes, siguiendo la pendiente del terreno */}
          <mesh
            position={[0, (h.ya + h.yb) / 2 + 0.45, h.z]}
            rotation-z={Math.atan2(-2 * h.mitad, h.yb - h.ya)}
          >
            <cylinderGeometry
              args={[0.012, 0.012, Math.hypot(2 * h.mitad, h.yb - h.ya), 4]}
            />
            <meshStandardMaterial color="#4a4a4a" />
          </mesh>
          {/* Vides */}
          {h.vides.map((v, k) => (
            <group key={k} position={[v.x, v.y, h.z]}>
              {/* El tronco se entierra para asentarse en las facetas inclinadas */}
              <mesh position={[0, 0.08, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.045, 0.4, 5]} />
                <meshStandardMaterial color="#6e4a2b" flatShading />
              </mesh>
              <mesh position={[0, 0.4, 0]} scale={[1.15, 0.8, 0.7]} castShadow>
                <icosahedronGeometry args={[v.radio, 0]} />
                <meshStandardMaterial color={v.copa} flatShading />
              </mesh>
              {v.conUvas && (
                <mesh position={[0.07, 0.26, 0.09]}>
                  <icosahedronGeometry args={[0.045, 0]} />
                  <meshStandardMaterial color={UVA} flatShading />
                </mesh>
              )}
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

/* ---------- Líneas de riego: tubos entre hileras que gotean al regar ---------- */

function LineasRiego({ regando, animar }: { regando: boolean; animar: boolean }) {
  const gotas = useRef<(THREE.Mesh | null)[]>([])

  const lineas = useMemo(() => {
    const mitad = 3.0
    const lista = []
    let idx = 0
    // Entre las hileras (que están en z = -2.4 … 2.4 cada 0.8)
    for (let z = -2.0; z <= 2.05; z += 0.8) {
      const ya = altura(-mitad, z) + 0.14
      const yb = altura(mitad, z) + 0.14
      const drops = []
      for (let x = -2.6; x <= 2.65; x += 0.65) {
        const yTubo = ya + ((x + mitad) / (2 * mitad)) * (yb - ya)
        const ySuelo = altura(x, z) + 0.03
        drops.push({
          x,
          yTubo,
          caida: Math.max(0.08, yTubo - ySuelo),
          fase: rand(x, z, 13),
          idx: idx++,
        })
      }
      lista.push({ z, ya, yb, drops })
    }
    return lista
  }, [])

  useFrame(({ clock }) => {
    if (!regando) return
    lineas.forEach((linea) =>
      linea.drops.forEach((d) => {
        const gota = gotas.current[d.idx]
        if (!gota) return
        // Cada gota cae del tubo al suelo en bucle, con fase propia
        const p = animar ? (clock.elapsedTime * 0.9 + d.fase) % 1 : 0.5
        gota.position.y = d.yTubo - 0.02 - p * d.caida
        gota.scale.setScalar(1 - p * 0.35)
      })
    )
  })

  return (
    <group>
      {lineas.map((linea) => (
        <group key={linea.z}>
          <mesh
            position={[0, (linea.ya + linea.yb) / 2, linea.z]}
            rotation-z={Math.atan2(-6, linea.yb - linea.ya)}
          >
            <cylinderGeometry args={[0.022, 0.022, Math.hypot(6, linea.yb - linea.ya), 5]} />
            <meshStandardMaterial color={PETROLEO} flatShading />
          </mesh>
          {regando &&
            linea.drops.map((d) => (
              <mesh
                key={d.idx}
                position={[d.x, d.yTubo, linea.z]}
                ref={(m) => {
                  gotas.current[d.idx] = m
                }}
              >
                <icosahedronGeometry args={[0.03, 0]} />
                <meshStandardMaterial
                  color="#8fd6f2"
                  emissive="#8fd6f2"
                  emissiveIntensity={0.4}
                  flatShading
                />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  )
}

function Rocas() {
  const rocas = useMemo(
    () =>
      [
        [-3.3, 0.6],
        [2.9, -0.4],
        [0.3, 3.2],
        [-0.6, -3.2],
      ].map(([x, z], k) => ({ x, z, y: altura(x, z), radio: 0.09 + rand(x, z, 9) * 0.07, k })),
    []
  )
  return (
    <group>
      {rocas.map((r) => (
        <mesh key={r.k} position={[r.x, r.y + 0.04, r.z]} castShadow>
          <icosahedronGeometry args={[r.radio, 0]} />
          <meshStandardMaterial color="#9aa2a8" flatShading />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Dispositivos de los módulos ---------- */

function AnilloActivo() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.08, 0]}>
      <ringGeometry args={[0.42, 0.54, 32]} />
      <meshBasicMaterial color={AMBAR} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Punto + arcos que se encienden en secuencia, como transmitiendo datos
function SenalWifi({ animar }: { animar: boolean }) {
  const arcos = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  useFrame(({ clock }) => {
    const fase = animar ? Math.floor((clock.elapsedTime * 2.2) % 4) : 3
    arcos.current.forEach((material, k) => {
      if (material) material.opacity = k < fase ? 1 : 0.15
    })
  })
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.028, 0]} />
        <meshStandardMaterial color={AMBAR} emissive={AMBAR} emissiveIntensity={0.4} flatShading />
      </mesh>
      {[0.09, 0.16, 0.23].map((radio, k) => (
        <mesh key={k} rotation-z={Math.PI / 4}>
          <torusGeometry args={[radio, 0.018, 6, 12, Math.PI / 2]} />
          <meshStandardMaterial
            ref={(m) => {
              arcos.current[k] = m
            }}
            color={AMBAR}
            emissive={AMBAR}
            emissiveIntensity={0.4}
            transparent
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

function EquipoRiego({ activo, animar }: { activo: boolean; animar: boolean }) {
  return (
    <group>
      {activo && <AnilloActivo />}
      {/* Poste y caja cuadrada del controlador */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.5, 5]} />
        <meshStandardMaterial color="#8d949a" flatShading />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.34, 0.34, 0.16]} />
        <meshStandardMaterial color={PETROLEO} flatShading />
      </mesh>
      {/* Pantalla al frente */}
      <mesh position={[0, 0.52, 0.085]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial color={AMBAR} flatShading />
      </mesh>
      {/* Antena y señal wifi */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.16, 4]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <group position={[0, 0.88, 0]}>
        <SenalWifi animar={animar} />
      </group>
    </group>
  )
}

function Pozo({ activo }: { activo: boolean }) {
  return (
    <group>
      {activo && <AnilloActivo />}
      {/* Cuerpo de piedra */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.31, 0.28, 6]} />
        <meshStandardMaterial color="#a8a29a" flatShading />
      </mesh>
      {/* Agua */}
      <mesh position={[0, 0.285, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 6]} />
        <meshStandardMaterial
          color="#2e86ad"
          emissive="#2e86ad"
          emissiveIntensity={0.25}
          flatShading
        />
      </mesh>
      {/* Postes */}
      {[-0.26, 0.26].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
          <meshStandardMaterial color="#7a5230" flatShading />
        </mesh>
      ))}
      {/* Travesaño, cuerda y balde */}
      <mesh position={[0, 0.68, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.56, 5]} />
        <meshStandardMaterial color="#6e4a2b" flatShading />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.26, 4]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.08, 6]} />
        <meshStandardMaterial color={PETROLEO} flatShading />
      </mesh>
    </group>
  )
}

// Tubería a ras de suelo: el pozo alimenta al dispositivo de riego
function Tuberia() {
  const riego = DISPOSICION[0]
  const pozo = DISPOSICION[1]
  const dx = riego.x - pozo.x
  const dz = riego.z - pozo.z
  const largo = Math.hypot(dx, dz)
  const mx = (riego.x + pozo.x) / 2
  const mz = (riego.z + pozo.z) / 2
  return (
    <group position={[mx, altura(mx, mz) + 0.06, mz]} rotation-y={Math.atan2(dx, dz)}>
      <mesh rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.035, 0.035, largo, 6]} />
        <meshStandardMaterial color={PETROLEO} flatShading />
      </mesh>
    </group>
  )
}

function SensorSuelo({ activo }: { activo: boolean }) {
  return (
    <group>
      {activo && <AnilloActivo />}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.65, 5]} />
        <meshStandardMaterial color="#b0895e" flatShading />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.26, 0.18, 0.12]} />
        <meshStandardMaterial color={AMBAR} flatShading />
      </mesh>
      <mesh position={[0.08, 0.66, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.18, 4]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
    </group>
  )
}

function SensorPlanta({ activo, animar }: { activo: boolean; animar: boolean }) {
  return (
    <group>
      {activo && <AnilloActivo />}
      {/* Señal de datos sobre el árbol */}
      <group position={[0, 0.85, 0]}>
        <SenalWifi animar={animar} />
      </group>
      {/* Una vid de la hilera, algo más grande que sus vecinas */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.065, 0.5, 5]} />
        <meshStandardMaterial color="#6e4a2b" flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0]} scale={[1.15, 0.8, 0.75]} castShadow>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color="#6b8f3f" flatShading />
      </mesh>
      {/* Racimos */}
      <mesh position={[0.1, 0.32, 0.1]}>
        <icosahedronGeometry args={[0.055, 0]} />
        <meshStandardMaterial color={UVA} flatShading />
      </mesh>
      <mesh position={[-0.12, 0.34, 0.06]}>
        <icosahedronGeometry args={[0.045, 0]} />
        <meshStandardMaterial color={UVA} flatShading />
      </mesh>
      {/* Sensor adosado al tronco */}
      <mesh position={[0.1, 0.22, 0]} castShadow>
        <boxGeometry args={[0.11, 0.16, 0.07]} />
        <meshStandardMaterial color={PETROLEO} flatShading />
      </mesh>
      <mesh position={[0.1, 0.36, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 4]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
    </group>
  )
}

function EstacionClima({ activo, girar }: { activo: boolean; girar: boolean }) {
  const anemometro = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (girar && anemometro.current) anemometro.current.rotation.y += dt * 2.2
  })
  return (
    <group>
      {activo && <AnilloActivo />}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 1, 6]} />
        <meshStandardMaterial color="#c8ccd0" flatShading />
      </mesh>
      {/* Anemómetro de cazoletas */}
      <group ref={anemometro} position={[0, 0.84, 0]}>
        {[0, 1, 2].map((k) => (
          <group key={k} rotation-y={(k * Math.PI * 2) / 3}>
            <mesh position={[0.11, 0, 0]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.012, 0.012, 0.22, 4]} />
              <meshStandardMaterial color="#8d949a" flatShading />
            </mesh>
            <mesh position={[0.22, 0, 0]}>
              <icosahedronGeometry args={[0.045, 0]} />
              <meshStandardMaterial color={PETROLEO} flatShading />
            </mesh>
          </group>
        ))}
      </group>
      {/* Panel solar */}
      <mesh position={[0.14, 0.5, 0]} rotation-x={-0.9} castShadow>
        <boxGeometry args={[0.22, 0.02, 0.16]} />
        <meshStandardMaterial color="#16324a" flatShading />
      </mesh>
      {/* Pluviómetro */}
      <mesh position={[-0.14, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.14, 6]} />
        <meshStandardMaterial color="#e8eaec" flatShading />
      </mesh>
    </group>
  )
}

/* ---------- Olive: nube sobre el campo, datos que suben y paneles ---------- */

function PanelDatos({
  position,
  barras,
}: {
  position: [number, number, number]
  barras: number[]
}) {
  return (
    <group position={position} rotation-y={FRENTE}>
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.5, 0.05]} />
        <meshStandardMaterial color="#f7f8f9" flatShading />
      </mesh>
      {/* Encabezado del panel */}
      <mesh position={[0, 0.19, 0.03]}>
        <boxGeometry args={[0.6, 0.05, 0.02]} />
        <meshStandardMaterial color={AMBAR} flatShading />
      </mesh>
      {/* Mini gráfico de barras */}
      {barras.map((h, k) => (
        <mesh key={k} position={[-0.18 + k * 0.18, -0.16 + h / 2, 0.035]}>
          <boxGeometry args={[0.1, h, 0.02]} />
          <meshStandardMaterial color={PETROLEO} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function NubeOlive({ activo, animar }: { activo: boolean; animar: boolean }) {
  const nube = useRef<THREE.Group>(null)
  const paneles = useRef<THREE.Group>(null)
  const datos = useRef<(THREE.Mesh | null)[]>([])

  // Puntos de partida de los datos: la punta de cada dispositivo, llevada al
  // marco local de este grupo (origen en el centro del campo, escala 1.3)
  const pulsos = useMemo(() => {
    const origenY = altura(0, 0) + 0.02
    const lista: { desde: THREE.Vector3; fase: number }[] = []
    DISPOSICION.slice(0, INDICE_ANALISIS).forEach((d, i) => {
      const desde = new THREE.Vector3(
        d.x / 1.3,
        (altura(d.x, d.z) + d.alto * 0.7 - origenY) / 1.3,
        d.z / 1.3
      )
      for (let k = 0; k < 2; k++) lista.push({ desde, fase: rand(i, k, 21) })
    })
    return lista
  }, [])

  const haciaNube = useMemo(() => new THREE.Vector3(0, 1.55, 0), [])

  useFrame(({ clock }, dt) => {
    // La nube respira levemente
    if (nube.current && animar) {
      nube.current.position.y = 1.9 + Math.sin(clock.elapsedTime * 0.9) * 0.06
    }
    // Los paneles se despliegan al activar el módulo
    if (paneles.current) {
      const escala = THREE.MathUtils.damp(
        paneles.current.scale.x,
        activo ? 1 : 0.001,
        animar ? 6 : 100,
        dt
      )
      paneles.current.scale.setScalar(escala)
    }
    // Datos subiendo de los dispositivos a la nube
    if (activo) {
      pulsos.forEach((pulso, k) => {
        const dato = datos.current[k]
        if (!dato) return
        const p = animar ? (clock.elapsedTime * 0.4 + pulso.fase) % 1 : pulso.fase
        dato.position.lerpVectors(pulso.desde, haciaNube, p)
        dato.position.y += Math.sin(p * Math.PI) * 0.25
        dato.scale.setScalar(1 - p * 0.4)
      })
    }
  })

  return (
    <group>
      <group ref={nube} position={[0, 1.9, 0]}>
        {/* Nube low poly: racimo de icosaedros */}
        {[
          [0, 0, 0, 0.55],
          [0.55, -0.05, 0.15, 0.4],
          [-0.55, 0, 0.1, 0.42],
          [0.25, 0.18, -0.15, 0.38],
          [-0.28, 0.15, -0.1, 0.35],
        ].map(([x, y, z, radio], k) => (
          <mesh key={k} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[radio, 0]} />
            <meshStandardMaterial color="#f4f6f8" flatShading />
          </mesh>
        ))}
        {/* Paneles personalizados, desplegados a los costados */}
        <group ref={paneles} scale={0.001}>
          <PanelDatos position={[-1.15, -0.45, 1.15]} barras={[0.12, 0.22, 0.16]} />
          <PanelDatos position={[1.15, -0.3, -1.15]} barras={[0.2, 0.12, 0.26]} />
        </group>
      </group>
      {/* Datos viajando hacia la nube */}
      {activo &&
        pulsos.map((pulso, k) => (
          <mesh
            key={k}
            position={pulso.desde}
            ref={(m) => {
              datos.current[k] = m
            }}
          >
            <icosahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial
              color={AMBAR}
              emissive={AMBAR}
              emissiveIntensity={0.5}
              flatShading
            />
          </mesh>
        ))}
    </group>
  )
}

/* ---------- Rotación del bloque ---------- */

function BloqueRotatorio({
  esquina,
  zoomCerca,
  reducedMotion,
  children,
}: {
  esquina: number
  zoomCerca: number
  reducedMotion: boolean
  children: React.ReactNode
}) {
  const grupo = useRef<THREE.Group>(null)
  const angulo = useRef(0)

  useFrame((estado, dt) => {
    if (!grupo.current) return
    // La esquina i está en FRENTE + i·90°; para dejarla mirando a la cámara
    // (azimut FRENTE), el bloque descansa en múltiplos de 90°: punta al frente.
    const objetivo = -esquina * (Math.PI / 2)
    let delta = objetivo - angulo.current
    // Camino corto: girar 90° hacia adelante, no 270° hacia atrás
    delta = Math.atan2(Math.sin(delta), Math.cos(delta))
    angulo.current = reducedMotion
      ? angulo.current + delta
      : angulo.current + delta * (1 - Math.exp(-dt * 4.5))
    grupo.current.rotation.y = angulo.current

    // Dolly: mientras gira, la cámara se aleja; al llegar al módulo, se acerca.
    // El factor adapta los zooms (calibrados a 780×520) al tamaño real del contenedor,
    // con margen extra para que el bloque no toque los límites del componente.
    const factor = Math.min(estado.size.width / 850, estado.size.height / 570)
    const camara = estado.camera as THREE.OrthographicCamera
    const zoomObjetivo = (Math.abs(delta) > 0.12 ? ZOOM_LEJOS : zoomCerca) * factor
    const zoomNuevo = reducedMotion
      ? zoomObjetivo
      : THREE.MathUtils.damp(camara.zoom, zoomObjetivo, 3.5, dt)
    if (Math.abs(zoomNuevo - camara.zoom) > 0.001) {
      camara.zoom = zoomNuevo
      camara.updateProjectionMatrix()
    }
  })

  return <group ref={grupo}>{children}</group>
}

/* ---------- Escena completa ---------- */

export default function EscenaBloque({
  moduloActivo,
  reducedMotion,
  voxels,
  mostrarAviso = true,
  onSeleccionModulo,
}: PropsEscena) {
  // En el mismo orden que MODULOS y DISPOSICION
  const dispositivos = [
    (activo: boolean) => <EquipoRiego activo={activo} animar={!reducedMotion} />,
    (activo: boolean) => <Pozo activo={activo} />,
    (activo: boolean) => <SensorSuelo activo={activo} />,
    (activo: boolean) => <SensorPlanta activo={activo} animar={!reducedMotion} />,
    (activo: boolean) => <EstacionClima activo={activo} girar={!reducedMotion} />,
    (activo: boolean) => <NubeOlive activo={activo} animar={!reducedMotion} />,
  ]

  return (
    <Canvas
      orthographic
      // "percentage" = PCFShadowMap: es lo que three usa igualmente al degradar el
      // PCFSoft deprecado, pero declararlo evita el warning en cada frame
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [10, 10, 10], zoom: 52, near: 0.1, far: 60 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.4, 0)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.3}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <BloqueRotatorio
        esquina={DISPOSICION[moduloActivo].esquina}
        zoomCerca={moduloActivo === INDICE_ANALISIS ? ZOOM_ANALISIS : ZOOM_CERCA}
        reducedMotion={reducedMotion}
      >
        <Terreno voxels={voxels} />
        <Vinedo />
        <LineasRiego regando={moduloActivo <= 1} animar={!reducedMotion} />
        <Rocas />
        <Tuberia />
        {DISPOSICION.map((p, i) => (
          <group
            key={i}
            position={[p.x, altura(p.x, p.z) + 0.02, p.z]}
            rotation-y={p.rotY}
            scale={1.3}
            onClick={(e) => {
              e.stopPropagation()
              onSeleccionModulo?.(i)
            }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            {dispositivos[i](moduloActivo === i)}
          </group>
        ))}

        {/* Aviso tipo callout: punto en el dispositivo → línea que se dibuja → letrero */}
        {mostrarAviso && (
        <Html
          key={moduloActivo}
          position={[
            DISPOSICION[moduloActivo].x,
            altura(DISPOSICION[moduloActivo].x, DISPOSICION[moduloActivo].z) +
              DISPOSICION[moduloActivo].alto,
            DISPOSICION[moduloActivo].z,
          ]}
          center
          wrapperClass="pointer-events-none"
        >
          <div className="relative flex -translate-y-full flex-col items-center">
            <div className={'h-14 w-px bg-[#fab500]' + (reducedMotion ? '' : ' linea-aviso')} />
            <div className="h-1.5 w-1.5 -translate-y-px rounded-full bg-[#fab500]" />
            {/* Letrero al costado del extremo superior de la línea */}
            <div className="absolute left-2.5 top-0 w-56 -translate-y-1/2">
              <div
                aria-live="polite"
                className={
                  'rounded-2xl border border-white/20 bg-slate-900/35 px-4 py-3 shadow-lg backdrop-blur-md' +
                  (reducedMotion ? '' : ' tarjeta-aviso')
                }
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-6 w-6 items-center justify-center" aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={MODULOS[moduloActivo].icono}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </span>
                  {MODULOS[moduloActivo].nombre}
                </p>
                <p className="mt-0.5 text-sm text-white/80">
                  {MODULOS[moduloActivo].dispositivo}
                </p>
              </div>
            </div>
            {!reducedMotion && (
              <style>{`
                @keyframes crecerLinea {
                  from { transform: scaleY(0); }
                  to { transform: scaleY(1); }
                }
                .linea-aviso {
                  transform-origin: bottom;
                  animation: crecerLinea 0.25s ease-out 0.45s backwards;
                }
                @keyframes aparecerTarjeta {
                  from { opacity: 0; transform: translateX(-8px); }
                  to { opacity: 1; transform: none; }
                }
                .tarjeta-aviso {
                  animation: aparecerTarjeta 0.3s ease-out 0.7s backwards;
                }
              `}</style>
            )}
          </div>
        </Html>
        )}
      </BloqueRotatorio>

      <ContactShadows position={[0, -2.0, 0]} opacity={0.35} scale={15} blur={2.4} far={4.5} />
    </Canvas>
  )
}

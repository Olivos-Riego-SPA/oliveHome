# OliveHome — Instrucciones para Claude

## Proyecto
**OliveHome** es el sitio público (landing) de Olive. Es la vitrina de cara al usuario: presenta qué es Olive, sus módulos/features y una sección de tutoriales. No es una app de datos ni tiene backend propio — su objetivo es comunicar y convertir. La app de datos es **OlivePlus** y su backoffice es **OliveScan**.

## Vault de documentación
La documentación vive en la variable de entorno `OLIVE_VAULT`. **Antes de acceder a cualquier archivo del vault, resuelve la ruta ejecutando `echo $OLIVE_VAULT` en la terminal y usa el resultado como ruta base.**
- Ruta base de este proyecto: `$OLIVE_VAULT/OliveHome/`
- Contexto general: `$OLIVE_VAULT/OliveHome/_contexto.md`
- Arquitectura: `$OLIVE_VAULT/OliveHome/arquitectura.md`
- Secciones: `$OLIVE_VAULT/OliveHome/secciones/`
- Diseño: `$OLIVE_VAULT/OliveHome/diseño/`
- Changelog: `$OLIVE_VAULT/OliveHome/changelog/`
- Índice changelog: `$OLIVE_VAULT/OliveHome/changelog/index.md`
- Auditorías: `$OLIVE_VAULT/OliveHome/auditorias/`

> La carpeta `$OLIVE_VAULT/OliveHome/` aún no existe. Créala la primera vez que se documente algo, siguiendo el mismo molde de los proyectos hermanos (OlivePlus, OliveScan).

## Stack
- Next.js 16 + TypeScript (App Router)
- React 19
- UI: Tailwind CSS + shadcn/ui (`components/ui`)
- Animaciones: Framer Motion + CSS (`animations.css`)
- Carrusel: Embla (`embla-carousel-react` + autoplay)
- Iconos: lucide-react
- SEO: `sitemap.ts`, `robots.ts`, JSON-LD (`components/json_ld.tsx`)
- Sin backend propio / sin estado global — sitio principalmente estático.

## Estructura del sitio
Rutas (App Router):
- `app/page.tsx` — home (arma las secciones de la landing)
- `app/(pages)/tutoriales` — página de tutoriales
- `app/layout.tsx` — layout raíz + metadata global
- `app/globals.css` — estilos base

Secciones/componentes principales (`components/`):
- `site_header.tsx` — cabecera / navegación
- `que_olive.tsx`, `nosotros_section.tsx` — qué es Olive / nosotros
- `olive_features.tsx`, `olive_module.tsx`, `modules_tabs.tsx` — features y módulos
- `side_module_left.tsx`, `side_module_right.tsx` — bloques de módulo alternados
- `estrategias.tsx`, `bottom_section.tsx` — secciones de contenido
- `tutoriales_teaser.tsx` — teaser de tutoriales en la home
- `footer.tsx` — pie
- `json_ld.tsx` — datos estructurados (SEO)
- `ovalComponent.tsx`, `ui/` — componentes visuales reutilizables

Assets: `app/public/images/` (fondos `back*`, capturas `desktop*`, íconos `icon*`, logos).

## SEO
El sitio es público e indexable — el SEO es una responsabilidad de primer orden. Al tocar contenido o rutas, mantener consistente:
- **Metadata por página**: exporta `metadata` (o `generateMetadata`) en cada `page.tsx`/`layout.tsx` con `title`, `description` y Open Graph. No dejar páginas sin metadata.
- **Sitemap**: al agregar o quitar rutas, actualiza `app/sitemap.ts`.
- **Robots**: revisa `app/robots.ts` si cambian las reglas de indexación.
- **Datos estructurados**: mantén `components/json_ld.tsx` alineado con el contenido real (organización, producto, etc.).
- **Imágenes**: usa `next/image`, define `alt` descriptivo, y prefiere `webp` cuando aplique. Cuida el peso de los assets en `app/public/images/`.
- **Idioma/coherencia**: los textos son en español; mantén el `lang` y los títulos coherentes.

## Instrucciones para tareas comunes

### "Revisa el contexto de [sección]"
Lee el archivo correspondiente en `$OLIVE_VAULT/OliveHome/secciones/[seccion].md` antes de trabajar.

### "Documenta esto" / "Actualiza la sección [X]"
1. Actualiza `$OLIVE_VAULT/OliveHome/secciones/[seccion].md` — sección de funcionamiento técnico
2. Agrega una fila al historial de cambios del mismo archivo con fecha y motivo

### "Documenta en el changelog"
1. Determina la semana actual (formato `YYYY-WXX`)
2. Si el archivo `$OLIVE_VAULT/OliveHome/changelog/YYYY-WXX.md` no existe, créalo y agrégalo al índice en `$OLIVE_VAULT/OliveHome/changelog/index.md`
3. Agrega la entrada como una lista simple de cambios en lenguaje claro para el usuario final (sin dividir en secciones técnicas)

### "Agrégalo a tus notas" / "Déjalo en tus notas"
Agrega el tema pendiente al archivo `$OLIVE_VAULT/OliveHome/notas-claude.md`. Cada entrada debe incluir: sección/componente afectado, descripción del pendiente o idea, y referencia a los archivos relevantes.

## Convenciones
- Componentes en `snake_case.tsx` siguiendo el patrón existente del repo (`site_header.tsx`, `olive_features.tsx`).
- Estilos con utilidades Tailwind; usa `cn()` de `lib/utils.ts` para combinar clases.
- Preferir Server Components; marcar `"use client"` solo cuando se use estado, efectos o animaciones interactivas.
- Textos de UI en español.

# 🏗️ Plan de Infraestructura — Fullstack TypeScript + GitHub + Vercel

> **Arquitecto:** Plan generado para proyecto Fullstack TypeScript  
> **Stack:** Next.js 14 · TypeScript · JSON como base de datos · GitHub · Vercel  
> **Objetivo inicial:** Home con "Hola Mundo" animado para validar el pipeline completo

---

## 📐 1. Visión General de la Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        DEVELOPER                            │
│                   (Local → VS Code)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │  git push
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                        │
│         (Control de versiones + CI/CD trigger)              │
└──────────────────────┬──────────────────────────────────────┘
                       │  Auto-deploy (webhook)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL PLATFORM                          │
│      Build → TypeScript compile → Deploy → Edge CDN         │
└──────────────────────┬──────────────────────────────────────┘
                       │  Sirve la app
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APP (SSR/SSG)                     │
│  ┌─────────────────┐       ┌──────────────────────────┐    │
│  │   /app (Pages)  │◄─────►│  /data (JSON "Database") │    │
│  │   /components   │       │  *.json files            │    │
│  │   /lib (utils)  │       └──────────────────────────┘    │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ 2. Estructura del Repositorio

```
my-project/
│
├── 📁 app/                          # Next.js App Router
│   ├── layout.tsx                   # Root layout (fuentes, metadata global)
│   ├── page.tsx                     # Home → "Hola Mundo"
│   ├── globals.css                  # Estilos globales + variables CSS
│   └── 📁 api/                      # API Routes (server-side)
│       └── 📁 data/
│           └── route.ts             # Endpoint para leer archivos JSON
│
├── 📁 components/                   # Componentes reutilizables
│   ├── HolaMundo.tsx                # Componente principal animado
│   └── ui/                         # Componentes de UI base
│
├── 📁 data/                         # ⭐ "Base de datos" en JSON
│   ├── config.json                  # Configuración general de la app
│   ├── content.json                 # Contenido de las páginas
│   └── README.md                   # Documentación del esquema de datos
│
├── 📁 lib/                          # Utilidades TypeScript
│   ├── data-reader.ts               # Helper para leer archivos JSON
│   └── types.ts                     # Interfaces y tipos globales
│
├── 📁 public/                       # Assets estáticos
│   └── fonts/                      # Fuentes locales (si aplica)
│
├── .env.local                       # Variables de entorno (local, NO commitar)
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Archivos ignorados por git
├── next.config.ts                   # Configuración de Next.js
├── tsconfig.json                    # Configuración de TypeScript
├── tailwind.config.ts               # Configuración de Tailwind CSS
├── package.json                     # Dependencias y scripts
└── vercel.json                      # Configuración de Vercel (opcional)
```

---

## 📦 3. Stack Tecnológico y Dependencias

### 3.1 Core del Proyecto

| Tecnología     | Versión           | Rol                                    |
| -------------- | ----------------- | -------------------------------------- |
| **Next.js**    | 14.x (App Router) | Framework fullstack principal          |
| **TypeScript** | 5.x               | Tipado estático — validación del stack |
| **React**      | 18.x              | UI layer                               |
| **Node.js**    | 20.x LTS          | Runtime (Vercel lo gestiona)           |

### 3.2 Estilos y Animaciones

| Librería                  | Rol                            |
| ------------------------- | ------------------------------ |
| **Tailwind CSS**          | Utilidades CSS rápidas         |
| **Framer Motion**         | Animaciones elegantes en React |
| **CSS Custom Properties** | Variables de tema globales     |

### 3.3 Herramientas de Desarrollo

| Herramienta     | Rol                            |
| --------------- | ------------------------------ |
| **ESLint**      | Linter de código TypeScript    |
| **Prettier**    | Formateo de código             |
| **Husky**       | Git hooks (pre-commit)         |
| **lint-staged** | Lint solo archivos modificados |

### 3.4 Instalación Inicial

```bash
# Crear el proyecto con Next.js + TypeScript
npx create-next-app@latest my-project \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd my-project

# Instalar dependencias adicionales
npm install framer-motion

# Herramientas de desarrollo
npm install -D eslint-config-prettier prettier husky lint-staged
```

---

## ⚙️ 4. Configuración de TypeScript

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModules": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

> ⚠️ **Nota clave:** `"resolveJsonModules": true` es obligatorio para importar archivos `.json` desde TypeScript directamente.

---

## 🗃️ 5. Capa de Datos — JSON como Base de Datos

### 5.1 Filosofía

Los archivos JSON en `/data` actúan como una base de datos de solo lectura en tiempo de build (SSG) o lectura dinámica en tiempo de servidor (SSR). No se exponen directamente al cliente.

### 5.2 Archivo base: `data/content.json`

```json
{
  "home": {
    "greeting": "Hola Mundo",
    "subtitle": "TypeScript · Next.js · Vercel",
    "version": "1.0.0"
  },
  "meta": {
    "title": "Mi Proyecto Fullstack",
    "description": "Validación del stack TypeScript"
  }
}
```

### 5.3 Archivo base: `data/config.json`

```json
{
  "app": {
    "name": "My TS Project",
    "theme": "dark",
    "language": "es"
  },
  "animation": {
    "enabled": true,
    "duration": 0.8,
    "easing": "easeInOut"
  }
}
```

### 5.4 Tipos TypeScript para los datos: `lib/types.ts`

```typescript
// Tipos estrictos que espeja la estructura JSON
export interface HomeContent {
  greeting: string;
  subtitle: string;
  version: string;
}

export interface MetaContent {
  title: string;
  description: string;
}

export interface SiteContent {
  home: HomeContent;
  meta: MetaContent;
}

export interface AppConfig {
  name: string;
  theme: "dark" | "light";
  language: string;
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
}

export interface SiteConfig {
  app: AppConfig;
  animation: AnimationConfig;
}
```

### 5.5 Helper de lectura de datos: `lib/data-reader.ts`

```typescript
import { readFileSync } from "fs";
import { join } from "path";
import type { SiteContent, SiteConfig } from "./types";

// Solo se ejecuta en el servidor — nunca en el cliente
const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = join(DATA_DIR, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getContent(): SiteContent {
  return readJson<SiteContent>("content.json");
}

export function getConfig(): SiteConfig {
  return readJson<SiteConfig>("config.json");
}
```

---

## 🎨 6. Implementación del Home — "Hola Mundo"

### 6.1 Componente animado: `components/HolaMundo.tsx`

```typescript
"use client";

import { motion } from "framer-motion";
import type { HomeContent } from "@/lib/types";

interface HolaMundoProps {
  content: HomeContent;
}

export default function HolaMundo({ content }: HolaMundoProps) {
  const letters = content.greeting.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.3 },
    },
  };

  const letterVariant = {
    hidden: { opacity: 0, y: 60, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  const subtitleVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.8 } },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      {/* Resplandor de fondo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Texto principal con animación letra por letra */}
      <motion.h1
        className="relative flex text-6xl font-bold tracking-tight text-white md:text-8xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            variants={letterVariant}
            className={letter === " " ? "mr-6" : ""}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtítulo con stack */}
      <motion.p
        className="mt-6 text-lg text-zinc-400 tracking-widest uppercase"
        variants={subtitleVariant}
        initial="hidden"
        animate="visible"
      >
        {content.subtitle}
      </motion.p>

      {/* Línea decorativa */}
      <motion.div
        className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      />
    </main>
  );
}
```

### 6.2 Página principal: `app/page.tsx`

```typescript
import { getContent } from "@/lib/data-reader";
import HolaMundo from "@/components/HolaMundo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent();
  return {
    title: content.home.greeting,
    description: `v${content.home.version}`,
  };
}

export default function HomePage() {
  // Lectura de datos en el servidor — tipado completo con TypeScript
  const content = getContent();

  return <HolaMundo content={content.home} />;
}
```

---

## 🔌 7. API Route — Datos desde el Servidor

### `app/api/data/route.ts`

```typescript
import { NextResponse } from "next/server";
import { getContent, getConfig } from "@/lib/data-reader";

// GET /api/data — expone datos de forma controlada
export async function GET() {
  try {
    const content = getContent();
    const config = getConfig();

    return NextResponse.json({ content, config }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al leer los datos" },
      { status: 500 }
    );
  }
}
```

---

## 🐙 8. Configuración de GitHub

### 8.1 `.gitignore`

```gitignore
# Dependencias
node_modules/
.pnp/
.pnp.js

# Build
.next/
out/
dist/

# Variables de entorno (NUNCA commitear)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# OS
.DS_Store
Thumbs.db
```

### 8.2 `.env.example` (sí se commitea como plantilla)

```env
# Copia este archivo como .env.local y completa los valores
NEXT_PUBLIC_APP_NAME="Mi Proyecto"
NEXT_PUBLIC_ENV="development"
```

### 8.3 Flujo de Branches

```
main          ← Producción (auto-deploy a Vercel)
  └── develop ← Integración
        └── feature/nombre-feature ← Desarrollo activo
```

> **Regla:** Nunca hacer push directo a `main`. Siempre usar Pull Requests.

---

## 🚀 9. Configuración de Vercel

### 9.1 Vinculación del Repositorio

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar el repositorio de GitHub
3. Vercel detecta Next.js automáticamente
4. Configurar:
   - **Framework Preset:** Next.js
   - **Root Directory:** `/` (raíz del repo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (automático)
   - **Install Command:** `npm install`

### 9.2 Configuración de Ramas

| Branch      | Ambiente   | URL                                          |
| ----------- | ---------- | -------------------------------------------- |
| `main`      | Production | `https://mi-proyecto.vercel.app`             |
| `develop`   | Preview    | `https://mi-proyecto-git-develop.vercel.app` |
| `feature/*` | Preview    | Auto-generada por Vercel                     |

### 9.3 `vercel.json` (opcional, control fino)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["gru1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    }
  ]
}
```

> `"regions": ["gru1"]` apunta al datacenter de **São Paulo** (el más cercano desde Colombia).

---

## 📋 10. Scripts del Proyecto — `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run build"
  }
}
```

---

## ✅ 11. Checklist de Implementación

### Fase 1 — Setup Local

- [ ] Crear proyecto con `create-next-app` (flags detallados en sección 3.4)
- [ ] Instalar dependencias adicionales (`framer-motion`)
- [ ] Configurar `tsconfig.json` con `resolveJsonModules: true`
- [ ] Crear carpeta `/data` con `content.json` y `config.json`
- [ ] Implementar `lib/types.ts` con interfaces TypeScript
- [ ] Implementar `lib/data-reader.ts` con helpers de lectura
- [ ] Crear componente `HolaMundo.tsx` con animaciones
- [ ] Actualizar `app/page.tsx` para consumir datos del JSON
- [ ] Crear API route en `app/api/data/route.ts`
- [ ] Verificar con `npm run dev` en `localhost:3000`
- [ ] Ejecutar `npm run type-check` — debe pasar sin errores

### Fase 2 — GitHub

- [ ] Inicializar repositorio: `git init`
- [ ] Agregar `.gitignore`
- [ ] Primer commit: `git commit -m "feat: initial project setup"`
- [ ] Crear repositorio en GitHub (público o privado)
- [ ] Pushear: `git push origin main`

### Fase 3 — Vercel

- [ ] Conectar repositorio en el dashboard de Vercel
- [ ] Verificar que el build pasa correctamente
- [ ] Confirmar que la URL de producción muestra "Hola Mundo"
- [ ] Validar que el efecto de animación funciona en producción
- [ ] Revisar los logs de build en Vercel (sin errores de TypeScript)

### Fase 4 — Validación del Pipeline

- [ ] Hacer un cambio en `data/content.json` (ej: cambiar el subtitle)
- [ ] Commitear y pushear a `main`
- [ ] Verificar que Vercel despliega automáticamente
- [ ] Confirmar que el cambio se refleja en producción

---

## 🔐 12. Consideraciones de Seguridad

| Aspecto                 | Implementación                                                    |
| ----------------------- | ----------------------------------------------------------------- |
| **Variables sensibles** | Solo en `.env.local`, nunca en el repo                            |
| **Archivos JSON**       | Solo accesibles desde el servidor (no expuestos como estáticos)   |
| **API Routes**          | Validar y sanitizar cualquier input futuro                        |
| **Dependencias**        | Usar `npm audit` regularmente                                     |
| **Vercel**              | Habilitar protección de preview deployments si el repo es privado |

---

## 📈 13. Escalabilidad del Sistema de Datos JSON

A medida que el proyecto crezca, la carpeta `/data` puede expandirse así:

```
data/
├── config.json          # Configuración global
├── content.json         # Contenido del home
├── products.json        # Catálogo de productos (futuro)
├── blog/
│   ├── posts.json       # Lista de posts
│   └── tags.json        # Etiquetas
└── users/
    └── team.json        # Perfiles del equipo
```

> **Límite natural:** Este sistema es ideal para contenido estático o semi-estático. Cuando se necesite escritura concurrente o consultas complejas, migrar a una base de datos como **PlanetScale**, **Supabase** o **MongoDB Atlas** (todas con tier gratuito y compatibles con Vercel).

---

## 🧭 14. Resumen Ejecutivo

```
FLUJO COMPLETO:
  Código local (TypeScript estricto)
    → git push a GitHub
      → Vercel detecta cambio (webhook automático)
        → Build: tsc + next build (valida tipos)
          → Deploy en Edge CDN global
            → Home renderiza "Hola Mundo" desde /data/content.json
              → Animación elegante valida el stack completo ✅
```

**El pipeline completo valida:**

- ✅ TypeScript compilando sin errores
- ✅ Next.js App Router funcionando (SSR + Client Components)
- ✅ Sistema de datos JSON siendo leído correctamente
- ✅ Integración GitHub → Vercel operativa
- ✅ Deploy automático en cada push

---

_Documento generado como plan de infraestructura inicial — versión 1.0.0_

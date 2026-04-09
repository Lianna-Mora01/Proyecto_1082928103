# 🚀 Plan de Implementación por Fases

## Proyecto Fullstack TypeScript · Next.js · GitHub · Vercel

> **Documento:** Plan de implementación iterativa  
> **Basado en:** Infrastructure Plan v1.0.0  
> **Metodología:** Entrega incremental — cada fase es funcional y desplegable

---

## 📊 Resumen de Fases

| Fase  | Nombre                  | Duración estimada | Resultado entregable                |
| ----- | ----------------------- | ----------------- | ----------------------------------- |
| **0** | Prerrequisitos          | 1 hora            | Entorno listo para desarrollar      |
| **1** | Esqueleto del proyecto  | 2–3 horas         | Proyecto Next.js corriendo en local |
| **2** | Capa de datos JSON      | 1–2 horas         | Lectura tipada de archivos JSON     |
| **3** | Home — "Hola Mundo"     | 2–3 horas         | UI animada funcionando en local     |
| **4** | GitHub                  | 30 minutos        | Código en repositorio remoto        |
| **5** | Vercel · Deploy         | 1 hora            | App live en producción              |
| **6** | Validación del pipeline | 30 minutos        | CI/CD automático comprobado         |
| **7** | Calidad y cierre        | 1 hora            | Código limpio y documentado         |

**Tiempo total estimado: 9–12 horas**

---

## 🔵 FASE 0 — Prerrequisitos

> **Objetivo:** Tener el entorno de desarrollo completamente listo antes de tocar código.

### 0.1 Software requerido

Verificar que tienes instalado lo siguiente. Ejecuta cada comando en tu terminal:

```bash
# Node.js — debe ser v20 LTS o superior
node --version
# Esperado: v20.x.x

# npm — viene con Node.js
npm --version
# Esperado: 10.x.x o superior

# Git
git --version
# Esperado: git version 2.x.x
```

Si algo no está instalado:

- **Node.js:** Descargar desde [nodejs.org](https://nodejs.org) (seleccionar versión LTS)
- **Git:** Descargar desde [git-scm.com](https://git-scm.com)

### 0.2 Cuentas necesarias

- [ ] **GitHub:** Cuenta activa en [github.com](https://github.com)
- [ ] **Vercel:** Cuenta activa en [vercel.com](https://vercel.com) — conectada con tu cuenta de GitHub

### 0.3 VS Code — Extensiones recomendadas

Instalar desde el Marketplace de VS Code:

| Extensión                 | ID                                    | Para qué sirve              |
| ------------------------- | ------------------------------------- | --------------------------- |
| ESLint                    | `dbaeumer.vscode-eslint`              | Errores en tiempo real      |
| Prettier                  | `esbenp.prettier-vscode`              | Formateo automático         |
| TypeScript Hero           | `ms-vscode.vscode-typescript-next`    | Soporte TS avanzado         |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss`           | Autocompletado de clases    |
| GitLens                   | `eamodio.gitlens`                     | Control de versiones visual |
| Markdown Preview Enhanced | `shd101wyy.markdown-preview-enhanced` | Ver este archivo formateado |

### ✅ Criterio de salida Fase 0

- `node --version` y `git --version` responden correctamente
- Cuentas de GitHub y Vercel activas y vinculadas
- VS Code con extensiones instaladas

---

## 🟢 FASE 1 — Esqueleto del Proyecto

> **Objetivo:** Crear la estructura base del proyecto y verificar que Next.js + TypeScript funcionan juntos.

### 1.1 Crear el proyecto

Abrir la terminal en la carpeta donde quieres trabajar y ejecutar:

```bash
npx create-next-app@latest my-project \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-git
```

> El flag `--no-git` evita que `create-next-app` inicialice git — lo haremos manualmente en la Fase 4.

Cuando el comando termine:

```bash
cd my-project
```

### 1.2 Instalar dependencias adicionales

```bash
# Animaciones elegantes
npm install framer-motion

# Herramientas de calidad de código
npm install -D prettier eslint-config-prettier
```

### 1.3 Verificar la instalación

```bash
npm run dev
```

Abrir el navegador en `http://localhost:3000`. Debe aparecer la página de bienvenida de Next.js.

Luego verificar que TypeScript compila sin errores:

```bash
# En otra terminal (dejar npm run dev corriendo)
npm run build
```

El build debe completarse sin errores de TypeScript.

### 1.4 Limpiar el boilerplate

Eliminar el contenido que no usaremos:

```bash
# Vaciar el contenido del home (lo reemplazaremos en Fase 3)
# Abrir app/page.tsx y reemplazar todo el contenido con:
```

```typescript
// app/page.tsx — limpio, listo para Fase 3
export default function HomePage() {
  return (
    <main>
      <p>Fase 1 completa — próximamente Hola Mundo</p>
    </main>
  );
}
```

También limpiar `app/globals.css` — dejar solo las directivas de Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ✅ Criterio de salida Fase 1

- `npm run dev` corre sin errores
- `npm run build` compila sin errores de TypeScript
- Estructura de carpetas de Next.js visible en VS Code

---

## 🟡 FASE 2 — Capa de Datos JSON

> **Objetivo:** Crear el sistema de datos basado en archivos JSON con tipado completo en TypeScript.

### 2.1 Crear la carpeta de datos

En la raíz del proyecto (al mismo nivel que `/app`):

```bash
mkdir data
```

### 2.2 Crear `data/content.json`

```json
{
  "home": {
    "greeting": "Hola Mundo",
    "subtitle": "TypeScript · Next.js · Vercel",
    "version": "1.0.0"
  },
  "meta": {
    "title": "Mi Proyecto Fullstack",
    "description": "Stack TypeScript validado y funcionando"
  }
}
```

### 2.3 Crear `data/config.json`

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

### 2.4 Crear `data/README.md`

```markdown
# /data — Base de datos en JSON

Esta carpeta contiene los archivos JSON que actúan como base de datos del proyecto.

## Archivos

| Archivo        | Descripción                                |
| -------------- | ------------------------------------------ |
| `content.json` | Contenido de las páginas (textos, títulos) |
| `config.json`  | Configuración global de la aplicación      |

## Reglas

- **Solo lectura:** estos archivos se leen en el servidor, nunca se escriben desde el cliente.
- **Tipado:** toda la estructura está definida en `/lib/types.ts`.
- **No exponer directamente:** acceder siempre a través de `/lib/data-reader.ts`.
```

### 2.5 Crear `lib/types.ts`

```bash
mkdir lib
```

```typescript
// lib/types.ts

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

### 2.6 Crear `lib/data-reader.ts`

```typescript
// lib/data-reader.ts
import { readFileSync } from "fs";
import { join } from "path";
import type { SiteContent, SiteConfig } from "./types";

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

### 2.7 Verificar tipado

```bash
npx tsc --noEmit
```

No debe haber errores. Si aparece un error sobre `resolveJsonModules`, verificar que `tsconfig.json` tenga:

```json
"resolveJsonModules": true
```

### 2.8 Crear la API Route

Crear el archivo `app/api/data/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getContent, getConfig } from "@/lib/data-reader";

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

Verificar en el navegador: `http://localhost:3000/api/data`

Debe responder con el JSON de los dos archivos combinados.

### ✅ Criterio de salida Fase 2

- `http://localhost:3000/api/data` responde con el JSON correcto
- `npx tsc --noEmit` pasa sin errores
- Los tipos están definidos y el helper funciona

---

## 🟠 FASE 3 — Home "Hola Mundo" con Efecto Elegante

> **Objetivo:** Construir la interfaz visual del Home consumiendo los datos JSON con animación profesional.

### 3.1 Crear la carpeta de componentes

```bash
mkdir components
```

### 3.2 Crear `components/HolaMundo.tsx`

```typescript
"use client";

import { motion } from "framer-motion";
import type { HomeContent } from "@/lib/types";

interface HolaMundoProps {
  content: HomeContent;
}

export default function HolaMundo({ content }: HolaMundoProps) {
  const letters = content.greeting.split("");

  const containerVariants = {
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.2, duration: 0.8 },
    },
  };

  const lineVariant = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { delay: 1.6, duration: 0.8 },
    },
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 overflow-hidden">

      {/* Resplandor de fondo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Puntos decorativos de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Título animado letra por letra */}
      <motion.h1
        className="relative flex flex-wrap justify-center text-6xl font-bold tracking-tight text-white md:text-8xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ perspective: "800px" }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            variants={letterVariant}
            style={{ display: "inline-block" }}
            className={letter === " " ? "mx-3" : ""}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Línea divisora animada */}
      <motion.div
        className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        variants={lineVariant}
        initial="hidden"
        animate="visible"
      />

      {/* Subtítulo */}
      <motion.p
        className="mt-6 text-sm font-medium tracking-widest text-zinc-400 uppercase"
        variants={subtitleVariant}
        initial="hidden"
        animate="visible"
      >
        {content.subtitle}
      </motion.p>

      {/* Badge de versión */}
      <motion.span
        className="mt-10 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-xs text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        v{content.version}
      </motion.span>
    </main>
  );
}
```

### 3.3 Actualizar `app/page.tsx`

```typescript
import { getContent } from "@/lib/data-reader";
import HolaMundo from "@/components/HolaMundo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent();
  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default function HomePage() {
  const content = getContent();
  return <HolaMundo content={content.home} />;
}
```

### 3.4 Verificar visualmente

```bash
npm run dev
```

Abrir `http://localhost:3000` y confirmar:

- [ ] Fondo oscuro con patrón de puntos
- [ ] Letras de "Hola Mundo" aparecen una a una con efecto 3D
- [ ] Línea indigo aparece con fade
- [ ] Subtítulo aparece suavemente
- [ ] Badge de versión aparece al final

### 3.5 Verificar build final

```bash
npm run build
```

El output debe mostrar:

```
✓ Compiled successfully
✓ Linting and checking validity of types
```

### ✅ Criterio de salida Fase 3

- Home visual funcionando en `localhost:3000`
- Animaciones ejecutándose correctamente
- `npm run build` sin errores de TypeScript ni de compilación

---

## 🔵 FASE 4 — GitHub

> **Objetivo:** Subir el proyecto al repositorio de GitHub.

### 4.1 Crear `.gitignore`

En la raíz del proyecto, verificar que `.gitignore` existe (create-next-app lo crea automáticamente). Confirmar que incluye estas líneas:

```gitignore
node_modules/
.next/
.env
.env.local
.env*.local
.vercel
```

### 4.2 Crear `.env.example`

```env
# Copia este archivo como .env.local y completa los valores reales
NEXT_PUBLIC_APP_NAME="Mi Proyecto Fullstack"
NEXT_PUBLIC_ENV="development"
```

### 4.3 Inicializar Git y primer commit

```bash
# Inicializar el repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: initial project setup - TypeScript + Next.js + JSON data layer"
```

### 4.4 Crear el repositorio en GitHub

1. Ir a [github.com/new](https://github.com/new)
2. **Repository name:** `my-project` (o el nombre que prefieras)
3. **Visibility:** Public o Private (tu elección)
4. **NO marcar** "Add a README file" ni ninguna otra opción
5. Clic en **"Create repository"**

### 4.5 Conectar y pushear

GitHub mostrará los comandos exactos. Ejecutar:

```bash
git remote add origin https://github.com/TU_USUARIO/my-project.git
git branch -M main
git push -u origin main
```

### 4.6 Verificar en GitHub

Ir a `https://github.com/TU_USUARIO/my-project` y confirmar que todos los archivos están presentes, incluyendo la carpeta `/data`.

### ✅ Criterio de salida Fase 4

- Repositorio visible en GitHub con todos los archivos
- La carpeta `/data` con los JSON está en el repo
- `.env.local` NO aparece en el repositorio (lo protege el `.gitignore`)

---

## 🟣 FASE 5 — Vercel · Deploy a Producción

> **Objetivo:** Conectar el repositorio con Vercel y hacer el primer deploy.

### 5.1 Importar el proyecto en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. En la lista de repositorios de GitHub, buscar `my-project`
3. Clic en **"Import"**

### 5.2 Configurar el proyecto

En la pantalla de configuración de Vercel:

| Campo                | Valor                               |
| -------------------- | ----------------------------------- |
| **Framework Preset** | Next.js (detectado automáticamente) |
| **Root Directory**   | `.` (dejar en blanco)               |
| **Build Command**    | `npm run build`                     |
| **Output Directory** | Dejar vacío (Next.js lo maneja)     |
| **Install Command**  | `npm install`                       |

En la sección **Environment Variables**, agregar si tienes variables en `.env.example`:

```
NEXT_PUBLIC_APP_NAME = Mi Proyecto Fullstack
NEXT_PUBLIC_ENV = production
```

### 5.3 Hacer el deploy

Clic en **"Deploy"**.

Vercel ejecutará:

1. `npm install` — instala dependencias
2. `npm run build` — compila TypeScript y genera el build de Next.js
3. Deploy a la red CDN global

El proceso toma aproximadamente 1–2 minutos.

### 5.4 Verificar el deploy

Una vez que Vercel muestre "Congratulations!", clic en **"Visit"** o en la URL generada:

```
https://my-project-[hash].vercel.app
```

Confirmar:

- [ ] La página carga correctamente
- [ ] El efecto de animación funciona igual que en local
- [ ] El badge de versión muestra `v1.0.0`

### 5.5 Configurar dominio de producción (opcional)

En el dashboard de Vercel → tu proyecto → **Settings → Domains**:

Se puede agregar un dominio personalizado aquí en el futuro.

### ✅ Criterio de salida Fase 5

- URL de Vercel accesible públicamente
- Animación de "Hola Mundo" funcionando en producción
- Build log sin errores de TypeScript

---

## ⚡ FASE 6 — Validación del Pipeline CI/CD

> **Objetivo:** Confirmar que el ciclo completo (push → build automático → deploy) funciona correctamente.

### 6.1 Hacer un cambio de prueba

En tu editor local, editar `data/content.json`:

```json
{
  "home": {
    "greeting": "Hola Mundo",
    "subtitle": "Pipeline CI/CD validado ✓",
    "version": "1.0.1"
  },
  "meta": {
    "title": "Mi Proyecto Fullstack",
    "description": "Stack TypeScript validado y funcionando"
  }
}
```

### 6.2 Commitear y pushear el cambio

```bash
git add data/content.json
git commit -m "test: validate CI/CD pipeline with content change"
git push origin main
```

### 6.3 Verificar el deploy automático

1. Ir al dashboard de Vercel → tu proyecto
2. En la sección **"Deployments"**, debe aparecer un nuevo deploy en progreso (indicado con un spinner)
3. Esperar ~1 minuto a que complete
4. Refrescar la URL de producción

Confirmar que el subtítulo ahora dice **"Pipeline CI/CD validado ✓"** y la versión es **v1.0.1**.

### 6.4 Verificar preview deployments (branches)

```bash
# Crear una rama de prueba
git checkout -b feature/test-preview

# Hacer un cambio menor
# Editar data/content.json → cambiar version a "1.0.2-preview"

git add .
git commit -m "test: preview deployment"
git push origin feature/test-preview
```

Vercel generará automáticamente una URL de preview separada para esta rama. Verificar en el dashboard de Vercel que aparece un deploy nuevo con una URL diferente.

```bash
# Volver a main
git checkout main
```

### ✅ Criterio de salida Fase 6

- Cambio en `main` → deploy automático en producción ✅
- Cambio en rama `feature/*` → deploy de preview separado ✅
- El ciclo tarda menos de 2 minutos de extremo a extremo ✅

---

## 🏁 FASE 7 — Calidad de Código y Cierre

> **Objetivo:** Dejar el proyecto limpio, documentado y listo para crecer.

### 7.1 Configurar Prettier

Crear `.prettierrc` en la raíz:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

Crear `.prettierignore`:

```
node_modules
.next
out
.vercel
```

### 7.2 Configurar ESLint

Verificar que `.eslintrc.json` extiende prettier (evita conflictos):

```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

### 7.3 Agregar scripts de validación a `package.json`

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

### 7.4 Ejecutar validación completa

```bash
npm run validate
```

Los tres pasos deben pasar sin errores:

- `type-check` → TypeScript sin errores
- `lint` → ESLint sin warnings críticos
- `build` → Compilación exitosa

### 7.5 Actualizar el README del proyecto

Reemplazar el `README.md` generado por Next.js con uno propio:

```markdown
# My Project — Fullstack TypeScript

Stack: Next.js 14 · TypeScript 5 · Tailwind CSS · Framer Motion

## Estructura

- `/app` — Páginas y API Routes (Next.js App Router)
- `/components` — Componentes React reutilizables
- `/data` — Base de datos en archivos JSON
- `/lib` — Utilidades TypeScript y tipos

## Comandos

| Comando              | Acción                                   |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Servidor de desarrollo en localhost:3000 |
| `npm run build`      | Build de producción                      |
| `npm run type-check` | Verificar tipos TypeScript               |
| `npm run validate`   | type-check + lint + build                |

## Deploy

Automático en Vercel al hacer push a `main`.
```

### 7.6 Commit de cierre

```bash
git add .
git commit -m "chore: code quality setup - eslint, prettier, scripts"
git push origin main
```

### ✅ Criterio de salida Fase 7

- `npm run validate` pasa completamente sin errores
- README del proyecto actualizado
- Código formateado con Prettier
- Repositorio limpio y documentado

---

## 🎯 Resultado Final del Proyecto

Al completar las 8 fases tendrás:

```
LOCAL                          GITHUB                    VERCEL
─────                          ──────                    ──────
npm run dev                    Repositorio limpio        URL de producción
  → localhost:3000        →    con /data JSON       →    auto-deploy en cada push
  → TypeScript tipado          y documentación           preview por cada rama
  → Animación elegante         .gitignore correcto       build log limpio
```

### Estructura final del proyecto

```
my-project/
├── app/
│   ├── api/data/route.ts      ← API que expone los JSON
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               ← Consume data-reader + renderiza componente
├── components/
│   └── HolaMundo.tsx          ← UI animada con Framer Motion
├── data/
│   ├── config.json            ← Configuración global
│   ├── content.json           ← Contenido de páginas
│   └── README.md
├── lib/
│   ├── data-reader.ts         ← Helper de lectura de JSON
│   └── types.ts               ← Interfaces TypeScript
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## ⚠️ Errores Comunes y Soluciones

| Error                                   | Causa probable                                | Solución                                                                  |
| --------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `Module not found: Can't resolve 'fs'`  | Importar `data-reader` en un Client Component | Asegurarse de que `page.tsx` no tenga `"use client"`                      |
| `Cannot read file ... ENOENT`           | La ruta del JSON es incorrecta                | Verificar que `process.cwd()` apunte a la raíz                            |
| `Type error: Property X does not exist` | JSON y tipos desincronizados                  | Actualizar `lib/types.ts` para que coincida con el JSON                   |
| Build falla en Vercel pero pasa local   | Versión de Node diferente                     | Agregar `"engines": { "node": ">=20" }` en `package.json`                 |
| Animaciones no funcionan en producción  | Framer Motion no instalado correctamente      | Verificar `package.json` que esté en `dependencies`, no `devDependencies` |

---

_Plan de implementación v1.0.0 — basado en Infrastructure Plan v1.0.0_

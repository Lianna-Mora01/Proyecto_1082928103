# 📋 PROMPTS DE EJECUCIÓN — Plan Fullstack TypeScript
> Cada prompt debe ejecutarse en orden. Antes de iniciar cualquier prompt, leer los tres documentos base indicados.

---

## 📌 DOCUMENTOS BASE (leer siempre antes de ejecutar)

Antes de ejecutar cualquier prompt, debes leer y tener en contexto los siguientes archivos:

| # | Archivo | Propósito |
|---|---------|-----------|
| 1 | `INFRASTRUCTURE_PLAN.md` | Arquitectura, stack y estructura del proyecto |
| 2 | `IMPLEMENTATION_PLAN.md` | Pasos detallados por fase |
| 3 | `EXECUTION_STATE.md` | Estado actual de ejecución e historial |

---

## 🔵 PROMPT — FASE 0: Prerrequisitos

```
ROL: Actúa como ingeniero fullstack senior especializado en entornos TypeScript y ecosistemas Node.js/Next.js.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — arquitectura y stack del proyecto
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 0: Prerrequisitos
3. EXECUTION_STATE.md — estado actual del proyecto

ACCIÓN INICIAL — OBLIGATORIA:
Antes de hacer cualquier otra cosa, actualiza el archivo EXECUTION_STATE.md:
- En la sección "Historial de Ejecución", agrega una entrada con:
  - Fase: 0 — Prerrequisitos
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Ingeniero Fullstack Senior

TAREA:
Guíame paso a paso por la Fase 0 del plan de implementación:
1. Verifica que Node.js v20 LTS, npm y Git estén instalados — proporciona los comandos exactos de verificación
2. Lista las extensiones de VS Code a instalar con sus IDs exactos
3. Confirma que las cuentas de GitHub y Vercel están listas y vinculadas
4. Verifica cada criterio de salida de la Fase 0

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Cambia el estado de Fase 0 a: ✅ COMPLETADA
   - Agrega fecha/hora de finalización
   - Documenta en "Historial" qué versiones se encontraron (Node, npm, Git) y qué extensiones se instalaron
   - Registra cualquier problema encontrado y cómo se resolvió
2. Crea el archivo PHASE_00_SUMMARY.md con:
   - Resumen de lo realizado
   - Versiones verificadas
   - Extensiones instaladas
   - Problemas encontrados (si aplica)
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## 🟢 PROMPT — FASE 1: Esqueleto del Proyecto

```
ROL: Actúa como ingeniero fullstack senior especializado en Next.js 14 App Router y TypeScript estricto.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — estructura de carpetas y configuración de TypeScript
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 1: Esqueleto del Proyecto
3. EXECUTION_STATE.md — verifica que Fase 0 esté marcada como COMPLETADA antes de continuar

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Si la Fase 0 no está marcada como ✅ COMPLETADA, detente e informa que debe completarse primero.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- En "Historial de Ejecución", agrega entrada:
  - Fase: 1 — Esqueleto del Proyecto
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Ingeniero Fullstack Senior

TAREA:
Guíame paso a paso por la Fase 1:
1. Ejecutar el comando create-next-app con los flags exactos del plan
2. Instalar framer-motion, prettier y eslint-config-prettier
3. Verificar que npm run dev levanta correctamente en localhost:3000
4. Limpiar el boilerplate de Next.js (page.tsx y globals.css)
5. Ejecutar npm run build y confirmar que TypeScript compila sin errores
6. Verificar la estructura de carpetas resultante

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 1: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": dependencias instaladas, estructura creada, resultado del build
   - Registra cualquier error encontrado y su solución
2. Crea el archivo PHASE_01_SUMMARY.md con:
   - Comando usado para crear el proyecto
   - Dependencias instaladas con versiones
   - Estructura de carpetas generada
   - Resultado de npm run build
   - Errores encontrados y soluciones aplicadas
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## 🟡 PROMPT — FASE 2: Capa de Datos JSON

```
ROL: Actúa como ingeniero fullstack senior con experiencia en arquitecturas de datos, TypeScript estricto y patrones de acceso a datos en Next.js.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — sección "Capa de Datos JSON" y tipos TypeScript
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 2
3. EXECUTION_STATE.md — verifica que Fase 1 esté marcada como COMPLETADA

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Si la Fase 1 no está ✅ COMPLETADA, detente e informa que debe completarse primero.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- Agrega entrada en "Historial de Ejecución":
  - Fase: 2 — Capa de Datos JSON
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Ingeniero Fullstack Senior

TAREA:
Guíame paso a paso por la Fase 2:
1. Crear la carpeta /data con content.json y config.json con el contenido exacto del plan
2. Crear data/README.md documentando el esquema
3. Crear /lib/types.ts con todas las interfaces TypeScript definidas en el plan
4. Crear /lib/data-reader.ts con los helpers getContent() y getConfig()
5. Verificar que tsconfig.json tiene resolveJsonModules: true
6. Ejecutar npx tsc --noEmit y confirmar que no hay errores de tipos
7. Crear app/api/data/route.ts con el endpoint GET
8. Verificar el endpoint en http://localhost:3000/api/data

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 2: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": archivos JSON creados, tipos definidos, resultado del tsc --noEmit, respuesta del endpoint
   - Registra cualquier error de tipado y cómo se resolvió
2. Crea el archivo PHASE_02_SUMMARY.md con:
   - Archivos JSON creados y su estructura
   - Interfaces TypeScript definidas en types.ts
   - Contenido de data-reader.ts
   - Respuesta del endpoint /api/data (pegar el JSON de respuesta)
   - Resultado de npx tsc --noEmit
   - Errores encontrados y soluciones
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## 🟠 PROMPT — FASE 3: Home "Hola Mundo" con Efecto Elegante

```
ROL: Actúa como diseñador UX/UI senior y desarrollador frontend experto en React, Framer Motion, Tailwind CSS y animaciones de alto impacto visual. Tu prioridad es la experiencia visual: cada detalle de la animación, la tipografía y la composición deben ser intencionales y elegantes.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — sección "Implementación del Home" y componentes
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 3
3. EXECUTION_STATE.md — verifica que Fase 2 esté marcada como COMPLETADA

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Si la Fase 2 no está ✅ COMPLETADA, detente e informa que debe completarse primero.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- Agrega entrada en "Historial de Ejecución":
  - Fase: 3 — Home Hola Mundo
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Diseñador UX/UI Senior + Desarrollador Frontend

TAREA:
Guíame paso a paso por la Fase 3 con criterio visual y técnico:
1. Crear /components/HolaMundo.tsx con animación letra por letra (efecto flip 3D con spring physics)
2. Implementar el fondo oscuro con patrón de puntos y resplandor indigo
3. Agregar la línea divisora animada con gradiente
4. Implementar el subtítulo con fade-in suave
5. Agregar el badge de versión con aparición retardada
6. Actualizar app/page.tsx para consumir getContent() y pasar el prop correcto al componente
7. Verificar en localhost:3000 que todas las animaciones ejecutan en el orden correcto
8. Ejecutar npm run build — confirmar que no hay errores de TypeScript ni de compilación

CRITERIOS VISUALES A VALIDAR:
- [ ] Las letras aparecen de forma escalonada (stagger) con efecto 3D
- [ ] El fondo tiene profundidad (patrón de puntos + glow)
- [ ] La línea indigo aparece con un scale desde el centro
- [ ] El subtítulo aparece con delay después del título
- [ ] El badge de versión es el último elemento en aparecer
- [ ] La experiencia completa dura entre 2 y 2.5 segundos

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 3: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": componentes creados, decisiones de diseño tomadas, resultado del build
   - Registra si alguna animación requirió ajuste y por qué
2. Crea el archivo PHASE_03_SUMMARY.md con:
   - Descripción de la solución visual implementada
   - Decisiones de diseño (colores, timing, tipografía, efectos)
   - Contenido completo del componente HolaMundo.tsx
   - Contenido final de app/page.tsx
   - Checklist visual completado
   - Resultado de npm run build
   - Errores encontrados y soluciones
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## 🔵 PROMPT — FASE 4: GitHub

```
ROL: Actúa como ingeniero fullstack senior con experiencia en control de versiones, flujos de trabajo con Git y buenas prácticas de repositorios profesionales.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — sección "Configuración de GitHub", estrategia de branches
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 4
3. EXECUTION_STATE.md — verifica que Fase 3 esté marcada como COMPLETADA

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Si la Fase 3 no está ✅ COMPLETADA, detente e informa que debe completarse primero.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- Agrega entrada en "Historial de Ejecución":
  - Fase: 4 — GitHub
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Ingeniero Fullstack Senior

TAREA:
Guíame paso a paso por la Fase 4:
1. Verificar que .gitignore incluye todas las entradas necesarias (node_modules, .next, .env.local, .vercel)
2. Crear .env.example con la plantilla de variables de entorno
3. Ejecutar git init en la raíz del proyecto
4. Ejecutar git add . y verificar que .env.local NO aparece en el staging
5. Crear el primer commit con mensaje semántico correcto
6. Crear el repositorio en GitHub (instrucciones paso a paso en la interfaz)
7. Conectar el remote y ejecutar el push inicial a main
8. Verificar en GitHub que todos los archivos están presentes, incluyendo /data

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 4: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": URL del repositorio, nombre del repositorio, rama principal, archivos commiteados
   - Registra si hubo algún conflicto o problema con el push
2. Crea el archivo PHASE_04_SUMMARY.md con:
   - URL del repositorio en GitHub
   - Estructura de branches definida
   - Contenido del .gitignore relevante
   - Mensaje del primer commit
   - Verificación de que .env.local NO está en el repo
   - Archivos presentes en GitHub (confirmar /data visible)
   - Errores encontrados y soluciones
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## 🟣 PROMPT — FASE 5: Vercel · Deploy a Producción

```
ROL: Actúa como ingeniero DevOps y fullstack senior con experiencia en despliegues en Vercel, configuración de entornos de producción y optimización de pipelines de CI/CD para proyectos Next.js.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — sección "Configuración de Vercel", vercel.json y regiones
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 5
3. EXECUTION_STATE.md — verifica que Fase 4 esté marcada como COMPLETADA

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Si la Fase 4 no está ✅ COMPLETADA, detente e informa que debe completarse primero.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- Agrega entrada en "Historial de Ejecución":
  - Fase: 5 — Deploy en Vercel
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Ingeniero DevOps + Fullstack Senior

TAREA:
Guíame paso a paso por la Fase 5:
1. Importar el repositorio GitHub en Vercel (pasos en la interfaz de Vercel)
2. Configurar los campos: Framework Preset, Root Directory, Build Command, Install Command
3. Agregar las variables de entorno definidas en .env.example
4. Iniciar el primer deploy y monitorear el build log en tiempo real
5. Verificar que el build log muestra "Compiled successfully" sin errores de TypeScript
6. Acceder a la URL de producción generada por Vercel
7. Confirmar que la animación de "Hola Mundo" funciona en producción
8. Registrar la URL final de producción

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 5: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": URL de producción, región de deploy, duración del build, resultado del log
   - Registra cualquier error de build y cómo se resolvió
2. Crea el archivo PHASE_05_SUMMARY.md con:
   - URL de producción final
   - Configuración usada en Vercel (Framework, Build Command, región)
   - Variables de entorno configuradas (sin valores sensibles)
   - Duración total del build
   - Screenshot o descripción de lo visible en producción
   - Verificación de la animación en producción
   - Errores de build y soluciones (si aplica)
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## ⚡ PROMPT — FASE 6: Validación del Pipeline CI/CD

```
ROL: Actúa como ingeniero DevOps senior especializado en pipelines de integración y entrega continua, con experiencia en GitHub Actions, Vercel webhooks y validación de flujos automatizados.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — sección de Vercel y flujo de branches
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 6
3. EXECUTION_STATE.md — verifica que Fase 5 esté marcada como COMPLETADA y anota la URL de producción

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Si la Fase 5 no está ✅ COMPLETADA, detente e informa que debe completarse primero.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- Agrega entrada en "Historial de Ejecución":
  - Fase: 6 — Validación CI/CD
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Ingeniero DevOps Senior

TAREA:
Guíame paso a paso por la Fase 6:
1. Modificar data/content.json: cambiar subtitle a "Pipeline CI/CD validado ✓" y version a "1.0.1"
2. Hacer commit con mensaje semántico: "test: validate CI/CD pipeline with content change"
3. Pushear a main y monitorear el dashboard de Vercel
4. Confirmar que Vercel inicia el deploy automáticamente (sin intervención manual)
5. Verificar que el cambio se refleja en la URL de producción
6. Crear la rama feature/test-preview, hacer un cambio menor y pushear
7. Confirmar que Vercel genera una URL de preview separada para esa rama
8. Medir el tiempo total del ciclo (push → deploy completado)

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 6: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": tiempo del ciclo CI/CD, URL de preview generada, confirmación del cambio en producción
   - Registra si el deploy automático funcionó en el primer intento
2. Crea el archivo PHASE_06_SUMMARY.md con:
   - Cambio realizado en content.json para la prueba
   - Tiempo medido: push → deploy completado
   - URL de producción con el cambio reflejado
   - URL de preview generada para la rama feature
   - Confirmación de que el deploy fue automático (sin intervención)
   - Flujo de branches validado
   - Errores encontrados y soluciones
   - Criterios de salida cumplidos
   - Estado final: COMPLETADA ✅
```

---

## 🏁 PROMPT — FASE 7: Calidad de Código y Cierre

```
ROL: Actúa como ingeniero fullstack senior con rol de Tech Lead, responsable de la calidad del código, estándares del proyecto y cierre formal de la implementación. Tu responsabilidad es dejar el proyecto en estado production-ready.

CONTEXTO: Lee completamente los siguientes documentos antes de responder:
1. INFRASTRUCTURE_PLAN.md — consideraciones de seguridad y escalabilidad
2. IMPLEMENTATION_PLAN.md — detalle de la Fase 7: Calidad y Cierre
3. EXECUTION_STATE.md — verifica que Fases 0 a 6 estén todas marcadas como COMPLETADAS

VALIDACIÓN PREVIA:
Revisa EXECUTION_STATE.md. Todas las fases anteriores (0 al 6) deben estar ✅ COMPLETADAS. Si alguna no lo está, detente e informa cuál falta.

ACCIÓN INICIAL — OBLIGATORIA:
Actualiza EXECUTION_STATE.md:
- Agrega entrada en "Historial de Ejecución":
  - Fase: 7 — Calidad y Cierre
  - Estado: 🟡 EN PROGRESO
  - Fecha y hora de inicio
  - Responsable: Tech Lead / Ingeniero Fullstack Senior

TAREA:
Guíame paso a paso por la Fase 7:
1. Crear .prettierrc con la configuración exacta del plan y .prettierignore
2. Actualizar .eslintrc.json para extender prettier y evitar conflictos
3. Agregar todos los scripts al package.json (lint:fix, format, type-check, validate)
4. Ejecutar npm run validate — los tres pasos deben pasar sin errores
5. Ejecutar npm run format para formatear todo el código con Prettier
6. Reemplazar el README.md generado por Next.js con el README personalizado del plan
7. Hacer commit final: "chore: code quality setup - eslint, prettier, scripts"
8. Pushear a main y confirmar deploy exitoso en Vercel
9. Revisar el estado final del EXECUTION_STATE.md — todas las fases deben estar ✅

ACCIÓN FINAL — OBLIGATORIA:
Al completar todos los pasos:
1. Actualiza EXECUTION_STATE.md:
   - Estado de Fase 7: ✅ COMPLETADA
   - Fecha/hora de finalización
   - Documenta en "Historial": resultado de npm run validate, herramientas de calidad configuradas
   - Marca el proyecto como: 🎉 IMPLEMENTACIÓN COMPLETA
   - Agrega sección "RESUMEN FINAL DEL PROYECTO" con URL de producción, repositorio GitHub y fecha de cierre
2. Crea el archivo PHASE_07_SUMMARY.md con:
   - Herramientas de calidad configuradas (Prettier, ESLint)
   - Resultado de npm run validate (type-check + lint + build)
   - Contenido del README.md final
   - Commit de cierre
   - URL de producción final
   - URL del repositorio GitHub final
   - Estado del proyecto: PRODUCTION READY ✅
3. Crea el archivo PROJECT_FINAL_REPORT.md con el resumen ejecutivo completo de todo el proyecto:
   - Todas las fases y su estado
   - Stack implementado
   - URLs de producción y repositorio
   - Decisiones técnicas tomadas
   - Lecciones aprendidas
   - Próximos pasos sugeridos
```

---

## 📖 Guía de Uso de estos Prompts

### Orden de ejecución

```
FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → FASE 6 → FASE 7
```

Cada fase debe estar ✅ COMPLETADA en `EXECUTION_STATE.md` antes de iniciar la siguiente.

### Archivos generados al finalizar

| Fase | Archivo de resumen generado |
|------|-----------------------------|
| Fase 0 | `PHASE_00_SUMMARY.md` |
| Fase 1 | `PHASE_01_SUMMARY.md` |
| Fase 2 | `PHASE_02_SUMMARY.md` |
| Fase 3 | `PHASE_03_SUMMARY.md` |
| Fase 4 | `PHASE_04_SUMMARY.md` |
| Fase 5 | `PHASE_05_SUMMARY.md` |
| Fase 6 | `PHASE_06_SUMMARY.md` |
| Fase 7 | `PHASE_07_SUMMARY.md` + `PROJECT_FINAL_REPORT.md` |

### Documentos que se actualizan durante la ejecución

- **`EXECUTION_STATE.md`** → se actualiza al INICIO y al FINAL de cada fase
- Los archivos `PHASE_0X_SUMMARY.md` → se crean al FINALIZAR cada fase (son inmutables una vez creados)

---

*Prompts de ejecución v1.0.0 — sincronizados con Implementation Plan v1.0.0*

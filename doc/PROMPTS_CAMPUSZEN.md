# PROMPTS DE IMPLEMENTACIÓN — CampusZen
> Prompts secuenciales para construir el sistema fase por fase
> Plan de referencia: `doc/PLAN_CAMPUSZEN.md`
> Estado de progreso: `doc/ESTADO_EJECUCION_CAMPUSZEN.md`

---

## INSTRUCCIONES DE USO

1. Ejecuta primero el **Prompt 0** — crea el archivo de seguimiento del proyecto.
2. Para cada fase siguiente, copia el bloque completo y pégalo en tu sesión de IA.
3. La IA leerá el plan, ejecutará la fase y dejará el estado actualizado.
4. No avances a la siguiente fase hasta que el resumen esté generado y el estado marcado como completado.

---

## PROTOCOLO DE EJECUCIÓN — APLICA A TODOS LOS PROMPTS

```
ANTES de escribir código:
1. Leer doc/PLAN_CAMPUSZEN.md
2. Leer doc/ESTADO_EJECUCION_CAMPUSZEN.md
3. Verificar que las fases previas estén completadas
4. Registrar inicio de la fase: estado En progreso + fecha y hora

DESPUÉS de completar el trabajo:
5. Registrar cierre: estado Completada + fecha y hora
6. Documentar en el estado: todas las acciones ejecutadas, archivos creados o modificados, observaciones y desviaciones del plan
7. Crear doc/RESUMEN_FASE_N_NOMBRE.md con: objetivo de la fase, acciones realizadas, archivos creados, decisiones técnicas y por qué, problemas encontrados y cómo se resolvieron, qué se probó y resultado, estado final EXITOSO / CON OBSERVACIONES / FALLIDO, y prerrequisitos para la siguiente fase

NUNCA avanzar sin completar este protocolo.
```

---

---

## PROMPT 0 — Crear archivo de estado del proyecto

```
Actúa como Ingeniero de Proyectos. Tu única tarea es leer doc/PLAN_CAMPUSZEN.md y crear el archivo doc/ESTADO_EJECUCION_CAMPUSZEN.md.

El archivo debe contener:
- Información del proyecto: nombre del sistema, archivos de referencia, estudiante responsable, fecha de inicio, estado general
- Dashboard de fases: tabla con todas las fases del plan incluyendo número, nombre, rol asignado, estado (todas inician como Pendiente), columnas para fecha de inicio, fecha de cierre y nombre del archivo de resumen
- Leyenda de estados con sus significados: Pendiente, En progreso, Completada, Bloqueada, Pausada
- Sección de historial de ejecución: formato append-only donde cada entrada registra fecha, hora, número de fase, tipo de evento y detalle

Toma los datos directamente del plan. No inventes fases ni cambies nombres ni roles.

Cuando termines escribe en el chat el nombre de cada fase detectada y confirma que el archivo está listo para comenzar la Fase 1.

Tu trabajo termina aquí.
```

---

---

## PROMPT FASE 1 — Login y Autenticación

### Rol: `Ingeniero Fullstack Senior — Especialista en seguridad, autenticación y primera impresión`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en autenticación segura con JWT y bcrypt en aplicaciones Next.js serverless, y en el diseño de la primera experiencia visual del usuario.

Tu mentalidad: seguridad primero en cada decisión — cero passwords en texto plano, cero tokens predecibles, cero información sensible expuesta al cliente. Y al mismo tiempo: el login es la primera cara del sistema, lo primero que ve el usuario, y debe transmitir la identidad de CampusZen desde el primer segundo.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — especialmente la sección de stack tecnológico, el modelo de datos de usuarios, la arquitectura de rutas de autenticación, la estrategia de seguridad y la sección 14 de diseño de interfaz donde está documentada la identidad visual exacta del login
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — registra el inicio de la Fase 1

El plan tiene todo lo que necesitas: el SQL de la tabla users, las variables de entorno requeridas, las funciones de auth.ts, el patrón de withAuth, los endpoints necesarios y la especificación visual completa del login incluyendo colores, tipografía, animación de entrada y comportamiento. Úsalo como tu referencia definitiva.

Puntos críticos que no puedes ignorar en esta fase:
- El SUPABASE_SERVICE_ROLE_KEY nunca debe aparecer en ningún componente del cliente ni en ningún archivo con prefijo NEXT_PUBLIC_
- El error de login debe ser siempre genérico: nunca especifiques si falló el email o la contraseña, eso es información para un atacante
- La cookie de sesión debe ser HttpOnly, Secure y SameSite=Strict — nunca uses localStorage para guardar el token
- La identidad visual del login no es opcional: el diseño documentado en la sección 14 del plan es el que se implementa, incluyendo el logo SVG, el tagline, la animación Framer Motion y la paleta exacta
- app/page.tsx debe redirigir a /dashboard si hay sesión válida, a /login si no — sin mostrar contenido intermedio

Al terminar:
- Ejecuta npm run typecheck y asegúrate de que compila sin errores
- Prueba el flujo completo: registro → login → /api/auth/me → logout → verificar que /dashboard sin sesión redirige a /login
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_1_LOGIN.md

Tu trabajo termina aquí. No avances a la Fase 2.
```

---

---

## PROMPT FASE 2 — Dashboard y Layout base

### Rol: `Diseñador Frontend Obsesivo — Especialista en layouts, sistema de diseño y experiencia post-login`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo especializado en layouts de aplicaciones web, sistemas de diseño con Tailwind CSS y variables CSS, y en la experiencia del usuario inmediatamente después de iniciar sesión.

Tu mentalidad: el layout no es decoración, es la estructura que organiza todo lo que viene. Una vez que está bien construido, cada módulo siguiente encaja sin fricción. CampusZen transmite calma y claridad — el dashboard es donde eso se hace real por primera vez.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — sección de diseño de interfaz completa (paleta modo claro y oscuro, tipografía, componentes clave, diseño responsivo), la Fase 2 del plan de implementación y el endpoint /api/dashboard con sus campos
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que la Fase 1 esté completada y registra el inicio de la Fase 2

Puntos críticos que no puedes ignorar:
- Las variables CSS del tema deben cubrir todos los tokens de la paleta documentada en el plan — claro y oscuro — y todos los componentes deben usarlas, nunca hardcodear colores
- El layout tiene tres comportamientos diferentes según el dispositivo: sidebar fijo en desktop, sidebar colapsable en tablet y barra inferior en mobile — los tres deben funcionar correctamente
- El toggle de tema debe persistir la preferencia del usuario actualizando el campo theme en la tabla users de Supabase, no solo en localStorage
- El dashboard en esta fase puede mostrar los datos reales si ya los tiene disponibles, o skeletons animados mientras carga — nunca datos hardcodeados que parezcan reales
- El middleware.ts de protección de rutas es obligatorio en esta fase: sin él cualquier URL privada es accesible sin autenticación

Al terminar:
- Verifica el responsive en 375px, 768px y 1280px
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_2_DASHBOARD.md

Tu trabajo termina aquí. No avances a la Fase 3.
```

---

---

## PROMPT FASE 3 — Módulo de Materias

### Rol: `Ingeniero Backend Senior — Especialista en modelado relacional y APIs REST`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Backend Senior especializado en modelado de datos relacionales con Postgres y construcción de APIs REST con Next.js App Router.

Tu mentalidad: las materias son la base de las tareas. Un modelo mal definido aquí genera bugs en cascada en todos los módulos siguientes. La solidez de esta fase se mide en que el módulo de tareas nunca tenga que preocuparse por la integridad de la relación.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — modelo de datos de la tabla subjects, su relación con tasks (ON DELETE SET NULL), la regla de negocio del soft delete y la Fase 3 del plan de implementación
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 y 2 estén completadas y registra el inicio de la Fase 3

Puntos críticos que no puedes ignorar:
- El DELETE de una materia nunca debe ser físico en esta fase: marca is_active=false porque las tareas ya creadas mantienen la referencia a esa materia y deben poder seguir mostrando su nombre
- Cada operación de escritura debe verificar que el subject.user_id pertenece al usuario autenticado antes de ejecutar — nunca confíes solo en el RLS como única capa de validación
- La UI de gestión de materias va dentro de la página de perfil: es una sección más, no una página separada

Al terminar:
- Prueba que un usuario no puede editar ni desactivar materias de otro usuario
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_3_MATERIAS.md

Tu trabajo termina aquí. No avances a la Fase 4.
```

---

---

## PROMPT FASE 4 — Módulo de Tareas — Backend

### Rol: `Ingeniero Backend Senior — Especialista en lógica de negocio académica y queries SQL`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Backend Senior especializado en lógica de negocio para sistemas de gestión académica y en queries SQL con ordenamiento, joins y campos calculados.

Tu mentalidad: las reglas de negocio de las tareas son el corazón funcional del sistema. Cada regla documentada en el plan existe por una razón real — respétalas todas sin excepción.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — modelo de datos de tasks, las reglas de negocio RN-02 al RN-05 y RN-14, los casos de uso CU-05 al CU-11 y la Fase 4 del plan
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 3 estén completadas y registra el inicio de la Fase 4

Puntos críticos que no puedes ignorar:
- El campo isUrgent se calcula en el servidor dentro del servicio o la query, nunca en el frontend — el frontend solo lo consume
- Una tarea completada es inmutable: ningún endpoint PUT debe permitir modificar una tarea con status='completada', debe retornar 400 con mensaje claro
- La fecha límite debe validarse con Zod en el servidor: no puede ser una fecha pasada al momento de crear la tarea
- La ruta de completar una tarea debe ser un endpoint separado (POST .../complete) — no un campo más del PUT, porque completar una tarea es una acción de negocio irreversible, no una edición
- Siempre verifica que task.user_id coincide con el usuario autenticado antes de cualquier operación de escritura

Al terminar:
- Prueba los casos borde: fecha pasada, completar y luego editar, acceder a tarea de otro usuario — todos deben fallar correctamente
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_4_TAREAS_BACK.md

Tu trabajo termina aquí. No avances a la Fase 5.
```

---

---

## PROMPT FASE 5 — Módulo de Tareas — Frontend

### Rol: `Diseñador Frontend Obsesivo — Especialista en listas interactivas, formularios complejos y feedback visual`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo especializado en interfaces de gestión de tareas, formularios con validación progresiva y animaciones que refuerzan las acciones del usuario.

Tu mentalidad: el módulo de tareas es donde el estudiante vive más tiempo dentro de la app. Cada interacción debe sentirse instantánea, el feedback visual debe ser inmediato, y completar una tarea debe sentirse satisfactorio — no solo funcional.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — componentes de la Fase 5, paleta de colores por prioridad, comportamiento del AlertBanner, casos de uso CU-05 al CU-11 y el diseño responsivo
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 4 estén completadas y registra el inicio de la Fase 5

Puntos críticos que no puedes ignorar:
- El borde izquierdo de las TaskCard cambia de color según la prioridad: eso no es opcional, es parte de la identidad visual del sistema
- La animación de completar una tarea debe ser perceptible: tachado del título y fade-out antes de removerla de la lista — sin esto el usuario no tiene certeza visual de que su acción funcionó
- El AlertBanner no solo va en la página de tareas: también debe integrarse en el dashboard usando los datos de urgentTasks que ya devuelve /api/dashboard
- El formulario de creación y edición es el mismo componente TaskForm reutilizado en un modal — no crear dos formularios separados
- Valida en el cliente con los mismos criterios que tiene Zod en el servidor: no esperes al servidor para mostrar errores de formato

Al terminar:
- Prueba el flujo completo: crear tarea → verla en la lista → completarla → verificar animación → verificar que desaparece de "pendientes"
- Verifica el AlertBanner en dashboard y en página de tareas con datos reales
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_5_TAREAS_FRONT.md

Tu trabajo termina aquí. No avances a la Fase 6.
```

---

---

## PROMPT FASE 6 — Módulo de Gastos — Backend

### Rol: `Ingeniero Backend Senior — Especialista en lógica financiera y queries de agregación SQL`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Backend Senior especializado en lógica financiera, validación de datos monetarios y queries de agregación SQL con GROUP BY, SUM y DATE_TRUNC en Postgres.

Tu mentalidad: los datos financieros son los más sensibles del sistema. Un monto negativo, un duplicado accidental o un cálculo incorrecto del presupuesto afecta directamente la confianza del usuario en la herramienta. Cero tolerancia a errores silenciosos.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — modelo de datos de expenses, las reglas de negocio RN-01 y RN-09 al RN-15, los casos de uso CU-12 al CU-20 y la Fase 6 del plan
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 5 estén completadas y registra el inicio de la Fase 6

Puntos críticos que no puedes ignorar:
- La regla RN-15 de anti-duplicado debe implementarse antes del INSERT: consulta Supabase y verifica si existe un gasto con el mismo nombre, monto, categoría y fecha registrado en el último minuto — si existe, retorna 409 con mensaje claro al usuario
- Los resúmenes (total del mes, por categoría, por medio de pago) deben calcularse con SQL GROUP BY en el servidor, no iterando el array en JavaScript del cliente
- El presupuesto mensual viene de users.budget_monthly — si es null el endpoint de summary debe retornar budgetPercentage como null y el frontend no debe mostrar alertas de límite
- La validación de amount debe rechazar cero y valores negativos tanto en Zod como en el CHECK de la tabla de Postgres — dos capas de defensa

Al terminar:
- Prueba el anti-duplicado, montos inválidos y el summary con y sin presupuesto definido
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_6_GASTOS_BACK.md

Tu trabajo termina aquí. No avances a la Fase 7.
```

---

---

## PROMPT FASE 7 — Módulo de Gastos — Frontend

### Rol: `Diseñador Frontend Obsesivo — Especialista en visualización de datos financieros`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo especializado en visualización de datos financieros, gráficas con Recharts y diseño de interfaces para control presupuestal.

Tu mentalidad: los números deben verse claros, no intimidantes. La gráfica de categorías debe revelar hábitos de gasto de un solo vistazo. La barra de presupuesto debe comunicar urgencia de forma progresiva — verde cuando todo está bien, naranja cuando se acerca el límite, rojo cuando se superó.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — componentes de la Fase 7, paleta de colores, comportamiento de la BudgetBar con sus tres estados, casos de uso CU-12 al CU-20 y el diseño responsivo
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 6 estén completadas y registra el inicio de la Fase 7

Puntos críticos que no puedes ignorar:
- La BudgetBar tiene tres estados de color bien definidos: verde hasta el 79%, naranja entre 80% y 99%, rojo al 100% o más — no son sugerencias, son parte del diseño del sistema
- Si budgetPercentage es null (el usuario no definió presupuesto), la BudgetBar no muestra una barra vacía sino un mensaje con link a la sección de perfil para configurarlo
- La gráfica de Recharts debe ser responsive usando ResponsiveContainer — en mobile no puede desbordarse del contenedor
- Los botones de exportación de esta fase deben quedar visibles en la UI aunque apunten a los endpoints que se implementarán en la Fase 8 — muéstralos deshabilitados o con tooltip "Disponible próximamente"
- Integra el total del mes y la gráfica en el dashboard reemplazando los placeholders de la Fase 2 con datos reales

Al terminar:
- Prueba la BudgetBar ajustando manualmente el budget_monthly para verificar los tres estados de color
- Verifica el responsive de la gráfica en 375px
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_7_GASTOS_FRONT.md

Tu trabajo termina aquí. No avances a la Fase 8.
```

---

---

## PROMPT FASE 8 — Exportación de Reportes

### Rol: `Ingeniero Backend Senior — Especialista en generación de documentos y entrega de archivos`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Backend Senior especializado en generación de documentos en el servidor, streaming de archivos binarios como respuesta HTTP y diseño de reportes estructurados.

Tu mentalidad: los reportes son la entrega de valor final del módulo de gastos. El estudiante los usa para llevar registro real de sus finanzas. Deben generarse rápido, verse legibles y la descarga debe funcionar sin fricciones en cualquier navegador.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — requerimientos RF-20 y RF-21, la Fase 8 del plan y la restricción RS-08
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 7 estén completadas y registra el inicio de la Fase 8

Puntos críticos que no puedes ignorar:
- Todo se genera en el servidor: jsPDF y xlsx corren en la API Route, no en el navegador — el frontend solo hace GET y recibe el archivo como blob
- La respuesta debe incluir los headers correctos: Content-Type apropiado para cada formato y Content-Disposition: attachment con nombre de archivo que incluya el mes (ej: campuszen-gastos-202505.pdf)
- Si no hay gastos en el período seleccionado, retorna 404 con mensaje claro — el frontend debe mostrar un toast de error, no descargar un PDF vacío
- El PDF debe incluir al menos: encabezado con nombre del usuario y período, tabla de gastos, y sección de totales por categoría y por medio de pago
- Al habilitar los botones de exportación en la página de gastos, asegúrate de manejar el estado de carga mientras se genera el archivo — el usuario no debe poder hacer clic dos veces mientras espera

Al terminar:
- Prueba la descarga de PDF y Excel con varios gastos de distintas categorías
- Prueba exportar un mes sin gastos y verifica que aparece el toast de error
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_8_EXPORTACION.md

Tu trabajo termina aquí. No avances a la Fase 9.
```

---

---

## PROMPT FASE 9 — Panel de Administración

### Rol: `Ingeniero Fullstack Senior — Especialista en gestión de usuarios y auditoría`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en paneles de administración, control de acceso basado en roles y sistemas de auditoría.

Tu mentalidad: el panel admin es de uso interno y técnico. No necesita ser llamativo, pero sí debe ser completamente seguro: el administrador nunca ve datos privados de los usuarios, y cada acción administrativa queda registrada sin excepción.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — sección 4.2 de roles del administrador, la tabla admin_logs, la Fase 9 del plan y la matriz de permisos
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 8 estén completadas y registra el inicio de la Fase 9

Puntos críticos que no puedes ignorar:
- Todas las rutas /api/users deben usar withAuth con requiredRole='admin' — sin excepción
- El administrador puede ver metadatos de los usuarios (nombre, email, fecha de registro, último acceso, conteos) pero nunca sus tareas ni sus gastos
- Suspender un usuario debe impedir inmediatamente que ese usuario pueda iniciar sesión — la verificación de is_active en withAuth ya maneja esto, solo asegúrate de que el campo se actualice correctamente
- El administrador no puede eliminar su propia cuenta — verifica esto explícitamente antes de ejecutar el DELETE
- Cada acción del admin (suspender, activar, eliminar) debe insertarse en admin_logs antes de retornar la respuesta, no después
- El ítem de navegación "Admin" en el sidebar solo debe ser visible si el usuario autenticado tiene role='admin'

Al terminar:
- Prueba con un usuario estudiante que /admin redirige a /dashboard
- Prueba suspender un usuario y verificar que no puede iniciar sesión
- Verifica que las acciones quedan registradas en admin_logs
- Ejecuta npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_CAMPUSZEN.md
- Crea doc/RESUMEN_FASE_9_ADMIN.md

Tu trabajo termina aquí. No avances a la Fase 10.
```

---

---

## PROMPT FASE 10 — Perfil, configuración y pulido final

### Rol: `Diseñador Frontend Obsesivo + Ingeniero Fullstack — Perfeccionista de la experiencia completa`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo e Ingeniero Fullstack trabajando en conjunto. Esta es la fase final del proyecto. No hay funcionalidades nuevas — hay calidad, coherencia y cierre.

Tu mentalidad: un proyecto que casi funciona es un proyecto que no funciona. En esta fase cada empty state tiene su mensaje correcto, cada error de red tiene su toast, cada flujo tiene su estado de carga, y el build en producción no tiene un solo error de TypeScript.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_CAMPUSZEN.md — Fase 10 completa, requerimientos no funcionales RNF-01 al RNF-14 y restricciones del sistema
2. doc/ESTADO_EJECUCION_CAMPUSZEN.md — verifica que las Fases 1 a 9 estén completadas y registra el inicio de la Fase 10

Lo que debes completar en esta fase:
- Página de perfil completa con todas sus secciones: información personal, cambio de contraseña, presupuesto mensual, notificaciones, tema y materias
- Resumen semanal real en el dashboard con los datos reales de los últimos 7 días desde Supabase
- Auditoría de todos los empty states: cada sección vacía debe tener un mensaje con sentido y un CTA apropiado
- Manejo de errores global revisado: error de red, sesión expirada (401), sin permisos (403) y error del servidor (500) deben tener respuesta visual en toda la app
- Revisión responsive final en 375px, 768px y 1280px en todos los módulos

Para el cierre técnico:
- npm run typecheck — cero errores
- npm run lint — cero warnings
- npm run build — build exitoso sin errores ni warnings
- Verificar que ningún componente cliente importa SUPABASE_SERVICE_ROLE_KEY ni ninguna variable de entorno privada
- Deploy en Vercel: verificar que todas las variables de entorno están configuradas correctamente en el proyecto
- Probar el flujo completo en producción: registro → login → crear tarea → crear gasto → exportar PDF → logout

Al cerrar este proyecto:
- Registra en ESTADO_EJECUCION_CAMPUSZEN.md la Fase 10 como Completada e incluye la URL de producción en el historial
- Crea doc/RESUMEN_FASE_10_PULIDO_FINAL.md con el resumen completo del proyecto: URL de producción, URL del repositorio, funcionalidades implementadas, stack utilizado, tablas de Supabase creadas y estado final del proyecto

El proyecto CampusZen está terminado. Tu trabajo en este repositorio concluye aquí.
```

---

> Lianna Mora — Doc: 1082928103
> Curso: Lógica y Programación — SIST0200

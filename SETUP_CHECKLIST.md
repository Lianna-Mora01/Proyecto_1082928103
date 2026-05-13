# ✅ CampusZen - Checklist de Configuración

Usa esta lista para asegurar que tu proyecto está completamente configurado.

---

## 📋 Checklist de Setup Inicial

### Paso 1: Ambiente & Dependencias
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm o pnpm instalado (`npm --version`)
- [ ] Repositorio clonado localmente
- [ ] `npm install` completado sin errores

### Paso 2: Configuración de Supabase
- [ ] Cuenta Supabase creada en https://app.supabase.com
- [ ] Nuevo proyecto Supabase creado
- [ ] Anotado: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Anotado: `SUPABASE_SERVICE_ROLE_KEY` (desde Settings → API)
- [ ] Archivo `.env.local` creado en proyecto root
- [ ] Variables copiadas a `.env.local`

**Archivo `.env.local` debe contener:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
JWT_SECRET=[32+ caracteres aleatorios]
ADMIN_BOOTSTRAP_SECRET=[32+ caracteres aleatorios]
```

### Paso 3: Verificación
- [ ] `npm run verify-supabase` muestra ✅ (no errores)
- [ ] `npm run type-check` sin errores (ZERO ERRORS)
- [ ] `npm run build` completado exitosamente

### Paso 4: Base de Datos
- [ ] `npm run dev` iniciado sin error "credentials not found"
- [ ] Navegación a http://localhost:3000/admin/db-setup
- [ ] Click en "Ejecutar Migraciones" en admin panel
- [ ] Tablas creadas exitosamente (users, subjects, tasks visible)
- [ ] Seed data insertado (materias, tareas de ejemplo)

### Paso 5: Autenticación
- [ ] Navegación a http://localhost:3000/register
- [ ] Usuario estudiante registrado exitosamente
- [ ] Login funciona con credenciales nuevas
- [ ] Dashboard muestra datos del usuario
- [ ] Logout funciona correctamente

### Paso 6: Funcionalidad Core
- [ ] **Materias:**
  - [ ] Nueva materia creada desde dashboard
  - [ ] Materia visible en lista
  - [ ] Color se mantiene
  
- [ ] **Tareas:**
  - [ ] Nueva tarea creada desde /tasks
  - [ ] Validación: fecha no puede ser pasada
  - [ ] Validación: título requerido (1-200 caracteres)
  - [ ] Tarea vencida en <48h muestra alerta en dashboard
  - [ ] Tarea completada: strikethrough animado
  - [ ] Tarea editada: cambios se guardan
  - [ ] Tarea eliminada: desaparece con animación

- [ ] **Responsive:**
  - [ ] Mobile (375px): 1 columna
  - [ ] Tablet (768px): 2 columnas
  - [ ] Desktop (1024px+): 3 columnas
  - [ ] Todos los botones accesibles

- [ ] **Dark Mode:**
  - [ ] Toggle funciona en header
  - [ ] Colores se adaptan light/dark
  - [ ] Preferencia se persiste

---

## 🔧 Troubleshooting

### Error: "Supabase credentials not found"
**Solución:**
1. Verifica que `.env.local` existe en proyecto root
2. Ejecuta: `npm run verify-supabase`
3. Restart: `npm run dev`
4. Nota: En seed mode esto es normal hasta setup

### Error: TypeScript (TS2339, TS2345, etc.)
**Solución:**
```bash
npm run type-check    # Ver errores específicos
npm install           # Reinstalar dependencias
rm -rf node_modules   # Si todo falla
npm install
npm run build         # Validar build
```

### Error: "Cannot find module 'lucide-react'"
**Solución:**
```bash
npm install lucide-react@latest
npm run build
```

### Base de datos no carga en /admin/db-setup
**Solución:**
1. Verifica credenciales en `.env.local`
2. Ejecuta: `npm run verify-supabase` (debe pasar)
3. Revisa consola del navegador (F12) por errors
4. Revisa logs de Next.js en terminal

### Dashboard vacío (no ve datos)
**Solución:**
1. Login como usuario que creó datos
2. Ve a /admin/db-setup → "Rellenar con Seed"
3. Espera a que aparezcan datos de ejemplo
4. Refresh página (Ctrl+R)

---

## 📚 Documentación Referencia

Cuando necesites información, consulta:

| Tema | Archivo |
|------|---------|
| Setup Supabase completo | [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) |
| Estado actual del proyecto | [ESTADO_EJECUCION_CAMPUSZEN.md](./doc/ESTADO_EJECUCION_CAMPUSZEN.md) |
| Plan de implementación | [PLAN_CAMPUSZEN.md](./doc/PLAN_CAMPUSZEN.md) |
| Resumen Fase 5 (Tareas) | [RESUMEN_FASE_5_TAREAS_FRONT.md](./doc/RESUMEN_FASE_5_TAREAS_FRONT.md) |
| Stack & Arquitectura | [INFRASTRUCTURE_PLAN.md](./doc/INFRASTRUCTURE_PLAN.md) |

---

## ✨ Próximos Pasos

Una vez completado el checklist:

1. **Fase 6** - Módulo de Gastos (Backend)
   - Crear migration para tabla expenses
   - Implementar API endpoints

2. **Fase 7** - Módulo de Gastos (Frontend)
   - Crear componentes UI (ExpenseCard, ExpenseForm)
   - Visualizar con charts

3. **Fase 8** - Reportes y Exportación

4. **Fase 9** - Panel Administrativo

5. **Fase 10** - Pulido Final y Deploy

---

## 🆘 Necesitas Ayuda?

Si encuentras problemas:
1. Consulta el archivo específico de la fase en `doc/`
2. Revisa logs: `npm run dev` output
3. Verifica variables en `.env.local`: `npm run verify-supabase`
4. Limpia caché y reinstala:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

---

**Última actualización:** Fase 5 ✅ Completada  
**Build Status:** ✅ Success (21/21 routes)  
**TypeCheck Status:** ✅ Zero Errors

# 📜 Guía de Scripts - CampusZen

Todos los comandos npm disponibles en el proyecto.

---

## 🚀 Comandos de Desarrollo

### `npm run dev`
Inicia servidor de desarrollo Next.js con hot-reload.
```bash
npm run dev
# Accede a: http://localhost:3000
```

### `npm run build`
Compila la aplicación para producción.
```bash
npm run build
# Produce artefactos optimizados en .next/
```

### `npm run start`
Inicia servidor de producción (requiere build previo).
```bash
npm run build
npm run start
```

---

## ✅ Comandos de Validación

### `npm run type-check`
Valida tipos TypeScript sin compilar.
```bash
npm run type-check
# Espera: ✅ (ZERO ERRORS)
```

### `npm run validate`
Validación completa: TypeScript + Build.
```bash
npm run validate
# Ejecuta: type-check && build
```

### `npm run lint`
Ejecuta ESLint con fix automático.
```bash
npm run lint
# Autocorrige problemas de linting
```

### `npm run format`
Formatea código con Prettier.
```bash
npm run format
# Aplica formato consistente
```

---

## 🔧 Comandos de Setup

### `npm run setup-supabase`
Muestra instrucciones para configurar Supabase.
```bash
npm run setup-supabase
# Imprime: "Lee SETUP_SUPABASE.md para instrucciones..."
```

### `npm run verify-supabase`
Verifica que .env.local tenga variables requeridas.
```bash
npm run verify-supabase
# Valida: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
# ✅ Si todo está bien
# ❌ Si falta algo, muestra qué arreglar
```

### `npm run post-setup`
Validación completa post-setup.
```bash
npm run post-setup
# Verifica:
# 1. .env.local existe
# 2. node_modules instalado
# 3. TypeScript OK
# 4. ESLint OK
# 5. Build OK
```

---

## 📋 Flujo Recomendado de Setup

### Primera vez (setup inicial)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear y configurar .env.local
cp .env.example .env.local
# Editar .env.local con credenciales Supabase

# 3. Verificar Supabase
npm run verify-supabase

# 4. Validación post-setup
npm run post-setup

# 5. Iniciar desarrollo
npm run dev

# 6. Bootstrap en navegador
# http://localhost:3000/admin/db-setup
```

### Desarrollo normal

```bash
# 1. Iniciar servidor
npm run dev

# 2. Durante desarrollo
npm run type-check      # Validar tipos ocasionalmente
npm run lint            # Limpiar código
npm run format          # Formatear si es necesario

# 3. Antes de commit
npm run validate        # Asegurar que build funciona
```

### Antes de merge/push

```bash
# Validación final
npm run validate        # type-check + build
npm run lint            # ESLint final check
```

---

## 🐛 Troubleshooting con Scripts

### Error: "Module not found"
```bash
npm install             # Reinstalar dependencias
```

### Error: TypeScript
```bash
npm run type-check      # Ver errores específicos
npm run lint            # Limpiar imports
```

### Error: Build fail
```bash
npm run build           # Compilation detallado
```

### Supabase conectándose?
```bash
npm run verify-supabase # Verificar credenciales
npm run post-setup      # Full diagnostic
```

---

## 📊 Scripts por Categoría

| Categoría | Comando | Propósito |
|-----------|---------|----------|
| **Dev** | `npm run dev` | Servidor con hot-reload |
| **Dev** | `npm run build` | Compilar producción |
| **Dev** | `npm run start` | Servidor producción |
| **Test** | `npm run type-check` | Validar tipos TS |
| **Test** | `npm run validate` | Full test suite |
| **Test** | `npm run lint` | ESLint + fix |
| **Test** | `npm run format` | Prettier |
| **Setup** | `npm run setup-supabase` | Ayuda setup |
| **Setup** | `npm run verify-supabase` | Verificar credenciales |
| **Setup** | `npm run post-setup` | Validación completa |

---

## 📚 Archivos Relacionados

- [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) — Configuración Supabase paso a paso
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) — Checklist de configuración
- [README.md](./README.md) — Documentación principal
- [package.json](./package.json) — Definición de scripts

---

## ⚡ Quick Reference

```bash
# Setup inicial
npm install && npm run verify-supabase && npm run post-setup

# Desarrollo
npm run dev

# Validar antes de push
npm run validate

# Problema? Ejecutar diagnostic
npm run post-setup
```

---

**Última actualización:** Fase 5 ✅  
**Scripts totales:** 10  
**Recomendado:** Usar `npm run post-setup` después de cualquier cambio en .env.local

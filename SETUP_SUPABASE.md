# 🔧 Setup de Supabase — Guía Paso a Paso

## El Problema

```
Error: Supabase credentials not found. System will run in seed mode until bootstrap.
```

Significa que el archivo `.env.local` **no existe** o está **incompleto**. Sin este archivo, el sistema no puede conectarse a Supabase.

---

## ✅ Solución: Crear `.env.local`

### 1️⃣ Obtener Credenciales de Supabase

Ve a tu proyecto Supabase en https://supabase.com/dashboard:

**A. NEXT_PUBLIC_SUPABASE_URL**
- En dashboard → Settings → API
- Busca: **API URL** (algo como `https://xxxxxx.supabase.co`)
- ✅ Copiar esta URL

**B. SUPABASE_SERVICE_ROLE_KEY**
- En dashboard → Settings → API
- Bajo "Project API keys", busca **Service Role** (clave privada, NUNCA público)
- ⚠️ **Nunca** compartas esta clave
- ✅ Copiar esta clave

### 2️⃣ Obtener Otras Credenciales Necesarias

**C. JWT_SECRET** (opcional, generado localmente)
- Ejecuta en terminal:
```bash
openssl rand -base64 32
```
- O usa: `echo "your_random_32_char_string_here"`

**D. ADMIN_BOOTSTRAP_SECRET** (opcional, generado localmente)
- Mismo proceso que JWT_SECRET
```bash
openssl rand -base64 32
```

---

## 📝 Crear el Archivo `.env.local`

En la **raíz del proyecto** (`c:\Users\liann\OneDrive\Desktop\Ptoyecto lianna\`), crea o edita:

### `.env.local`
```env
# ========================================
# SUPABASE CONFIGURATION (Requerido)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ========================================
# AUTENTICACIÓN (Generado localmente)
# ========================================
JWT_SECRET=ejemplo_de_32_caracteres_minimo_aqui
ADMIN_BOOTSTRAP_SECRET=otro_random_32_caracteres_aqui

# ========================================
# OPCIONAL (Si uses Vercel Blob)
# ========================================
BLOB_READ_WRITE_TOKEN=

# ========================================
# OPTIONAL APP SETTINGS
# ========================================
NEXT_PUBLIC_APP_NAME=CampusZen
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 🚀 Verificar que Funciona

Después de crear `.env.local`, ejecuta:

```bash
# 1. Reiniciar el servidor de desarrollo
npm run dev

# 2. En otra terminal, verificar que env vars cargaron
npm run build
```

### ✅ Si ves esto = Funciona
```
✓ Compiled successfully
✓ TypeScript: X.Xs
✓ Static pages: 21/21 generated
```

### ❌ Si ves esto = Algo falta
```
Error: Supabase credentials not found
```
→ Verifica que `.env.local` está en la **raíz exacta** del proyecto

---

## 🔍 Verificación Rápida

En la terminal, ejecuta:
```bash
echo $env:NEXT_PUBLIC_SUPABASE_URL
echo $env:SUPABASE_SERVICE_ROLE_KEY
```

Si está vacío, significa que el `.env.local` no está siendo cargado.

---

## ⚠️ IMPORTANTE

1. **`.env.local` NUNCA va en Git** — Ya está en `.gitignore` ✅
2. **No compartir SUPABASE_SERVICE_ROLE_KEY** — Es privada
3. **Los valores pueden estar en blanco inicialmente** — El sistema fallará gracefully

---

## 📋 Checklist de Setup

- [ ] Proyecto Supabase creado en supabase.com
- [ ] NEXT_PUBLIC_SUPABASE_URL copiado
- [ ] SUPABASE_SERVICE_ROLE_KEY copiado  
- [ ] `.env.local` creado en raíz del proyecto
- [ ] Valores pegados en el archivo
- [ ] Terminal reiniciada
- [ ] `npm run dev` ejecutado
- [ ] Sin errores de credenciales ✅

---

## 🆘 Troubleshooting

| Problema | Solución |
|----------|----------|
| "credentials not found" | Verifica que `.env.local` existe en raíz |
| Variables vacías | Copia los valores correctos de Supabase |
| "Permission denied" | Usa el Service Role Key, no Anon Key |
| Build falla | Reinicia terminal después de crear `.env.local` |
| Node.js no detecta cambios | Mata `npm run dev` y ejecuta de nuevo |

---

## 📚 Documentos Relacionados

- [GUIA_SUPABASE.md](GUIA_SUPABASE.md) — Arquitectura técnica
- [RESUMEN_FASE_1_LOGIN.md](RESUMEN_FASE_1_LOGIN.md) — Login + variables requeridas
- [INFRASTRUCTURE_PLAN.md](INFRASTRUCTURE_PLAN.md) — Plan de infraestructura completo

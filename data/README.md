# Datos Iniciales — CampusZen

Este directorio contiene los datos de semilla que se cargan en la **primera ejecución del bootstrap**.

## Credenciales de administrador

**Email:** `admin@campuszen.com`  
**Contraseña:** `Admin123*`

> ⚠️ **IMPORTANTE:** Cambiar esta contraseña inmediatamente después de la primera ejecución en producción.

## Estructura

- `config.json` — Configuración del sistema (versión, nombre)
- `seed.json` — Usuario admin inicial con contraseña hasheada con bcrypt

## Notas

- El `password_hash` está pre-generado con bcrypt 10 salt rounds
- Los UUIDs están hardcodeados para que el seed sea reproducible
- Estos datos se cargan **una sola vez** durante el bootstrap
- Después del bootstrap, el sistema usa Supabase Postgres como única fuente de verdad
- `data/` es **read-only** en producción
  "meta": {
    "title": "Mi Proyecto Fullstack",
    "description": "Stack TypeScript validado y funcionando"
  }
}
```

### config.json

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

## Propósito

Estos archivos se leen desde el servidor usando utilidades tipadas y se exponen mediante un endpoint API controlado.

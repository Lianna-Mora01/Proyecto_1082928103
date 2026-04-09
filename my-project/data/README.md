# /data — Base de datos en JSON

Esta carpeta contiene los archivos JSON que actúan como base de datos del proyecto.

## Archivos

- `content.json` — contenido principal de la página y metadatos.
- `config.json` — configuración general de la app y parámetros de animación.

## Esquema

### content.json

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

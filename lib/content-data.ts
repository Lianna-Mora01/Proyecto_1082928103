// Datos de contenido legacy - ya no se utilizan en CampusZen
// Mantienen compatibilidad con componentes antiguos

export const contentData = {
  home: {
    greeting: "Hola Mundo",
    subtitle: "Pipeline CI/CD validado ✓",
    version: "1.0.1",
  },
  meta: {
    title: "Mi Proyecto Fullstack",
    description: "Stack TypeScript validado y funcionando",
  },
};

export const configData = {
  app: {
    name: "Mi Proyecto",
    theme: "dark" as const,
    language: "es" as const,
  },
  animation: {
    enabled: true,
    duration: 0.8,
    easing: "easeInOut" as const,
  },
};

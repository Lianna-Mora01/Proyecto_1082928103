import type { SiteContent, SiteConfig } from "./types";

export const contentData: SiteContent = {
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

export const configData: SiteConfig = {
  app: {
    name: "Mi Proyecto",
    theme: "dark",
    language: "es",
  },
  animation: {
    enabled: true,
    duration: 300,
    easing: "ease-in-out",
  },
};

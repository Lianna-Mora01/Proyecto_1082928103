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

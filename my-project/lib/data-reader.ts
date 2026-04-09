import type { SiteContent, SiteConfig } from "./types";
import contentData from "@/data/content.json";
import configData from "@/data/config.json";

export function getContent(): SiteContent {
  return contentData as SiteContent;
}

export function getConfig(): SiteConfig {
  return configData as SiteConfig;
}

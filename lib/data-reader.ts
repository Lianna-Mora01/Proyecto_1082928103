import type { SiteContent, SiteConfig } from "./types";
import { contentData, configData } from "./content-data";

export function getContent(): SiteContent {
  return contentData;
}

export function getConfig(): SiteConfig {
  return configData;
}

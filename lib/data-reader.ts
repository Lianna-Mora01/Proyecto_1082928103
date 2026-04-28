// Legacy data reader - mantiene compatibilidad con componentes antiguos
// CampusZen usa dataService.ts en su lugar

import { contentData, configData } from "./content-data";

export function getContent() {
  return contentData;
}

export function getConfig() {
  return configData;
}

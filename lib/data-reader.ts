import { readFileSync } from "fs";
import { join } from "path";
import type { SiteContent, SiteConfig } from "./types";

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = join(DATA_DIR, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getContent(): SiteContent {
  return readJson<SiteContent>("content.json");
}

export function getConfig(): SiteConfig {
  return readJson<SiteConfig>("config.json");
}

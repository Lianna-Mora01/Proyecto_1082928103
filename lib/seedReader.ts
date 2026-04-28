// lib/seedReader.ts
// Lector de datos semilla desde data/*.json
// Solo se usa en modo seed (antes del bootstrap)

import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from './types';

interface SeedData {
  users?: Array<User & { password_hash: string }>;
}

async function readSeedFile(filename: string): Promise<Record<string, unknown>> {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read seed file ${filename}:`, error);
    return {};
  }
}

export async function getSeedData(): Promise<SeedData> {
  const seedJson = await readSeedFile('seed.json');
  return seedJson as SeedData;
}

export async function getSeedUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const data = await getSeedData();
  if (!data.users) return null;
  return data.users.find((u) => u.email === email) || null;
}

export async function getSeedConfig(): Promise<Record<string, unknown>> {
  return readSeedFile('config.json');
}

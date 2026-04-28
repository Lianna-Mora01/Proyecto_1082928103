// lib/blobAudit.ts
// Persistencia de auditoría en Vercel Blob con write-locking

import { put, get } from '@vercel/blob';
import { AuditEntry } from './types';

const _fileLocks = new Map<string, Promise<unknown>>();

/**
 * Ejecuta una función con lock exclusivo en un archivo
 * Previene race conditions en escrituras al mismo archivo desde múltiples instancias
 */
async function withFileLock<T>(filename: string, fn: () => Promise<T>): Promise<T> {
  const prev = _fileLocks.get(filename) ?? Promise.resolve();
  let resolve!: () => void;
  const lock = new Promise<void>((r) => {
    resolve = r;
  });
  _fileLocks.set(filename, lock);
  try {
    await prev;
    return await fn();
  } finally {
    resolve();
    if (_fileLocks.get(filename) === lock) _fileLocks.delete(filename);
  }
}

/**
 * Obtiene el token de Blob de forma lazy
 * NUNCA como constante de módulo (no existe en build time)
 */
function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function readAuditFile(filename: string): Promise<AuditEntry[]> {
  const token = getBlobToken();
  if (!token) return [];
  try {
    // IMPORTANTE: usar get() del SDK, NUNCA fetch(url)
    // Los blobs privados fallan silenciosamente con fetch
    const result = await get(filename, { token, access: 'private' });
    if (!result || result.statusCode !== 200) return [];
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as AuditEntry[];
  } catch {
    return [];
  }
}

async function writeAuditFile(filename: string, entries: AuditEntry[]): Promise<void> {
  const token = getBlobToken();
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  await put(filename, JSON.stringify(entries, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

/**
 * Registra una entrada de auditoría
 * Se serializa para evitar race conditions (withFileLock)
 */
export async function appendAudit(entry: AuditEntry): Promise<void> {
  try {
    const yyyymm = entry.timestamp.slice(0, 7).replace('-', '');
    const filename = `audit/${yyyymm}.json`;

    await withFileLock(filename, async () => {
      const existing = await readAuditFile(filename);
      existing.push(entry);
      await writeAuditFile(filename, existing);
    });
  } catch (error) {
    // Auditoría falla silenciosamente — no debe romper la operación principal
    console.error('Audit append failed:', error);
  }
}

/**
 * Lee todas las entradas de auditoría de un mes
 */
export async function readAuditMonth(yyyymm: string): Promise<AuditEntry[]> {
  try {
    const filename = `audit/${yyyymm}.json`;
    return await readAuditFile(filename);
  } catch (error) {
    console.error('Audit read failed:', error);
    return [];
  }
}

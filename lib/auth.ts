// lib/auth.ts
// Funciones de autenticación: hash, JWT, cookies

import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { JWTPayload } from './types';

const SESSION_COOKIE_NAME = 'campuszen_session';
const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 horas en segundos

/**
 * Retorna la clave de firma JWT
 * Debe estar configurada en .env.local o Vercel
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET debe estar configurado con mínimo 32 caracteres en .env.local'
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Hashea una contraseña con bcrypt (10 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifica una contraseña contra su hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Crea un JWT con el payload
 * Válido por 24 horas
 */
export async function createJWT(payload: JWTPayload): Promise<string> {
  const secret = getJWTSecret();
  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN)
    .sign(secret);
  return token;
}

/**
 * Verifica y decodifica un JWT
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJWTSecret();
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Obtiene el token JWT de la cookie de sesión
 */
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Establece la cookie de sesión con el JWT
 * HttpOnly, Secure (en producción), SameSite=Strict
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: JWT_EXPIRES_IN,
    path: '/',
  });
}

/**
 * Limpia la cookie de sesión
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

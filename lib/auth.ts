import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'presensi_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 jam

type SessionPayload = {
  username: string;
  role: string;
  exp: number;
};

const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }

  return secret;
};

const encodeBase64Url = (value: string) => Buffer.from(value).toString('base64url');
const decodeBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const createSignature = (value: string) =>
  createHmac('sha256', getSessionSecret()).update(value).digest('base64url');

export const createSessionToken = (username: string, role: string) => {
  const payload: SessionPayload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const payloadEncoded = encodeBase64Url(JSON.stringify(payload));
  const signature = createSignature(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
};

export const verifySessionToken = (token?: string | null) => {
  if (!token) return null;

  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) return null;

  const expectedSignature = createSignature(payloadEncoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length) return null;

  const isValidSignature = timingSafeEqual(signatureBuffer, expectedBuffer);
  if (!isValidSignature) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(payloadEncoded)) as SessionPayload;
    if (!payload.username || !payload.role || typeof payload.exp !== 'number') {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { username: payload.username, role: payload.role };
  } catch {
    return null;
  }
};

export const getSessionFromCookies = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
};

export const setSessionCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const clearSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  });
};

import { createHmac } from 'crypto';

const SECRET = process.env.STREAM_TOKEN_SECRET || 'motionmint-stream-secret-change-me';
const TOKEN_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface StreamTokenPayload {
  wallet: string;
  templateId: string;
  resolution: string;
  exp: number;
}

export function createStreamToken(wallet: string, templateId: string, resolution: string): string {
  const payload: StreamTokenPayload = {
    wallet: wallet.toLowerCase(),
    templateId,
    resolution,
    exp: Date.now() + TOKEN_TTL,
  };
  const data = JSON.stringify(payload);
  const b64 = Buffer.from(data).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyStreamToken(token: string): StreamTokenPayload | null {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;

  const expectedSig = createHmac('sha256', SECRET).update(b64).digest('base64url');
  if (sig !== expectedSig) return null;

  try {
    const payload: StreamTokenPayload = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

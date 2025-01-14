import crypto from 'crypto';

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substr(0, 128);
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

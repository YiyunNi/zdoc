import crypto from 'crypto';

// AES-256-GCM with HKDF-SHA256-derived subkeys.
//
// The KEK (key-encryption key) is the existing ADMIN_SESSION_SECRET env var,
// validated at startup in server.ts. Per-call subkeys are derived via HKDF
// using a caller-supplied `info` string for domain separation: the same KEK
// produces independent keys for "provider-profile" vs "oauth-profile" etc.,
// so a ciphertext from one domain cannot be decrypted in another.

const SALT = Buffer.from('chat-proxy/crypto/v1');
const KEY_LEN = 32;   // AES-256 → 32-byte key
const IV_LEN = 12;    // GCM standard 96-bit IV
const TAG_LEN = 16;   // GCM 128-bit auth tag

export interface EncryptedPayload {
  iv: string;          // base64
  tag: string;         // base64
  ciphertext: string;  // base64
}

function getIkm(): Buffer {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('ADMIN_SESSION_SECRET is not set; cannot derive encryption key');
  }
  return Buffer.from(secret, 'utf8');
}

function deriveKey(info: string): Buffer {
  const ikm = getIkm();
  // hkdfSync returns an ArrayBuffer; wrap it in a Buffer for crypto APIs.
  const derived = crypto.hkdfSync('sha256', ikm, SALT, Buffer.from(info, 'utf8'), KEY_LEN);
  return Buffer.from(derived);
}

export function encryptSecret(plaintext: string, info: string): EncryptedPayload {
  const key = deriveKey(info);
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}

export function decryptSecret(payload: EncryptedPayload, info: string): string {
  const key = deriveKey(info);
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');

  if (iv.length !== IV_LEN) {
    throw new Error('Invalid IV length');
  }
  if (tag.length !== TAG_LEN) {
    throw new Error('Invalid auth tag length');
  }

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

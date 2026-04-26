import {describe, it, expect} from 'vitest';
import {encryptSecret, decryptSecret} from './crypto.js';

const INFO_A = 'chat-proxy:provider-profile:v1';
const INFO_B = 'chat-proxy:oauth-profile:v1';

describe('encryptSecret / decryptSecret', () => {
  it('round-trips a short plaintext', () => {
    const plaintext = 'sk-test';
    const encrypted = encryptSecret(plaintext, INFO_A);
    expect(decryptSecret(encrypted, INFO_A)).toBe(plaintext);
  });

  it('round-trips a long plaintext (200 chars)', () => {
    const plaintext = 'x'.repeat(200);
    const encrypted = encryptSecret(plaintext, INFO_A);
    expect(decryptSecret(encrypted, INFO_A)).toBe(plaintext);
  });

  it('round-trips multibyte UTF-8 plaintext', () => {
    const plaintext = '密钥-✓-secret';
    const encrypted = encryptSecret(plaintext, INFO_A);
    expect(decryptSecret(encrypted, INFO_A)).toBe(plaintext);
  });

  it('produces a unique IV and ciphertext on each call for the same input', () => {
    const plaintext = 'sk-test';
    const a = encryptSecret(plaintext, INFO_A);
    const b = encryptSecret(plaintext, INFO_A);
    expect(a.iv).not.toBe(b.iv);
    expect(a.ciphertext).not.toBe(b.ciphertext);
    // Both still decrypt back to the original.
    expect(decryptSecret(a, INFO_A)).toBe(plaintext);
    expect(decryptSecret(b, INFO_A)).toBe(plaintext);
  });

  it('returns base64-encoded fields of the expected lengths', () => {
    const encrypted = encryptSecret('sk-test', INFO_A);
    // 12-byte IV → 16 base64 chars; 16-byte tag → 24 base64 chars.
    expect(Buffer.from(encrypted.iv, 'base64')).toHaveLength(12);
    expect(Buffer.from(encrypted.tag, 'base64')).toHaveLength(16);
    expect(Buffer.from(encrypted.ciphertext, 'base64').length).toBeGreaterThan(0);
  });

  describe('tampering is rejected', () => {
    function flipFirstByte(b64: string): string {
      const buf = Buffer.from(b64, 'base64');
      buf[0] = buf[0] ^ 0x01;
      return buf.toString('base64');
    }

    it('throws when ciphertext is tampered', () => {
      const encrypted = encryptSecret('sk-test', INFO_A);
      const tampered = {...encrypted, ciphertext: flipFirstByte(encrypted.ciphertext)};
      expect(() => decryptSecret(tampered, INFO_A)).toThrow();
    });

    it('throws when iv is tampered', () => {
      const encrypted = encryptSecret('sk-test', INFO_A);
      const tampered = {...encrypted, iv: flipFirstByte(encrypted.iv)};
      expect(() => decryptSecret(tampered, INFO_A)).toThrow();
    });

    it('throws when tag is tampered', () => {
      const encrypted = encryptSecret('sk-test', INFO_A);
      const tampered = {...encrypted, tag: flipFirstByte(encrypted.tag)};
      expect(() => decryptSecret(tampered, INFO_A)).toThrow();
    });
  });

  it('refuses to decrypt with a different info string (cross-domain isolation)', () => {
    const encrypted = encryptSecret('sk-test', INFO_A);
    expect(() => decryptSecret(encrypted, INFO_B)).toThrow();
  });

  it('throws clearly when ADMIN_SESSION_SECRET is missing', () => {
    const original = process.env.ADMIN_SESSION_SECRET;
    delete process.env.ADMIN_SESSION_SECRET;
    try {
      expect(() => encryptSecret('sk-test', INFO_A)).toThrow(/ADMIN_SESSION_SECRET/);
      expect(() =>
        decryptSecret({iv: '', tag: '', ciphertext: ''}, INFO_A),
      ).toThrow(/ADMIN_SESSION_SECRET/);
    } finally {
      if (original !== undefined) {
        process.env.ADMIN_SESSION_SECRET = original;
      }
    }
  });

  it('throws clearly when ADMIN_SESSION_SECRET is empty', () => {
    const original = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = '';
    try {
      expect(() => encryptSecret('sk-test', INFO_A)).toThrow(/ADMIN_SESSION_SECRET/);
    } finally {
      if (original !== undefined) {
        process.env.ADMIN_SESSION_SECRET = original;
      } else {
        delete process.env.ADMIN_SESSION_SECRET;
      }
    }
  });
});

import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

// Application-level encryption for sensitive fields (gift-card codes, wallet
// addresses). AES-256-GCM with a 256-bit key from ENCRYPTION_KEY (base64).
// Format: v1:<iv b64>:<authTag b64>:<ciphertext b64>

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) throw new Error("ENCRYPTION_KEY is not set");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (base64-encoded)");
  }
  return key;
}

export function encryptSecret(plain: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64"),
    tag.toString("base64"),
    enc.toString("base64"),
  ].join(":");
}

/** Decrypt a blob produced by encryptSecret. Returns null if it can't. */
export function decryptSecret(blob: string | null | undefined): string | null {
  if (!blob) return null;
  try {
    const [v, ivb, tagb, encb] = blob.split(":");
    if (v !== "v1") return null;
    const key = getKey();
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(ivb, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagb, "base64"));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(encb, "base64")),
      decipher.final(),
    ]);
    return dec.toString("utf8");
  } catch (e) {
    console.error("decryptSecret failed:", e);
    return null;
  }
}

export const isEncryptionConfigured = () => !!process.env.ENCRYPTION_KEY;

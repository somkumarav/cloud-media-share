import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key not found");
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key not found");
  }
  const iv = Buffer.from(text.slice(0, 32), "hex");
  const encryptedText = Buffer.from(text.slice(32), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export const generateEncryptedId = (id: string | number): string => {
  try {
    return encrypt(id.toString());
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Invalid ID for encryption");
  }
};

export const getDecryptedId = (encryptedId: string): number => {
  try {
    return Number(decrypt(encryptedId));
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Invalid encrypted ID");
  }
};

import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; // 32 characters
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text: string): string {
    // Create a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create a cipher using AES-256-CBC
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY),
        iv
    );

    // Encrypt the text
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return IV and encrypted data as a combined string
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
    // Split the IV and encrypted text
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");

    // Create a decipher
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY),
        iv
    );

    // Decrypt the text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

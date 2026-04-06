import crypto from "crypto";

export class CryptoUtils {
  private static readonly algorithm = "aes-256-cbc";
  private static readonly key = Buffer.from(
    process.env.ENCRYPTION_KEY!,
    "utf8",
  );
  private static readonly iv = Buffer.from(process.env.ENCRYPTION_IV!, "utf8");

  static encrypt(plainText: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(plainText, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  static decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

import CryptoJS from "crypto-js";

// 加密密钥 - 在生产环境中应该从环境变量获取
const SECRET_KEY = process.env.SECRET_KEY!;

/**
 * AES加密
 * @param text 要加密的明文
 * @returns 加密后的密文
 */
export function encryptPassword(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    return encrypted;
}

/**
 * AES解密
 * @param encryptedText 要解密的密文
 * @returns 解密后的明文
 */
export function decryptPassword(encryptedText: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 生成随机盐值（可选，用于增强安全性）
 */
export function generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

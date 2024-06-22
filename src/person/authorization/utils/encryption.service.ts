import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
export class EncryptService {
  private readonly algorithm = process.env.ENCRYPTION_ALGORITHM;
  private readonly password = process.env.ENCRYPTION_PASSWORD;

  async encryptData(data: string, staticIV: boolean = false): Promise<string> {
    const iv = staticIV
      ? Buffer.from('381040530284'.padEnd(16, '0'))
      : randomBytes(16);
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv(this.algorithm, key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
  }

  async decryptData(encryptedData: string): Promise<string> {
    const [ivHex, encryptedTextHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedTextHex, 'hex');

    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv(this.algorithm, key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }
}

import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const key = process.env.DB_ENCRYPTION_KEY;
if (!key) {
    throw new Error('Missing DB_ENCRYPTION_KEY');
}

const algorithm = 'aes-256-ctr';
const iv = Buffer.alloc(16, 0);
const secret = crypto.createHash('sha256').update(key).digest();

export function encrypt(text) {
    return crypto
        .createCipheriv(algorithm, secret, iv)
        .update(text, 'utf8', 'hex');
}

export function decrypt(enc) {
    return     crypto
        .createDecipheriv(
            'aes-256-ctr',
            crypto.createHash('sha256').update(key).digest(),
            Buffer.alloc(16, 0),
        )
        .update(enc, 'hex', 'utf8');
}

import { createHash } from 'crypto';

export function randomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function hash(str: string) {
    return createHash('md5').update(str).digest('hex');
}

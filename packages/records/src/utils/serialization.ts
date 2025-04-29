export function safeSerialize(obj: any, depth: number = 3): any {
    if (depth <= 0) {
        return 'MAX_DEPTH_REACHED';
    }

    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            if (typeof obj[key] === 'function') {
                result[key] = 'FUNCTION';
            } else if (obj[key] instanceof Date) {
                result[key] = obj[key].toISOString();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = safeSerialize(obj[key], depth - 1);
            } else if (typeof obj[key] === 'string') {
                result[key] = obj[key];
            } else if (Array.isArray(obj[key])) {
                result[key] = obj[key].map((item: any) => safeSerialize(item, depth - 1));
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }

    if (Array.isArray(obj)) {
        return obj.map((item: any) => safeSerialize(item, depth - 1));
    }

    return obj;
}

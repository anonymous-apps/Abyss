export function safeSerialize(obj: any, depth = 100, seen: Set<any> = new Set()): any {
    if (depth <= 0) {
        return 'MAX_DEPTH_REACHED';
    }

    // Handle primitive types directly
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Check for circular references
    if (seen.has(obj)) {
        return 'RECURSIVE_BREAK';
    }

    // Add current object to seen set
    seen.add(obj);

    if (Array.isArray(obj)) {
        const result = obj.map((item: any) => safeSerialize(item, depth - 1, seen));
        return result;
    }

    if (obj instanceof Date) {
        return obj.toISOString();
    }

    const result: any = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (typeof value === 'function') {
            result[key] = 'FUNCTION';
        } else if (value instanceof Date) {
            result[key] = value.toISOString();
        } else if (typeof value === 'object' && value !== null) {
            result[key] = safeSerialize(value, depth - 1, seen);
        } else {
            result[key] = value;
        }
    }

    return result;
}

export class StreamTextError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StreamTextError';
    }
}

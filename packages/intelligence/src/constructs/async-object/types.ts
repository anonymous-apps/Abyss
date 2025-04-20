export interface AsyncObjectProps<T> {
    initialData?: T;
}

export interface AsyncObjectSubscriber<T> {
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
}

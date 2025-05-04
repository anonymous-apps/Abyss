export interface Migration {
    from: string;
    to: string;
    queries: string[];
}

export class EventValidator {
    public readonly events: unknown[] = [];
    public get consume() {
        return (event: unknown) => {
            this.events.push(event);
        };
    }
    public get consumeDatabaseEvent() {
        return () => {
            this.events.push('database_event');
        };
    }
    public get consumeTableEvent() {
        return () => {
            this.events.push('table_event');
        };
    }
    public get consumeRecordEvent() {
        return () => {
            this.events.push('record_event');
        };
    }
    public clear() {
        this.events.length = 0;
    }
}

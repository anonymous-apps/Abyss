import { Database } from '../main';

export const CaptureMetric = {
    ApplicationOpened() {
        Database.table.metric.create({
            name: 'application-opened',
            value: 1,
        });
    },
    async SqliteSize() {
        const size = await Database.workflows.CalculateSqliteSize();
        Database.table.metric.create({
            name: 'sqlite-size',
            value: size,
        });
    },
};

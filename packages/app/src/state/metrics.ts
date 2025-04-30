import { Database } from '../main';

export const CaptureMetric = {
    ApplicationOpened() {
        Database.table.metric.create({
            name: 'application-opened',
            value: 1,
            dimensions: {},
        });
    },
};

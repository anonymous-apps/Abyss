import { Database } from '../main';

export const CaptureMetric = {
    ApplicationOpened() {
        Database.tables.metric.create({
            name: 'application-opened',
            value: 1,
            dimensionData: {},
        });
    },
};

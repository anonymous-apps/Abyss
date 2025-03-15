import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface JobsRecord extends BaseRecord {
    name: string;
    type: string;
    status: string;
    textLogId?: string;
}

class _JobsController extends BaseDatabaseConnection<JobsRecord> {
    constructor() {
        super('jobs', 'Jobs to track work in the system');
    }
}

export const JobsController = new _JobsController();

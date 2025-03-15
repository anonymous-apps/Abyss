import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface NetworkCallRecord extends BaseRecord {
    endpoint: string;
    method: string;
    body: string;
    response: string;
    status: string;
}

class _NetworkCallController extends BaseDatabaseConnection<NetworkCallRecord> {
    constructor() {
        super('networkCall', 'Records of network API calls with request and response data');
    }
}

export const NetworkCallController = new _NetworkCallController();

import * as fs from 'fs';
import * as path from 'path';

let currentTestName = '';

beforeEach(() => {
    const testPath = expect.getState().testPath ?? expect.getState().currentTestName ?? 'test';
    currentTestName =
        expect
            .getState()
            .currentTestName?.replace(/[^a-z0-9]/gi, '_')
            .toLowerCase() ?? 'unnamed_test';

    // Create snapshots directory if it doesn't exist
    const snapshotDir = path.join(path.dirname(testPath), '__snapshots__');
    if (!fs.existsSync(snapshotDir)) {
        fs.mkdirSync(snapshotDir, { recursive: true });
    }
});

export function snapshot(data: any) {
    const testPath = expect.getState().testPath ?? expect.getState().currentTestName ?? 'test';
    const snapshotDir = path.join(path.dirname(testPath), '__snapshots__');
    const snapshotPath = path.join(snapshotDir, `${currentTestName}.snap`);

    const serializedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    fs.writeFileSync(snapshotPath, serializedData, 'utf8');
}

describe('snapshot', () => {
    it('should create and compare snapshots', () => {
        const testData = {
            name: 'test',
            value: 123,
        };

        snapshot(testData);
    });

    it('should handle string data', () => {
        snapshot('simple string test');
    });
});

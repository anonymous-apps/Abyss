import { DataInterface } from '../data-interface';
import { DatabaseObject } from '../data-interface.types';
import { Thread } from '../thread/thread';
import { invokeProviderAgainstThread } from './operations/invokeProviderOnThread';
import { IntelligenceProps } from './types';

export class Intelligence<T extends IntelligenceProps = IntelligenceProps> extends DatabaseObject {
    public readonly props: T;

    public static async new(db: DataInterface, props: IntelligenceProps): Promise<Intelligence> {
        const aiProvider = new Intelligence(db, props);
        await db.saveIntelligence(aiProvider);
        return aiProvider;
    }

    public static async fromId(db: DataInterface, id: string): Promise<Intelligence> {
        const aiProvider = await db.loadIntelligence(id);
        return aiProvider;
    }

    private constructor(db: DataInterface, props: T) {
        super('intelligence', db, props.id);
        this.props = props;
    }

    async invokeAgainstThread(thread: Thread): Promise<any> {
        return invokeProviderAgainstThread(this, thread);
    }
}

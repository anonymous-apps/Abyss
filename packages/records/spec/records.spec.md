# Specification: Records

Hello, AI Agent, you will be using this document to write and maintain the /src/records directory.
Below you will find details on exactly how to strure this directory.

YOU MUST do exactly the following if you are reading this file. THIS IS YOUR PRIMARY GOAL.

1. Run a "git diff" on this file to see what the user has changed, if you dont do this, how can you know what to update?
2. Open a few of the existing files in /records and make sure you understand the existing structure.
3. If there are no changes from git diff, do nothing, if there are changes to this document plan to update the /src/records directory to match the changes exactly. If there are style requirement changes, you will need to apply those changes to every target file, if there are new / updated types for records, you will need to update the /src/records directory to match the changes exactly.
4. Before you begin, set out a plan. For this, create a new file called ./plan.md which is a checklist of each change you need to make. Use this file to track your progress. There may be multiple changes to make, so make sure to check the plan.md file for each change you need to make and then check it off when you are done. If you find out there are more changes, add them to the list. Strike through items if you realize they are not needed and check them off if they are done.
5. Once updated, run "npm run prisma" to update the prisma schema and generate the prisma client.

## Record Types

Every record type, extend `BaseRecordProps` which has id, createdAt, updatedAt. Below defines only the properties of the record.

### textDocument

```ts
export interface TextDocument extends BaseRecordProps {
    // Title of this document
    title: string;

    // Type of this document, for now it can only be "markdown"
    type: 'markdown';

    // Raw content of this document
    content: string;

    // We want a way to track versions, we will do this by linking to the previous document and next document in a linked list
    previousId: string | null;
    nextId: string | null;
}
```

### modelConnection

```ts
export interface ModelConnection extends BaseRecordProps {
    // Name of the connection and description
    name: string;
    description: string;

    // Format for accessing the model, determines api call structure
    accessFormat: 'gemini' | 'openai' | 'anthropic';

    // ID of the provider and model
    providerId: string;
    modelId: string;

    // Additional data for the connection stored as JSON
    data: any;
}
```

### messageThread

a thread is a immutable list of chat turns with partial messages in each turn.

```ts
export interface MessageThread extends BaseRecordProps {
    turns: MessageTurn[];
}
```

Each turn has a senderId and a list of partial messages.

```ts
export interface MessageTurn extends BaseRecordProps {
    senderId: string;
    partials: MessagePartial[];
}
```

Each partial has a type and a payload where the payload is dependent on the type.

```ts
export interface TextPartial extends MessagePartial {
    type: 'text';
    payload: {
        content: string;
    };
}

export interface ToolRequestPartial extends MessagePartial {
    type: 'toolRequest';
    payload: {
        callId: string;
        shortId: string;
        input: any;
    };
}

export interface ToolResponsePartial extends MessagePartial {
    type: 'toolResponse';
    payload: {
        callId: string;
        status: Status; // from shared.type.ts
        output: string;
    };
}

export type MessagePartial = TextPartial | ToolRequestPartial | ToolResponsePartial;
```

The MessageThread.ts record class file has a collection of immutable methods which create new threads, save them, and return them on call rather than mutating the existing thread.

Methods like:

-   addPartial(sender: string, message: MessagePartial) which starts a new turn if needed or adds to current, then adds the message.

### chatThread

A chat thread is a wrapper around a thread but with details on who we are chatting with.

```ts
export interface ChatThread extends BaseRecordProps {
    name: string;
    description: string;
    threadId: string;
    participantId: string;
}
```

### agentGraph

An agent graph is a graph of an agent and their connections.

```ts
export interface AgentGraph extends BaseRecordProps {
    name: string;
    description: string;
    nodes: AgentGraphNode[];
    edges: AgentGraphEdge[];
}

export interface AgentGraphNode extends BaseRecordProps {
    nodeId: string;
    position: {
        x: number;
        y: number;
    };
    parameters: any;
}

export interface AgentGraphEdge extends BaseRecordProps {
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
}
```

### agentGraphExecution

An agent graph execution is a record of a previous agent graph execution.

```ts
export interface AgentGraphExecution extends BaseRecordProps {
    agentGraphId: string;
    status: Status; // from shared.type.ts
    events: Json; // array of events
    startTime: Date;
    endTime: Date;
}
```

### metric

A metric is a record of a numerical measurement with optional dimensions.

```ts
export interface Metric extends BaseRecordProps {
    name: string;
    dimensions: Record<string, string>;
    value: number;
}
```

### settings

A settings is a record of a set of key value pairs.

```ts
export interface Settings extends BaseRecordProps {
    lastPage: string;
    theme: string;
}
```

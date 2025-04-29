# Specification: Records

Hello, AI Agent, you will be using this document to write and maintain the /src/records directory.
Below you will find details on exactly how to strure this directory.

YOU MUST do exactly the following if you are reading this file. THIS IS YOUR PRIMARY GOAL.

1. Run a "git diff" on this file to see what the user has changed
2. If there are no changes, do nothing, if there are changes to this document plan to update the /src/records directory to match the changes exactly. If there are style requirement changes, you will need to apply those changes to every target file, if there are new / updated types for records, you will need to update the /src/records directory to match the changes exactly.
3. Before you begin, set out a plan. For this, create a new file called ./plan.md which is a checklist of each change you need to make. Use this file to track your progress. There may be multiple changes to make, so make sure to check the plan.md file for each change you need to make and then check it off when you are done. If you find out there are more changes, add them to the list. Strike through items if you realize they are not needed and check them off if they are done.
4. Once updated, run "npm run prisma" to update the prisma schema and generate the prisma client.

## Style and structure

/src/records/recordController.ts

-   Exposes a base set of methods that are common to all records.
-   Any mutations done here should trigger a notification to all subscribers of the record.

/src/records/[record]/[record].controller.ts

```ts
export class XXXController extends RecordController<XXXXX> {
```

-   Extends the base record controller with table-specific methods.
-   Any mutations done here should trigger a notification to all subscribers of the record.
-   Ideally this has NO methods. For almost every case, the base controller should be sufficient.
-   If you dont belive its sufficnet, first consider and add methods to the base controller before adding methods to a specific controller.

/src/records/[record]/[record].type.ts

-   Defines the typescript type for the record.
-   This type should be exported for use in other files.
-   Should match the prisma schema exactly.

/src/records/[record]/[record].document.prisma

-   Contains the prisma schema for the record.
-   Should be exactly the same as the typescript type.
-   This will be joined together into a larger schema automatically.
-   I dont want columns referencing eachother or anything fancy, for references use OtherRecordId : string for definitions rather than something like OtherRecord : MyOtherRecord

If you are adding a new record type, please add it to the /src/prisma.type.ts file so that the table references are updated. You may get type errors until you do this. Table names are all lowercase camelCase.

/src/records/[record]/[record].ts

-   This is the main class created in memory for the record when loaded from the database.
-   It should extend RecordClass<RecordType> and have public properties for each column in the record outside of the shared base properties.
-   It should make use of inherited methods, ideally NO new methods are added here.
-   Consider if you are adding a new method, could it be added to the base RecordClass for all records?

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

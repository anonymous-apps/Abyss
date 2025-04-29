# Specification: Records

Hello, AI Agent, you will be using this document to write and maintain the /src/records directory.
Below you will find details on exactly how to strure this directory.

Plesea do exactly the following if you are reading this file:

1. Run a "git diff" on this file to see what the user has changed
2. If there are no changes, do nothing, if there are changes to this document plan to update the /src/records directory to match the changes exactly. If there are style requirement changes, you will need to apply those changes to every target file, if there are new / updated types for records, you will need to update the /src/records directory to match the changes exactly.
3. Before you begin, set out a plan. For this, create a new file called ./plan.md which is a checklist of each change you need to make. Use this file to track your progress. There may be multiple changes to make, so make sure to check the plan.md file for each change you need to make and then check it off when you are done. If you find out there are more changes, add them to the list. Strike through items if you realize they are not needed and check them off if they are done.
4. Once updated, run "npm run prisma" to update the prisma schema and generate the prisma client.
5. Finally, run "git commit -am " with a message that describes the changes you made as your final task.

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

## Record Types

Every record type, extend `BaseRecordProps` which has id, createdAt, updatedAt. Below defines only the properties of the record.

### document

```ts
export interface Document extends BaseRecordProps {
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

# Prisma Database Design

The goal of this project is to be a hub for all AI related interactions. That includes mostly connecting to and talking to AI models and agents. Tool use. Monitoring. All Stored locally.

This document details the schema of the database needed to achieve this. It will use typscript snippets to define the schema but the source of truth will be the schema.prisma file written in prisma schema language.

## Design details

We will use a SQLITE database managed by Prisma.
Every record will have an auto-generated uuid (id), a createdAt timestamp, and an updatedAt timestamp.
All records also have an map of references to other records they can set as needed.

```ts
interface Record {
    id: string;

    references: Record<string, string>;

    createdAt: Date;
    updatedAt: Date;
}
```

If the record is user managed, we can add name and description fields to it.

```ts
interface UserManagedRecord extends Record {
    name: string;
    description: string;
}
```

## System level requirements

```ts
interface Table_UserSettings extends Record {
    // Whether the sidebar is open
    sidebarOpen: boolean;

    // The last page the user was on so we can redirect them to the same page on next open
    lastPage: string;

    // The theme the user has selected
    theme: string;

    // Whether the user has bootstrapped the application
    bootstrapped: boolean;
}
```

## Metrics and Monitoring:

We want to be able to track metrics and data over the course of time. These are constants consumed elsewhere by other system for viewing.

```ts
interface Table_Metric extends Record {
    // The name of the metric
    name: string;

    // The dimensions of the metric, key-value pairs to group the metric by
    dimensions: Record<string, string>;

    // The value of the metric
    value: number;
}
```

```ts
interface Table_TextLog extends Record {
    // The text of the log entry
    text: string;
}
```

```ts
interface Table_NetworkCall extends Record {
    // The url of the network call
    endpoint: string;

    // The method of the network call
    method: string;

    // The body of the network call
    body: string;

    // The response of the network call
    response: string;

    // Status of the API call (success, error, etc)
    status: string;
}
```

## Jobs:

Jobs are a way to track work in the system

```ts
interface Table_Jobs extends Record {
    // The name of the job
    name: string;

    // The type of job, some natural langauge ID
    type: string;

    // The status of the job like pending, running, completed, failed
    status: string;

    // Jobs have output text logs referenced here
    textLogId: string;
}
```

## Connecting to models:

We will be able to connect to a model. Model connections define a connection type so we can map it to a client we run locally. That client might need credentials for it to work.

```ts
interface Table_ModelConnections extends UserManagedRecord {
    // The provider of the model like OPENAI or OLLAMA
    provider: string;

    // The id of the model
    modelId: string;

    // Model type, such as a CHAT model or an IMAGE model ect
    type: string;

    // The data for the model connection as arbitrary json
    data: Record<string, any>;
}
```

Interfacing with a chat model consumes a set of messages and returns new messages.
We can store this as a "MessageThread" which is a collection of messages.

```ts
interface Table_MessageThread extends Record {
    // if there is a job locking the current thread for processing
    lockingJob: string?;
}
```

A message thread is a collection of messages. Each message is independent.

```ts
interface Table_Message extends Record {
    // Thread id this belongs to
    threadId: string;

    // The type of the message like user or chatModel or toolCall or agent
    type: string;

    // The source of the message
    sourceId: string;

    // The content of the message as string
    content: string;
}
```

A rendered conversation thread is a collection of messages that are rendered for a user representing a thread at a given point in time.
This is for debugging and viewing purposes.

```ts
interface Table_RenderedConversationThread extends Record {
    messages: {
        type: string;
        content: string;
    }[];
}
```

## Chats

Users do not directly chat with message threads, there are higher level chat objects which they interact with.

```ts
interface Table_Chat extends UserManagedRecord {
    // The type of the other party in the chat like chatModel
    type: string;

    // The reference for the other party in the chat
    sourceId: string;
}
```

## Agents

Agents are converation targets just like chat models, but they are constructed by the user on top of other models

```ts
interface Table_Agent extends UserManagedRecord {
    // The reference for the chat model
    chatModelId: string;
}
```

```ts
interface Table_AgentToolConnection extends Record {
    // The reference for the agent
    agentId: string;

    // The reference for the tool connection
    toolId: string;

    // The permissions stance for this connection like 'automatic' or 'user-permitted'
    permission: string;
}
```

## Tools

Tools are the building blocks of agents. They represent an action possible to be taken with a set of parameters.

```ts
interface Table_Tool extends UserManagedRecord {
    // The type of the tool like nextJsScript
    type: string;

    // The schema for the tool, arbitrary json that the model must conform to when invoking it
    schema: Record<string, any>;

    // The configuration data for the tool, arbitrary json
    data: Record<string, any>;
}
```

Tool invocations are recorded when they occur

```ts
interface Table_ToolInvocation extends Record {
    // The reference for the tool
    toolId: string;

    // The parameters for the tool
    parameters: Record<string, any>;

    // The result of the tool
    result: Record<string, any>;

    // LogObject
    textLogId: string;

    // The status of the tool invocation like pending, running, completed, failed
    status: string;
}
```

## Streaming

Streams are parsed responses from a language model

```ts
interface Table_ResponseStream extends Record {
    // The source id of the model
    sourceId: string;

    // The result messages
    resultMessages: Message[];

    // The status of the stream
    status: string;

    // The raw output of the stream
    rawOutput: string;
}
```

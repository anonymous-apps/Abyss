# Low Level Constructs

These are the building blocks of the Abyss platform.
They are core building blocks that have stable and rigid interfaces.

## MessageThreads

A message thread is a key construct that builds the basis for how models are interacted with and provide value.
All model interactions are done through message threads, either those shown to the user or not.

```ts
interface MessageThread extends Record {
    lockingId: string;
}
```

Threads are able to be locked so that only one entity can interact with them at any given time.
This prevents race conditions and ensures that the thread is always in a consistent state.

Threads are not just locks though, they own a collection of messages.

```ts
interface MessageThread extends Record {
    messages: Message[];
}
```

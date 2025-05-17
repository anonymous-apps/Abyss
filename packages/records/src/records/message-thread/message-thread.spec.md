# Message Thread Tests
Tests are in ./message-thread.test.ts

describe Message Thread Table Reference 
- when we create a new message thread, we should be able to get a reference to it through table.ref(id)

describe Message Thread Record
- when we have a reference to a message thread, we can get the messages in the thread that we created in the messages table
- when we have a reference to a message thread, we can get all the messages in the thread
- when we have a reference to a message thread, we can get the turns which automatically group messages by sender id
- when we have a reference to a message thread, we can get the active tool definitions in the thread
- when we have a reference to a message thread, we can get the active tool definitions in the thread if there are 0
- when we have a reference to a message thread, we can get the active tool definitions in the thread if we added then removed a tool
- when we have a reference to a message thread, we can get the delta tool definitions in the thread from its current list to the list we want to set it to
- when we have a reference to a message thread, we can get the delta readonly documents in the thread from its current list to the list we want to set it to and that list requires no changes
- when we have a reference to a message thread, we can get the unprocessed tool calls in the thread even if there are no tool calls in the thread
- when we have a reference to a message thread, we can get the unprocessed tool calls in the thread if there are multiple tool calls in the thread
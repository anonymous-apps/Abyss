# Message Thread Tests
Tests are in ./message-thread.test.ts

Useful Utilities:
 - create a thread with text messages
 - create a thread with tools added and removed and some still active
 - create a thread with tools began and some compeletd but some not yet

### Message Thread Table 
 - we can create a message thread directly without any messages
 - we can get a message thread referance by id

### Message Thread Record
 - we can add to a message thread
   - we can add to a message thread with a partial message which create messages in the messages table
   - we can directly pass references to messages in the messages table
 - we can read from the thread
   - we can get all messages
   - we can group messages by sender id in turns
 - we can modify the thread
   - we can set the name
   - we can set the participant id
   - we can block the thread
   - we can unblock the thread
 - we can get metadata computed from the thread
   - we can get the active tool definitions in the thread
    - when there have been no tool definitions added to the thread, we get an empty array
    - when there have been tool definitions added to the thread, then removed, we get an empty array
    - when there are tool definitions that are not removed, we get the tool definitions
   - we can get the delta tool definitions in the thread from its current list to the list we want to set it to
    - when there have been no tool definitions added to the thread, we get the tool definitions we want to set it to
    - when there have been tool definitions added to the thread, then removed, we get the tool definitions we want to set it to
    - when there have are tool definitions we also want to keep, we only get the additional tool definitions that are not already in the thread
    - when there are tool definitions we dont want, we include those in the remove list
   - we can get the delta readonly documents in the thread from its current list to the list we want to set it to
    - when there have been no readonly documents added to the thread, we get the readonly documents we want to set it to
    - when there are readonly documents we also want, we only get the additional readonly documents that are not already in the thread
   - we can get the unprocessed tool calls in the thread
    - when there have been no tool calls added to the thread, we get an empty array
    - when there have been tool calls added to the thread, then completed, we get an empty array
    - when there are tool calls that are not completed, we get the tool calls
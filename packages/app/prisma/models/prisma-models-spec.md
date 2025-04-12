# Prisma Models Specification

## Models Overview

-   **Chat**: Chat instance with name and optional thread reference
-   **Message**: User or assistant message with content and thread association
-   **MessageThread**: Container for messages in a conversation
-   **RenderedConversationThread**: Rendered view of a conversation thread
-   **ResponseStream**: Stream of responses with status tracking
-   **ModelConnections**: Connections to AI models with configuration options
-   **UserSettings**: User preferences and configuration settings
-   **Tool**: Reusable tool with schema and configuration
-   **ToolInvocation**: Record of a tool being used in a conversation
-   **TextLog**: Simple text logging model
-   **Metric**: Performance or usage metrics tracking
-   **Agent**: AI agent with name, description and model reference
-   **AgentToolConnection**: Connection between agents and their available tools

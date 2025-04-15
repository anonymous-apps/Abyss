import { ChatTurn } from '@abyss/intelligence';
import { Button, ButtonGroup } from '@abyss/ui-components';
import { RenderedConversationThread } from '@prisma/client';
import { BrainIcon, User } from 'lucide-react';
import React, { useState } from 'react';

export function CustomRendererForConversationThread({ thread }: { thread: RenderedConversationThread }) {
    const [viewMode, setViewMode] = useState<'raw' | 'system'>('raw');

    if (!thread || !thread.messages) {
        return <></>;
    }

    const messages = JSON.parse(typeof thread.messages === 'string' ? thread.messages : JSON.stringify(thread.messages)) as {
        turns: ChatTurn[];
    };

    return (
        <>
            <div className="flex items-center gap-2 text-xs w-full justify-end">
                <div className="my-4">
                    This record represents a point in time snapshot of what the chat thread was when it was sent to the LLM for handling.
                    'System' renders it as it was through the internal Abyss representation which is model agnostic. Since each model has
                    its own APIs, 'Raw' renders the specific object the API consumed, which varies in structure per provider.
                </div>
                <ButtonGroup>
                    <Button variant="primary" isInactive={viewMode !== 'raw'} onClick={() => setViewMode('raw')}>
                        Raw
                    </Button>
                    <Button variant="primary" isInactive={viewMode !== 'system'} onClick={() => setViewMode('system')}>
                        System
                    </Button>
                </ButtonGroup>
            </div>
            <div className={`${viewMode === 'system' ? 'block' : 'hidden'}`}>
                {messages.turns.map((message, index) => (
                    <div key={index} className="pt-4">
                        <div className="flex items-center text-xs mb-1 gap-2 capitalize">
                            {message.sender === 'user' && <User size={14} className="" />}
                            {message.sender === 'bot' && <BrainIcon size={14} className="" />}
                            {message.sender}
                        </div>
                        <div className="text-sm my-3">
                            {message.partials.map((partial, pIndex) => (
                                <pre key={pIndex} className="whitespace-pre-wrap font-mono border-l-2 pl-2">
                                    {JSON.stringify(partial, null, 2)}
                                </pre>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${viewMode === 'raw' ? 'block' : 'hidden'}`}>
                <JsonView json={thread.rawInput} />
            </div>
        </>
    );
}

function JsonView({ json }: { json: any }) {
    if (!json) return null;

    const CollapsibleNode = ({ path, value, isRoot = false }: { path: string; value: any; isRoot?: boolean }) => {
        const [isCollapsed, setIsCollapsed] = useState(false);
        const isObject = typeof value === 'object' && value !== null;
        const displayPath = path || 'root';

        if (!isObject) {
            return (
                <div className="mb-2">
                    <pre className="text-xs text-gray-500">{displayPath}</pre>
                    <pre className="whitespace-pre-wrap font-mono border-l-2 pl-2">
                        {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                    </pre>
                </div>
            );
        }

        const toggleCollapse = () => setIsCollapsed(!isCollapsed);
        const entries = Object.entries(value);
        const hasChildren = entries.length > 0;

        return (
            <div className={`mb-2 ${isRoot ? '' : 'ml-4 bg-[#00000008] p-2 rounded-md'}`}>
                <div className="flex items-center cursor-pointer" onClick={toggleCollapse}>
                    <span className="mr-2 text-xs">{hasChildren ? (isCollapsed ? '▶' : '▼') : '•'}</span>
                    <pre className="text-xs text-gray-500">{displayPath}</pre>
                    <span className="text-xs ml-2 text-gray-400">
                        {isObject && Array.isArray(value) ? `Array(${entries.length})` : `Object(${entries.length})`}
                    </span>
                </div>

                {!isCollapsed && hasChildren && (
                    <div className="pl-4 border-l border-gray-200">
                        {entries.map(([key, childValue]) => {
                            const currentPath = path ? `${path}.${key}` : key;
                            return <CollapsibleNode key={currentPath} path={currentPath} value={childValue} />;
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-4">
            <CollapsibleNode path="" value={json} isRoot={true} />
        </div>
    );
}

import { RenderedConversationThread } from '@prisma/client';
import { BrainIcon, User } from 'lucide-react';
import React from 'react';
export function CustomRendererForConversationThread({ thread }: { thread: RenderedConversationThread }) {
    if (!thread || !thread.messages) {
        return <></>;
    }

    const messages = JSON.parse(typeof thread.messages === 'string' ? thread.messages : JSON.stringify(thread.messages)) as {
        turns: {
            sender: string;
            partials: {
                type: string;
                content: string;
            }[];
        }[];
    };

    return (
        <>
            <div className="border-t mt-2 border-background-light">
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
                                    {partial.content}
                                </pre>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

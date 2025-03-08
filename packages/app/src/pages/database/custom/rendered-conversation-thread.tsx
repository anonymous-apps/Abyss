import React from 'react';
import { RenderedConversationThread } from '@prisma/client';
import { BotIcon, BrainIcon, User } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

export function CustomRendererForConversationThread({ thread }: { thread: RenderedConversationThread }) {
    if (!thread || !thread.messages) {
        return <></>;
    }

    const messages = thread.messages as { from: string; text: string }[];

    return (
        <>
            <div className="border-t mt-2 border-background-light">
                {messages.map((message, index) => (
                    <div key={index} className="pt-4">
                        <div className="flex items-center text-xs mb-1 gap-2 capitalize">
                            {message.from === 'user' && <User size={14} className="" />}
                            {message.from === 'bot' && <BrainIcon size={14} className="" />}
                            {message.from}
                        </div>
                        <div className="text-sm my-3">
                            <pre className="whitespace-pre-wrap font-mono border-l-2 pl-2">{message.text}</pre>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

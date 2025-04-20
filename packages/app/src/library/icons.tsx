import { Bot, CircleHelp, File } from 'lucide-react';
import React from 'react';
import { Logo } from './logos';

export function ToolIcon({ type }: { type: string }) {
    switch (type.toLowerCase()) {
        case 'build-node-tool':
            return <Bot className="w-4 h-4" />;
        case 'document-writer':
            return <File className="w-4 h-4" />;
        case 'nodejs':
            return <Logo logo="nodejs" className="w-4 h-4" />;
        default:
            return <CircleHelp className="w-4 h-4" />;
    }
}

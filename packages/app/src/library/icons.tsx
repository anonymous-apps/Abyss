import { Bell, Bot, Box, Hammer, LucideIcon, MessageCircleQuestion, User } from 'lucide-react';

export function getIconForSourceType(source: string): LucideIcon {
    switch (source.toLowerCase()) {
        case 'ai':
        case 'chat':
        case 'chatmodel':
            return Box;
        case 'agent':
            return Bot;
        case 'user':
            return User;
        case 'internal':
            return Bell;
        case 'tool':
            return Hammer;
        default:
            return MessageCircleQuestion;
    }
}

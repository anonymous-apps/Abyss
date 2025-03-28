import { Bell, Bot, Box, LucideIcon, MessageCircleQuestion, User } from 'lucide-react';

export function getIconForSourceType(source: string): LucideIcon {
    switch (source.toLowerCase()) {
        case 'chat':
        case 'chatmodel':
            return Box;
        case 'agent':
            return Bot;
        case 'user':
            return User;
        case 'internal':
            return Bell;
        default:
            return MessageCircleQuestion;
    }
}

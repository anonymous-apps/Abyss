import { Bell, Box, LucideIcon, MessageCircleQuestion, User } from 'lucide-react';

export function getIconForSourceType(source: string): LucideIcon {
    switch (source.toLowerCase()) {
        case 'chat':
            return Box;
        case 'user':
            return User;
        case 'internal':
            return Bell;
        default:
            return MessageCircleQuestion;
    }
}

import React from 'react';
import { PageCenter } from '../library/layout/page-center';
import { IconButton } from '../library/input/button';
import { Box, MessageCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MainPage() {
    const navigate = useNavigate();
    return (
        <>
            <PageCenter>
                <img src="/logo.png" alt="logo" className="w-[100px]" />
                <div className="text-3xl font-bold text-primary-base rubik-glitch-regular">Abyss</div>
                <div className="grid grid-cols-2 gap-5 mt-12 w-[400px]">
                    <IconButton className="w-full" icon={Box} label="Models" onClick={() => navigate('/model-connection')} />
                    <IconButton className="w-full" icon={MessageSquare} label="Chats" onClick={() => navigate('/chats')} />
                </div>
            </PageCenter>
        </>
    );
}

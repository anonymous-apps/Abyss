import React from 'react';
import { useOutlet } from 'react-router';
import { Sidebar } from '../library/layout/sidebar';

export function WithSidebar() {
    const outlet = useOutlet();

    return (
        <div className="flex flex-row max-h-[100vh]">
            <Sidebar />
            <div className="w-full h-[100vh] overflow-y-auto">{outlet}</div>
        </div>
    );
}

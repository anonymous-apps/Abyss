import React from 'react';

export const PageCenter = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-col items-center justify-center h-full mt-20">{children}</div>;
};

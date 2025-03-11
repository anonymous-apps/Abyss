import React, { useEffect, useRef } from 'react';

export const HeaderBar = () => {
    const headerRef = useRef<HTMLDivElement>(null);

    const updateScale = () => {
        if (headerRef.current) {
            const zoomLevel = window.devicePixelRatio || 1;
            // Apply an inverse scale transform to counteract browser zoom.
            headerRef.current.style.transform = `scale(${1 / zoomLevel})`;
            // Ensure the transform scales from the top left corner.
            headerRef.current.style.transformOrigin = 'top left';
            // Adjust the width to account for the scale
            headerRef.current.style.width = `${100 * zoomLevel}vw`;
        }
    };

    useEffect(() => {
        updateScale();
        // Listen for window resize events which can indicate a zoom change.
        window.addEventListener('resize', updateScale);
        return () => {
            window.removeEventListener('resize', updateScale);
        };
    }, []);

    return (
        <div
            ref={headerRef}
            className="fixed z-10 top-0 left-0 w-full menuDragSection text-center border-background-light"
            style={{ height: '55px', fontSize: '30px', lineHeight: '55px' }}
        />
    );
};

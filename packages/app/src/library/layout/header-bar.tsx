import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Database } from '../../main';

export const HeaderBar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navigate = useNavigate();
    const headerRef = useRef<HTMLDivElement>(null);

    const updateScale = () => {
        if (headerRef.current) {
            const zoomLevel = window.devicePixelRatio || 1;
            // Apply an inverse scale transform to counteract browser zoom.
            headerRef.current.style.transform = `scale(${1 / zoomLevel})`;
            // Ensure the transform scales from the top left corner.
            headerRef.current.style.transformOrigin = 'top left';
            // Set width to always be 150px in the scaled space
            headerRef.current.style.width = `${150 * zoomLevel}px`;
            headerRef.current.style.height = `${55 * zoomLevel}px`;
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

    const onPopPageHistory = async () => {
        const lastPage = await Database.table.userSettings.popPageHistory();
        if (lastPage) {
            navigate(lastPage);
        }
    };

    return (
        <div
            ref={headerRef}
            className="fixed z-10 top-0 left-0 w-full text-center border-background-100"
            style={{ height: '55px', fontSize: '30px', lineHeight: '55px' }}
        >
            <div className="fixed top-0 left-0 w-[100vw] h-[15px] flex items-center justify-center menuDragSection"></div>
            <div className="absolute bottom-0 left-0 w-full h-full flex items-center justify-center menuDragSection"></div>

            <div className={`absolute text-text-sidebar h-[45%] w-[40%] right-0 flex gap-1 mt-1 px-2 z-10 hidden`}>
                <ChevronLeftIcon className={`h-full w-full rounded-sm opacity-100 hover:bg-primary-100`} onClick={onPopPageHistory} />
                <ChevronRightIcon className={`h-full w-full rounded-sm opacity-20`} />
            </div>
        </div>
    );
};

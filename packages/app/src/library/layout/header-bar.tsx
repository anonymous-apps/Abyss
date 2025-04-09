import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useDatabaseTableSubscription } from '../../state/database-connection';

export const HeaderBar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navigate = useNavigate();
    const headerRef = useRef<HTMLDivElement>(null);
    const userSettings = useDatabaseTableSubscription('UserSettings', async database => database.table.userSettings.get());
    const hasHistory = userSettings.data?.pageHistory?.length;

    const updateScale = () => {
        if (headerRef.current) {
            const zoomLevel = window.devicePixelRatio || 1;
            // Apply an inverse scale transform to counteract browser zoom.
            headerRef.current.style.transform = `scale(${1 / zoomLevel})`;
            // Ensure the transform scales from the top left corner.
            headerRef.current.style.transformOrigin = 'top left';
            // Set width to always be 150px in the scaled space
            headerRef.current.style.width = `${150 * zoomLevel}px`;
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
        if (hasHistory) {
            const lastPage = await Database.table.userSettings.popPageHistory();
            if (lastPage) {
                if (lastPage === location.pathname) {
                    onPopPageHistory();
                } else {
                    navigate(lastPage);
                }
            }
        }
    };

    return (
        <div
            ref={headerRef}
            className="fixed z-10 top-0 left-0 w-full text-center border-background-light"
            style={{ height: '55px', fontSize: '30px', lineHeight: '55px' }}
        >
            <div className="absolute top-0 left-0 right-14 h-full flex items-center justify-center menuDragSection"></div>
            <div className="absolute top-7 left-0 w-full h-10 flex items-center justify-center menuDragSection"></div>

            <div className={`absolute top-[1px] right-0 flex gap-1 mt-1 px-2 z-10 ${isHomePage ? 'hidden' : ''}`}>
                <ChevronLeftIcon
                    className={`w-5 h-5 rounded-sm ${hasHistory ? 'opacity-100 hover:bg-primary-light ' : 'opacity-20'}`}
                    onClick={onPopPageHistory}
                />
                <ChevronRightIcon className={`w-5 h-5 opacity-20`} />
            </div>
        </div>
    );
};

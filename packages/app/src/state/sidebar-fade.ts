import { create } from 'zustand';

interface SidebarFadeState {
    sidebarFadeable: boolean;
    setSidebarFadeable: (value: boolean) => void;
}

export const useSidebarFadeStore = create<SidebarFadeState>(set => ({
    sidebarFadeable: true,
    setSidebarFadeable: (value: boolean) => set({ sidebarFadeable: value }),
}));

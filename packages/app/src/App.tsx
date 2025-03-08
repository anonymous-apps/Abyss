import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { MainPage } from './pages/main';
import { AbyssBackground } from './library/layout/background';
import { HeaderBar } from './library/layout/header-bar';
import { ModelProfileMainPage } from './pages/model-connections/main';
import { ModelProfileCreatePage } from './pages/model-connections/create';
import { ModelProfileViewPage } from './pages/model-connections/view';
import { ChatMainPage } from './pages/chats/main';
import { ChatCreatePage } from './pages/chats/create';
import { ChatViewPage } from './pages/chats/view';
import { ListTablesPage } from './pages/database/list-tables';
import { ViewTablePage } from './pages/database/view-table';
import { ViewTableRecordPage } from './pages/database/view-table-record';
import { SettingsPage } from './pages/settings/main';
import { useDatabaseRecordSubscription, useDatabaseTableSubscription } from './state/database-connection';
import { ActionsPage } from './pages/actions/main';
import { ActionCreatePage } from './pages/actions/create';

export function App() {
    // Apply app theming
    const userSettings = useDatabaseTableSubscription('UserSettings', db => db.table.userSettings.get());
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', userSettings.data?.theme || 'abyss');
    }, [userSettings.data?.theme]);

    return (
        <div className={`${userSettings.data?.theme || 'abyss'} text-text-base`}>
            <HeaderBar />
            <AbyssBackground />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/model-connection" element={<ModelProfileMainPage />} />
                    <Route path="/model-connection/create" element={<ModelProfileCreatePage />} />
                    <Route path="/model-connection/id/:id" element={<ModelProfileViewPage />} />
                    <Route path="/chats" element={<ChatMainPage />}>
                        <Route path="/chats/create" element={<ChatCreatePage />} />
                        <Route path="/chats/id/:id" element={<ChatViewPage />} />
                    </Route>
                    <Route path="/database" element={<ListTablesPage />} />
                    <Route path="/database/id/:id" element={<ViewTablePage />} />
                    <Route path="/database/id/:id/record/:recordId" element={<ViewTableRecordPage />} />
                    <Route path="/actions" element={<ActionsPage />} />
                    <Route path="/actions/create" element={<ActionCreatePage />} />
                    <Route path="*" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

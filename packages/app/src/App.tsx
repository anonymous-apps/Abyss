import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { HeaderBar } from './library/layout/header-bar';
import { ChatCreatePage } from './pages/chats/create';
import { ChatMainPage } from './pages/chats/main';
import { ChatViewPage } from './pages/chats/view';
import { ListTablesPage } from './pages/database/list-tables';
import { ViewTablePage } from './pages/database/view-table';
import { ViewTableRecordPage } from './pages/database/view-table-record';
import { MainPage } from './pages/main';
import { ModelProfileCreatePage } from './pages/model-connections/create';
import { ModelProfileMainPage } from './pages/model-connections/main';
import { ModelProfileViewPage } from './pages/model-connections/view';
import { SettingsPage } from './pages/settings/main';
import { ToolsPage } from './pages/tool/main';
import { ToolViewPage } from './pages/tool/view';
import { useTheme } from './state/theme-state';

export function App() {
    // Listen and apply the theme if it changes
    useTheme();

    return (
        <div>
            <HeaderBar />
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
                    <Route path="/tools" element={<ToolsPage />} />
                    <Route path="/tools/id/:id" element={<ToolViewPage />} />
                    <Route path="*" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

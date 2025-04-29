import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { HeaderBar } from './library/header-bar';
import { MainPage } from './pages/main/main';
import { useTheme } from './state/theme-state';

export function App() {
    // Listen and apply the theme if it changes
    useTheme();

    return (
        <div className="text-text-300">
            <BrowserRouter>
                <HeaderBar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    {/* <Route path="/" element={<WithAppSidebar />}>
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/models" element={<ModelProfileMainPage />} />
                        <Route path="/models/create" element={<ModelProfileCreatePage />} />
                        <Route path="/models/id/:id" element={<ModelProfileViewPage />} />
                        <Route path="/metrics" element={<MetricsPage />} />
                        <Route path="/metrics/graph/:metricName" element={<MetricsChartPage />} />
                        <Route path="/chats" element={<ChatMainPage />}>
                            <Route path="/chats/create" element={<ChatCreatePage />} />
                            <Route path="/chats/id/:id" element={<ChatViewPage />} />
                        </Route>
                        <Route path="/database" element={<ListTablesPage />} />
                        <Route path="/database/id/:id" element={<ViewTablePage />} />
                        <Route path="/database/id/:id/record/:recordId" element={<ViewTableRecordPage />} />
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/tools/id/:id" element={<ToolViewPage />} />
                        <Route path="/agents" element={<AgentsPage />} />
                        <Route path="/agents/id/:id" element={<ViewAgentGraphPage />} />
                        <Route path="/prompts" element={<PromptsPage />} />
                        <Route path="/prompts/create" element={<CreatePromptPage />} />
                        <Route path="/prompts/id/:id" element={<ViewPromptPage />} />
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/documents/id/:id" element={<ViewDocumentPage />} />
                    </Route> */}
                    <Route path="*" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { HeaderBar } from './library/header-bar';
import { AgentsPage } from './pages/agents/agents-page';
import { ViewAgentGraphPage } from './pages/agents/view-agent-graph';
import { ListTablesPage } from './pages/database/database.page';
import { ViewTableRecordPage } from './pages/database/record.page';
import { ViewTablePage } from './pages/database/table.page';
import { MainPage } from './pages/main/main';
import { MetricsChartPage } from './pages/metrics/metrics-chart.page';
import { MetricsPage } from './pages/metrics/metrics.page';
import { ModelProfileCreatePage } from './pages/models/create.page';
import { ModelProfileMainPage } from './pages/models/main.page';
import { ModelProfileViewPage } from './pages/models/view.page';
import { SettingsPage } from './pages/settings/settings.page';
import { WithAppSidebar } from './pages/withSidebar';
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
                    <Route path="/" element={<WithAppSidebar />}>
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/database" element={<ListTablesPage />} />
                        <Route path="/database/id/:id" element={<ViewTablePage />} />
                        <Route path="/database/id/:id/record/:recordId" element={<ViewTableRecordPage />} />
                        <Route path="/metrics" element={<MetricsPage />} />
                        <Route path="/metrics/graph/:metricName" element={<MetricsChartPage />} />
                        <Route path="/models" element={<ModelProfileMainPage />} />
                        <Route path="/models/create" element={<ModelProfileCreatePage />} />
                        <Route path="/models/id/:id" element={<ModelProfileViewPage />} />
                        <Route path="/agents" element={<AgentsPage />} />
                        <Route path="/agents/id/:id" element={<ViewAgentGraphPage />} />
                    </Route>

                    {/* <Route path="/" element={<WithAppSidebar />}>
                        <Route path="/chats" element={<ChatMainPage />}>
                            <Route path="/chats/create" element={<ChatCreatePage />} />
                            <Route path="/chats/id/:id" element={<ChatViewPage />} />
                        </Route>
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/tools/id/:id" element={<ToolViewPage />} />
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

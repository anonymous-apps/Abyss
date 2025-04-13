import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { HeaderBar } from './library/layout/header-bar';
import { AgentsPage } from './pages/agents/agents-page.page';
import { CreateAgentPage } from './pages/agents/create-agent.page';
import { ViewAgentPage } from './pages/agents/view-agent.page';
import { ChatCreatePage } from './pages/chats/create';
import { ChatMainPage } from './pages/chats/main';
import { ChatViewPage } from './pages/chats/view';
import { ListTablesPage } from './pages/database/database.page';
import { ViewTableRecordPage } from './pages/database/record.page';
import { ViewTablePage } from './pages/database/table.page';
import { MainPage } from './pages/main/main';
import { MetricsChartPage } from './pages/metrics/metrics-chart.page';
import { MetricsPage } from './pages/metrics/metrics.page';
import { ModelProfileCreatePage } from './pages/models/create';
import { ModelProfileMainPage } from './pages/models/main';
import { ModelProfileViewPage } from './pages/models/view';
import { SettingsPage } from './pages/settings/settings.page';
import { ToolsPage } from './pages/tool/tools.page';
import { ToolViewPage } from './pages/tool/view.page';
import { WithSidebar } from './pages/withSidebar';
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
                    <Route path="/" element={<WithSidebar />}>
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
                        <Route path="/agents/create" element={<CreateAgentPage />} />
                        <Route path="/agents/id/:id" element={<ViewAgentPage />} />
                    </Route>
                    <Route path="*" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ToastContainer } from './components/common/ToastContainer';
import { IssueListView } from './components/issues/IssueListView';
import { IssueBoardView } from './components/issues/IssueBoardView';
import { IssueTimelineView } from './components/issues/IssueTimelineView';
import { CreateIssueModal } from './components/issues/CreateIssueModal';
import { IssueDetailModal } from './components/issues/IssueDetailModal';
import { CyclesView } from './components/cycles/CyclesView';
import { ProjectsView } from './components/projects/ProjectsView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { InsightsView } from './components/insights/InsightsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { AutomationsView } from './components/automations/AutomationsView';
import { SettingsView } from './components/settings/SettingsView';

const WorkspaceApp: React.FC = () => {
  const { state } = useWorkspace();

  const renderMainContent = () => {
    switch (state.activeTab) {
      case 'issues':
        if (state.viewMode === 'board') {
          return <IssueBoardView />;
        }
        if (state.viewMode === 'timeline') {
          return <IssueTimelineView />;
        }
        return <IssueListView />;
      case 'cycles':
        return <CyclesView />;
      case 'projects':
        return <ProjectsView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'insights':
        return <InsightsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'automations':
        return <AutomationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <IssueListView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none antialiased">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-zinc-950/40">
        {/* Top Header with Breadcrumbs, Search, Filters & View Toggles */}
        <Header />

        {/* Active View Container */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {renderMainContent()}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <CommandPalette />
      <KeyboardShortcutsModal />
      <CreateIssueModal />
      <IssueDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceApp />
    </WorkspaceProvider>
  );
}

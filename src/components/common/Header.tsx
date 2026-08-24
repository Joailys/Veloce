import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Search,
  ListFilter,
  LayoutList,
  Kanban,
  Calendar,
  Plus,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Command,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { IssueStatus, IssuePriority } from '../../types';
import { getStatusLabel, IssueStatusIcon } from '../issues/IssueStatusIcon';
import { getPriorityLabel, IssuePriorityIcon } from '../issues/IssuePriorityIcon';

export const Header: React.FC = () => {
  const {
    state,
    setIssueLayout,
    setSearchQuery,
    toggleStatusFilter,
    togglePriorityFilter,
    toggleAssigneeFilter,
    toggleLabelFilter,
    toggleProjectFilter,
    clearAllFilters,
    setGroupBy,
    setOrderBy,
    setTheme,
    setIsCreateIssueOpen,
    setIsCommandPaletteOpen,
    setIsShortcutsModalOpen,
    teams,
    users,
    labels,
    projects,
    filteredIssues
  } = useWorkspace();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showViewSettingsDropdown, setShowViewSettingsDropdown] = useState(false);

  const activeFiltersCount =
    state.selectedStatusFilter.length +
    state.selectedPriorityFilter.length +
    state.selectedAssigneeFilter.length +
    state.selectedLabelFilter.length +
    state.selectedProjectFilter.length +
    state.selectedCycleFilter.length +
    (state.searchQuery ? 1 : 0);

  const currentTeam = teams.find((t) => t.id === state.currentTeamId);

  const getViewTitle = () => {
    switch (state.activeView) {
      case 'issues':
        return 'Issues';
      case 'cycles':
        return 'Cycles & Sprints';
      case 'projects':
        return 'Projects & Initiatives';
      case 'roadmap':
        return 'Strategic Roadmap';
      case 'insights':
        return 'Insights & Velocity';
      case 'automations':
        return 'Workflow Automations';
      case 'integrations':
        return 'Integrations & Webhooks';
      case 'settings':
        return 'Settings & Permissions';
      default:
        return 'Workspace';
    }
  };

  const statuses: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled'];
  const priorities: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none'];

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20 select-none">
      {/* Left: Breadcrumbs & View Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <span className="text-zinc-500">Workspace</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 font-medium truncate max-w-[120px]">
            {currentTeam ? currentTeam.name : 'All Teams'}
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-100 font-semibold">{getViewTitle()}</span>
          {state.activeView === 'issues' && (
            <span className="text-[11px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded-full font-mono ml-1">
              {filteredIssues.length}
            </span>
          )}
        </div>

        {/* View Layout Switcher for Issues */}
        {state.activeView === 'issues' && (
          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-3">
            <button
              onClick={() => setIssueLayout('list')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                state.issueLayout === 'list'
                  ? 'bg-zinc-800 text-zinc-100 font-medium shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="List View (1)"
            >
              <LayoutList size={13} />
              <span>List</span>
            </button>
            <button
              onClick={() => setIssueLayout('board')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                state.issueLayout === 'board'
                  ? 'bg-zinc-800 text-zinc-100 font-medium shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Board View (2)"
            >
              <Kanban size={13} />
              <span>Board</span>
            </button>
            <button
              onClick={() => setIssueLayout('timeline')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                state.issueLayout === 'timeline'
                  ? 'bg-zinc-800 text-zinc-100 font-medium shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Timeline View (3)"
            >
              <Calendar size={13} />
              <span>Timeline</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Search, Filter, Theme, Create Issue */}
      <div className="flex items-center gap-2">
        {/* Quick Search Button / Input */}
        <div className="relative flex items-center">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer group"
          >
            <Search size={13} className="text-zinc-500 group-hover:text-zinc-300" />
            <span className="hidden md:inline">Search or command...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 bg-zinc-800 text-zinc-400 font-mono text-[10px] rounded border border-zinc-700/60">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Filter Popover Button */}
        {state.activeView === 'issues' && (
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                activeFiltersCount > 0
                  ? 'bg-indigo-950/50 border-indigo-700/60 text-indigo-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <ListFilter size={13} />
              <span className="hidden sm:inline">Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px] font-mono font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Filter Dropdown Menu */}
            {showFilterDropdown && (
              <div
                className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-semibold text-zinc-200">Filter Issues</span>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-indigo-400 hover:text-indigo-300 text-[11px]"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {statuses.map((st) => {
                      const active = state.selectedStatusFilter.includes(st);
                      return (
                        <button
                          key={st}
                          onClick={() => toggleStatusFilter(st)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border transition-colors ${
                            active
                              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                              : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                          }`}
                        >
                          <IssueStatusIcon status={st} size={11} />
                          {getStatusLabel(st)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                    Priority
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {priorities.map((pr) => {
                      const active = state.selectedPriorityFilter.includes(pr);
                      return (
                        <button
                          key={pr}
                          onClick={() => togglePriorityFilter(pr)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border transition-colors ${
                            active
                              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                              : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                          }`}
                        >
                          <IssuePriorityIcon priority={pr} size={11} />
                          {getPriorityLabel(pr)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assignee Filter */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                    Assignee
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {users.map((u) => {
                      const active = state.selectedAssigneeFilter.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          onClick={() => toggleAssigneeFilter(u.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border transition-colors ${
                            active
                              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                              : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                          }`}
                        >
                          <img src={u.avatar} alt={u.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          {u.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Labels Filter */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {labels.map((l) => {
                      const active = state.selectedLabelFilter.includes(l.id);
                      return (
                        <button
                          key={l.id}
                          onClick={() => toggleLabelFilter(l.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                            active
                              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                              : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                          {l.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Group / Sort dropdown (for issues list) */}
        {state.activeView === 'issues' && (
          <div className="relative">
            <button
              onClick={() => setShowViewSettingsDropdown(!showViewSettingsDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 transition-colors"
              title="Display Settings"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Display</span>
            </button>

            {showViewSettingsDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                    Grouping
                  </label>
                  <select
                    value={state.groupBy}
                    onChange={(e) => setGroupBy(e.target.value as any)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-200 text-xs focus:outline-none"
                  >
                    <option value="status">Group by Status</option>
                    <option value="priority">Group by Priority</option>
                    <option value="assignee">Group by Assignee</option>
                    <option value="project">Group by Project</option>
                    <option value="cycle">Group by Cycle</option>
                    <option value="none">No Grouping</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                    Ordering
                  </label>
                  <select
                    value={state.orderBy}
                    onChange={(e) => setOrderBy(e.target.value as any)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-200 text-xs focus:outline-none"
                  >
                    <option value="priority">Sort by Priority</option>
                    <option value="updatedAt">Sort by Recently Updated</option>
                    <option value="createdAt">Sort by Created Date</option>
                    <option value="estimate">Sort by Story Points</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
          title={state.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {state.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Create Issue Action Button */}
        <button
          id="btn-create-issue-header"
          onClick={() => setIsCreateIssueOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs shadow-indigo-600/30 transition-colors shrink-0"
        >
          <Plus size={13} className="stroke-[2.5]" />
          <span>New Issue</span>
          <kbd className="hidden sm:inline px-1 py-0.2 bg-indigo-700 text-indigo-200 font-mono text-[9px] rounded ml-1">
            C
          </kbd>
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Layers,
  Repeat,
  FolderGit2,
  Map,
  BarChart3,
  Bot,
  Plug,
  Settings,
  Plus,
  Zap,
  ChevronDown,
  Users,
  ShieldCheck,
  Layout,
  Cpu,
  Sparkles,
  Command,
  HelpCircle,
  Flame,
  GitPullRequest,
  CheckCircle2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    state,
    setActiveView,
    setCurrentTeamId,
    setIsCreateIssueOpen,
    setIsCommandPaletteOpen,
    setIsShortcutsModalOpen,
    teams,
    users,
    issues,
    cycles,
    projects,
    automations,
    activeCycle,
    simulateGitEvent,
    simulateSentryAlert
  } = useWorkspace();

  const getTeamIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu size={14} className="text-indigo-400" />;
      case 'Layout':
        return <Layout size={14} className="text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={14} className="text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles size={14} className="text-amber-400" />;
      default:
        return <Users size={14} className="text-zinc-400" />;
    }
  };

  const currentTeam = teams.find((t) => t.id === state.currentTeamId);

  // Stats calculation
  const totalIssuesCount = issues.filter(
    (i) => state.currentTeamId === 'all' || i.teamId === state.currentTeamId
  ).length;

  const activeCycleIssues = issues.filter(
    (i) =>
      activeCycle &&
      i.cycleId === activeCycle.id &&
      (state.currentTeamId === 'all' || i.teamId === state.currentTeamId)
  );
  const completedCycleIssues = activeCycleIssues.filter((i) => i.status === 'done').length;

  const navItems = [
    {
      id: 'issues' as const,
      label: 'Issues',
      icon: <Layers size={16} />,
      badge: totalIssuesCount,
      shortcut: 'G I'
    },
    {
      id: 'cycles' as const,
      label: activeCycle ? `Cycle ${activeCycle.number}` : 'Cycles',
      icon: <Repeat size={16} />,
      badge: activeCycle ? `${completedCycleIssues}/${activeCycleIssues.length}` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      shortcut: 'G C'
    },
    {
      id: 'projects' as const,
      label: 'Projects',
      icon: <FolderGit2 size={16} />,
      badge: projects.length,
      shortcut: 'G P'
    },
    {
      id: 'roadmap' as const,
      label: 'Roadmap',
      icon: <Map size={16} />,
      shortcut: 'G R'
    },
    {
      id: 'insights' as const,
      label: 'Insights & Velocity',
      icon: <BarChart3 size={16} />,
      shortcut: 'G A'
    },
    {
      id: 'automations' as const,
      label: 'Automations',
      icon: <Bot size={16} />,
      badge: automations.filter((a) => a.enabled).length,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      shortcut: 'G W'
    },
    {
      id: 'integrations' as const,
      label: 'Integrations',
      icon: <Plug size={16} />,
      badge: '5 Live',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'settings' as const,
      label: 'Settings & Access',
      icon: <Settings size={16} />,
      shortcut: 'G S'
    }
  ];

  return (
    <aside className="w-64 bg-zinc-950/90 dark:bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen select-none shrink-0 text-zinc-300">
      {/* Workspace Header Brand */}
      <div className="p-3.5 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Zap size={15} className="fill-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-zinc-100 text-sm tracking-tight flex items-center gap-1.5">
              <span>Veloce</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded font-mono">
                v2.4
              </span>
            </h1>
            <p className="text-[11px] text-zinc-500 truncate">Linear High-Speed Tracker</p>
          </div>
        </div>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
          title="Command Menu (Cmd+K)"
        >
          <Command size={14} />
        </button>
      </div>

      {/* New Issue Action Button */}
      <div className="p-3">
        <button
          id="btn-create-issue-sidebar"
          onClick={() => setIsCreateIssueOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm shadow-indigo-600/30 transition-all font-medium text-xs group"
        >
          <span className="flex items-center gap-2">
            <Plus size={14} className="stroke-[2.5]" />
            New Issue
          </span>
          <kbd className="px-1.5 py-0.5 bg-indigo-700 text-indigo-200 font-mono text-[10px] rounded group-hover:bg-indigo-600">
            C
          </kbd>
        </button>
      </div>

      {/* Team Switcher Filter */}
      <div className="px-3 py-1.5">
        <label className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 px-2 block mb-1">
          Workspace Scope
        </label>
        <div className="relative">
          <select
            value={state.currentTeamId}
            onChange={(e) => setCurrentTeamId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="all">⚡ All Teams (Entire Workspace)</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.key})
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 px-2.5 py-1">
          Views & Workflows
        </div>
        {navItems.map((item) => {
          const isActive = state.activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-zinc-800/90 text-zinc-100 border border-zinc-700/60 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                      item.badgeColor || 'bg-zinc-800 text-zinc-400 border-zinc-700/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Teams Section */}
        <div className="pt-4 pb-1">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 px-2.5 py-1 flex items-center justify-between">
            <span>Engineering Teams</span>
            <span className="text-[9px] font-mono text-zinc-600">{teams.length}</span>
          </div>
          {teams.map((team) => {
            const isSelected = state.currentTeamId === team.id;
            const teamIssueCount = issues.filter((i) => i.teamId === team.id).length;
            return (
              <button
                key={team.id}
                onClick={() => {
                  setCurrentTeamId(isSelected ? 'all' : team.id);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getTeamIcon(team.icon)}
                  <span className="truncate">{team.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 px-1 bg-zinc-900 rounded">
                    {team.key}
                  </span>
                  <span className="text-[10px] text-zinc-500">{teamIssueCount}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Dev Live Event Trigger Shortcuts */}
      <div className="p-2.5 mx-2 mb-2 bg-zinc-900/80 rounded-lg border border-zinc-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400">
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-amber-400" />
            Dev Event Simulator
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <button
            onClick={() => simulateGitEvent('pr_merge')}
            className="flex items-center gap-1 p-1 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700/50 transition-colors justify-center text-center"
            title="Simulate PR Merge -> Auto-resolves ticket to Done"
          >
            <GitPullRequest size={10} className="text-emerald-400" />
            PR Merge
          </button>
          <button
            onClick={() => simulateSentryAlert()}
            className="flex items-center gap-1 p-1 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700/50 transition-colors justify-center text-center"
            title="Simulate Sentry Error -> Auto-creates high priority bug"
          >
            <Flame size={10} className="text-orange-400" />
            Sentry Spike
          </button>
        </div>
      </div>

      {/* User profile & Shortcuts info */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={users[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={users[0]?.name || 'Current User'}
            className="w-6 h-6 rounded-full border border-indigo-500/40 object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium text-zinc-200 text-xs truncate">{users[0]?.name || 'You'}</p>
            <span className="text-[10px] text-zinc-500 capitalize">{users[0]?.role || 'Admin'}</span>
          </div>
        </div>

        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-800 rounded transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </aside>
  );
};

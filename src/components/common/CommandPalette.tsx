import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Layers,
  Repeat,
  FolderGit2,
  Map,
  BarChart3,
  Bot,
  Plug,
  Settings,
  GitPullRequest,
  Flame,
  Sun,
  Moon,
  RotateCcw,
  Download,
  Check,
  Tag
} from 'lucide-react';
import { IssueStatusIcon } from '../issues/IssueStatusIcon';
import { IssuePriorityIcon } from '../issues/IssuePriorityIcon';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsCreateIssueOpen,
    setIsShortcutsModalOpen,
    setSelectedIssueId,
    issues,
    projects,
    cycles,
    teams,
    setActiveView,
    setTheme,
    state,
    simulateGitEvent,
    simulateSentryAlert,
    rolloverCycle,
    activeCycle,
    exportWorkspaceJson,
    resetToDefaultData
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Global Keydown listener for Cmd+K and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when typing in inputs/textareas
      const isInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      // Open Command palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      // Help modal on '?'
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
        return;
      }

      // Create issue on 'c' or 'C'
      if ((e.key === 'c' || e.key === 'C') && !isInputFocused && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsCreateIssueOpen(true);
        return;
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen, setIsShortcutsModalOpen, setIsCreateIssueOpen]);

  // Compute command actions & search items
  const items = useMemo(() => {
    const q = query.toLowerCase().trim();

    const staticActions = [
      {
        id: 'act_create_issue',
        category: 'Actions',
        title: 'Create new issue...',
        subtitle: 'Add a new engineering ticket to backlog or active cycle',
        icon: <Plus size={16} className="text-indigo-400" />,
        shortcut: 'C',
        run: () => setIsCreateIssueOpen(true)
      },
      {
        id: 'act_goto_issues',
        category: 'Navigation',
        title: 'Go to Issues',
        subtitle: 'View all tickets in list, board or timeline format',
        icon: <Layers size={16} className="text-sky-400" />,
        shortcut: 'G I',
        run: () => setActiveView('issues')
      },
      {
        id: 'act_goto_cycles',
        category: 'Navigation',
        title: 'Go to Active Cycle',
        subtitle: 'Sprint velocity, burndown analytics and automated rollover',
        icon: <Repeat size={16} className="text-emerald-400" />,
        shortcut: 'G C',
        run: () => setActiveView('cycles')
      },
      {
        id: 'act_goto_projects',
        category: 'Navigation',
        title: 'Go to Projects & Initiatives',
        subtitle: 'Target dates, milestones progress and cross-team epics',
        icon: <FolderGit2 size={16} className="text-amber-400" />,
        shortcut: 'G P',
        run: () => setActiveView('projects')
      },
      {
        id: 'act_goto_roadmap',
        category: 'Navigation',
        title: 'Go to Strategic Roadmap',
        subtitle: 'Quarterly Gantt overview and delivery projections',
        icon: <Map size={16} className="text-purple-400" />,
        shortcut: 'G R',
        run: () => setActiveView('roadmap')
      },
      {
        id: 'act_goto_insights',
        category: 'Navigation',
        title: 'Go to Insights & Analytics',
        subtitle: 'Cycle time, lead time, throughput and team workload',
        icon: <BarChart3 size={16} className="text-cyan-400" />,
        shortcut: 'G A',
        run: () => setActiveView('insights')
      },
      {
        id: 'act_goto_automations',
        category: 'Navigation',
        title: 'Go to Workflow Automations',
        subtitle: 'Customizable triggers & actions for dev workflow rules',
        icon: <Bot size={16} className="text-fuchsia-400" />,
        shortcut: 'G W',
        run: () => setActiveView('automations')
      },
      {
        id: 'act_goto_integrations',
        category: 'Navigation',
        title: 'Go to Dev Ecosystem Integrations',
        subtitle: 'GitHub, GitLab, Sentry, Slack and Figma connections',
        icon: <Plug size={16} className="text-emerald-400" />,
        run: () => setActiveView('integrations')
      },
      {
        id: 'act_goto_settings',
        category: 'Navigation',
        title: 'Go to Settings & Access Permissions',
        subtitle: 'Manage workspace members, roles, teams and security',
        icon: <Settings size={16} className="text-zinc-400" />,
        shortcut: 'G S',
        run: () => setActiveView('settings')
      },
      {
        id: 'act_sim_pr_merge',
        category: 'Dev Simulations',
        title: 'Simulate GitHub Pull Request Merge',
        subtitle: 'Trigger webhook: Auto-move issue to Done & log activity',
        icon: <GitPullRequest size={16} className="text-emerald-400" />,
        run: () => simulateGitEvent('pr_merge')
      },
      {
        id: 'act_sim_pr_open',
        category: 'Dev Simulations',
        title: 'Simulate GitHub Pull Request Open',
        subtitle: 'Trigger webhook: Auto-move issue to In Review',
        icon: <GitPullRequest size={16} className="text-sky-400" />,
        run: () => simulateGitEvent('pr_open')
      },
      {
        id: 'act_sim_sentry',
        category: 'Dev Simulations',
        title: 'Simulate Sentry Error Incident Spike',
        subtitle: 'Ingest stack trace crash and auto-tag Bug with High priority',
        icon: <Flame size={16} className="text-orange-400" />,
        run: () => simulateSentryAlert()
      },
      {
        id: 'act_rollover',
        category: 'Actions',
        title: 'Rollover Active Cycle Unfinished Work',
        subtitle: activeCycle ? `Migrate remaining issues from ${activeCycle.name}` : 'Rollover sprint',
        icon: <Repeat size={16} className="text-amber-400" />,
        run: () => {
          if (activeCycle) rolloverCycle(activeCycle.id);
        }
      },
      {
        id: 'act_toggle_theme',
        category: 'Preferences',
        title: state.theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
        subtitle: 'Toggle workspace luminescence palette',
        icon: state.theme === 'dark' ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-indigo-400" />,
        run: () => setTheme(state.theme === 'dark' ? 'light' : 'dark')
      },
      {
        id: 'act_export',
        category: 'Preferences',
        title: 'Export Workspace JSON Backup',
        subtitle: 'Download complete state including issues, projects & automations',
        icon: <Download size={16} className="text-zinc-400" />,
        run: () => exportWorkspaceJson()
      },
      {
        id: 'act_reset',
        category: 'Preferences',
        title: 'Reset Workspace to Default Demo Dataset',
        subtitle: 'Restore initial rich software engineering state',
        icon: <RotateCcw size={16} className="text-red-400" />,
        run: () => resetToDefaultData()
      }
    ];

    // Filtered actions
    const matchingActions = staticActions.filter(
      (a) =>
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );

    // Matching Issues
    const matchingIssues = issues
      .filter(
        (iss) =>
          !q ||
          iss.identifier.toLowerCase().includes(q) ||
          iss.title.toLowerCase().includes(q) ||
          iss.description.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((iss) => ({
        id: iss.id,
        category: 'Issues',
        title: `${iss.identifier} — ${iss.title}`,
        subtitle: `Status: ${iss.status} • Priority: ${iss.priority} • Est: ${iss.estimate} pts`,
        icon: <IssueStatusIcon status={iss.status} size={15} />,
        priorityIcon: <IssuePriorityIcon priority={iss.priority} size={14} />,
        run: () => {
          setSelectedIssueId(iss.id);
          setActiveView('issues');
        }
      }));

    // Matching Projects
    const matchingProjects = projects
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        category: 'Projects',
        title: p.name,
        subtitle: `${p.health.replace('_', ' ')} • Target: ${p.targetDate}`,
        icon: <FolderGit2 size={16} className="text-indigo-400" />,
        run: () => setActiveView('projects')
      }));

    // Matching Cycles
    const matchingCycles = cycles
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        category: 'Cycles',
        title: c.name,
        subtitle: `Status: ${c.status} • Ends: ${new Date(c.endDate).toLocaleDateString()}`,
        icon: <Repeat size={16} className="text-emerald-400" />,
        run: () => setActiveView('cycles')
      }));

    return [...matchingIssues, ...matchingActions, ...matchingProjects, ...matchingCycles];
  }, [
    query,
    issues,
    projects,
    cycles,
    state.theme,
    activeCycle,
    setIsCreateIssueOpen,
    setActiveView,
    simulateGitEvent,
    simulateSentryAlert,
    rolloverCycle,
    setTheme,
    exportWorkspaceJson,
    resetToDefaultData,
    setSelectedIssueId
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].run();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[75vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input Box */}
          <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 gap-3">
            <Search size={18} className="text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search issues, projects, cycles..."
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none"
            />
            <kbd className="px-2 py-0.5 bg-zinc-800 text-zinc-400 font-mono text-[11px] rounded border border-zinc-700/60 shrink-0">
              Esc
            </kbd>
          </div>

          {/* Results List */}
          <div ref={listRef} className="p-2 overflow-y-auto divide-y divide-zinc-800/40">
            {items.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-sm">
                No matching commands or tickets found for "{query}"
              </div>
            ) : (
              items.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.run();
                      setIsCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors text-sm ${
                      isSelected
                        ? 'bg-indigo-600/20 text-zinc-100 border border-indigo-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 p-1 bg-zinc-800/70 rounded-md border border-zinc-700/50">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-100 truncate text-xs sm:text-sm">
                            {item.title}
                          </span>
                          {'priorityIcon' in item && item.priorityIcon}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {'shortcut' in item && item.shortcut && (
                        <kbd className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 font-mono text-[10px] rounded border border-zinc-700/60">
                          {item.shortcut}
                        </kbd>
                      )}
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 px-1.5 py-0.5 bg-zinc-950 rounded">
                        {item.category}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px]">↑</kbd>{' '}
                <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px]">↓</kbd> to navigate
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px]">↵</kbd> to select
              </span>
            </div>
            <span className="text-zinc-500">Veloce Command Engine</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

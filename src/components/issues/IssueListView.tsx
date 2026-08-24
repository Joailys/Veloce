import React, { useState, useEffect, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { IssueRow } from './IssueRow';
import { Issue, IssueStatus, IssuePriority } from '../../types';
import { IssueStatusIcon, getStatusLabel } from './IssueStatusIcon';
import { IssuePriorityIcon, getPriorityLabel } from './IssuePriorityIcon';
import {
  CheckCircle2,
  Trash2,
  Users,
  AlertTriangle,
  Layers,
  Plus,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const IssueListView: React.FC = () => {
  const {
    filteredIssues,
    state,
    selectedIssueIds,
    toggleSelectIssue,
    selectAllIssues,
    clearSelectedIssues,
    batchUpdateIssues,
    deleteIssue,
    setSelectedIssueId,
    setIsCreateIssueOpen,
    users,
    projects,
    cycles,
    labels
  } = useWorkspace();

  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Grouping logic
  const groups = useMemo(() => {
    if (state.groupBy === 'none') {
      return [{ key: 'all', title: 'All Issues', issues: filteredIssues }];
    }

    if (state.groupBy === 'status') {
      const order: IssueStatus[] = ['in_progress', 'todo', 'in_review', 'backlog', 'done', 'canceled'];
      return order
        .map((st) => ({
          key: st,
          status: st,
          title: getStatusLabel(st),
          issues: filteredIssues.filter((i) => i.status === st)
        }))
        .filter((g) => g.issues.length > 0);
    }

    if (state.groupBy === 'priority') {
      const order: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none'];
      return order
        .map((pr) => ({
          key: pr,
          priority: pr,
          title: getPriorityLabel(pr),
          issues: filteredIssues.filter((i) => i.priority === pr)
        }))
        .filter((g) => g.issues.length > 0);
    }

    if (state.groupBy === 'assignee') {
      const userGroups = users.map((u) => ({
        key: u.id,
        title: u.name,
        avatar: u.avatar,
        issues: filteredIssues.filter((i) => i.assigneeId === u.id)
      }));
      const unassigned = {
        key: 'unassigned',
        title: 'Unassigned',
        issues: filteredIssues.filter((i) => !i.assigneeId)
      };
      return [...userGroups, unassigned].filter((g) => g.issues.length > 0);
    }

    if (state.groupBy === 'project') {
      const projectGroups = projects.map((p) => ({
        key: p.id,
        title: p.name,
        color: p.color,
        issues: filteredIssues.filter((i) => i.projectId === p.id)
      }));
      const noProject = {
        key: 'no_project',
        title: 'No Project',
        issues: filteredIssues.filter((i) => !i.projectId)
      };
      return [...projectGroups, noProject].filter((g) => g.issues.length > 0);
    }

    if (state.groupBy === 'cycle') {
      const cycleGroups = cycles.map((c) => ({
        key: c.id,
        title: c.name,
        status: c.status,
        issues: filteredIssues.filter((i) => i.cycleId === c.id)
      }));
      const noCycle = {
        key: 'no_cycle',
        title: 'No Cycle (Backlog)',
        issues: filteredIssues.filter((i) => !i.cycleId)
      };
      return [...cycleGroups, noCycle].filter((g) => g.issues.length > 0);
    }

    return [{ key: 'all', title: 'All Issues', issues: filteredIssues }];
  }, [filteredIssues, state.groupBy, users, projects, cycles]);

  // Flattened list for keyboard navigation
  const flatIssues = useMemo(() => {
    return groups.flatMap((g) => g.issues);
  }, [groups]);

  // Keyboard navigation for J / K / Enter / X / Delete / C / 1-5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      if (isInput) return;

      const targetIssue = flatIssues[focusedIndex];

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < flatIssues.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (targetIssue) {
          setSelectedIssueId(targetIssue.id);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCreateIssueOpen(true);
      } else if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        if (targetIssue) {
          toggleSelectIssue(targetIssue.id);
        }
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && targetIssue) {
        e.preventDefault();
        const priorities: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none'];
        const p = priorities[parseInt(e.key) - 1];
        if (p) {
          batchUpdateIssues([targetIssue.id], { priority: p });
        }
      } else if ((e.key === 's' || e.key === 'S') && targetIssue) {
        e.preventDefault();
        const statusOrder: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
        const nextIdx = (statusOrder.indexOf(targetIssue.status) + 1) % statusOrder.length;
        batchUpdateIssues([targetIssue.id], { status: statusOrder[nextIdx] });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIssueIds.length > 0) {
          e.preventDefault();
          selectedIssueIds.forEach((id) => deleteIssue(id));
          clearSelectedIssues();
        } else if (targetIssue) {
          e.preventDefault();
          deleteIssue(targetIssue.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatIssues, focusedIndex, selectedIssueIds, setSelectedIssueId, toggleSelectIssue, deleteIssue, clearSelectedIssues, setIsCreateIssueOpen, batchUpdateIssues]);

  if (filteredIssues.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <Layers size={22} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">No issues found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
          No tickets match the current active filter, team scope, or search query.
        </p>
        <button
          onClick={() => setIsCreateIssueOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={14} />
          Create New Issue (C)
        </button>
      </div>
    );
  }

  let globalIndexCounter = 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Issues Groups */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => {
          const totalPoints = group.issues.reduce((sum, i) => sum + i.estimate, 0);

          return (
            <div key={group.key} className="border-b border-zinc-850/80">
              {/* Group Header */}
              <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md px-3.5 py-2 border-b border-zinc-850 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-zinc-300">
                  {'status' in group && group.status && (
                    <IssueStatusIcon status={group.status} size={14} />
                  )}
                  {'priority' in group && group.priority && (
                    <IssuePriorityIcon priority={group.priority} size={14} />
                  )}
                  {'avatar' in group && (
                    <img
                      src={group.avatar}
                      alt={group.title}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  )}
                  <span>{group.title}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {group.issues.length}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                  <span>{totalPoints} pts</span>
                </div>
              </div>

              {/* Group Issue Rows */}
              <div>
                {group.issues.map((issue) => {
                  const currentIndex = globalIndexCounter++;
                  const isSelected = selectedIssueIds.includes(issue.id);
                  const isFocused = currentIndex === focusedIndex;

                  return (
                    <IssueRow
                      key={issue.id}
                      issue={issue}
                      isSelected={isSelected}
                      isFocused={isFocused}
                      onSelect={() => toggleSelectIssue(issue.id)}
                      onClick={() => setSelectedIssueId(issue.id)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Multi-Select Action Bar */}
      {selectedIssueIds.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-zinc-900/95 border border-zinc-700 shadow-2xl backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-3 text-xs text-zinc-100 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <span className="font-semibold px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[11px]">
            {selectedIssueIds.length} selected
          </span>

          <div className="h-4 w-px bg-zinc-700" />

          {/* Quick Mark Done */}
          <button
            onClick={() => {
              batchUpdateIssues(selectedIssueIds, { status: 'done' });
              clearSelectedIssues();
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 rounded-md transition-colors"
          >
            <CheckCircle2 size={13} />
            Mark Done
          </button>

          {/* Quick Set Status to In Progress */}
          <button
            onClick={() => {
              batchUpdateIssues(selectedIssueIds, { status: 'in_progress' });
              clearSelectedIssues();
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 rounded-md transition-colors"
          >
            In Progress
          </button>

          {/* Quick High Priority */}
          <button
            onClick={() => {
              batchUpdateIssues(selectedIssueIds, { priority: 'high' });
              clearSelectedIssues();
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 border border-orange-800/60 rounded-md transition-colors"
          >
            <AlertTriangle size={13} />
            High Priority
          </button>

          {/* Quick Delete */}
          <button
            onClick={() => {
              selectedIssueIds.forEach((id) => deleteIssue(id));
              clearSelectedIssues();
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 rounded-md transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>

          <button
            onClick={clearSelectedIssues}
            className="text-zinc-400 hover:text-zinc-200 p-1 hover:bg-zinc-800 rounded transition-colors ml-1"
            title="Deselect (Esc)"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

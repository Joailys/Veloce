import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { IssueStatus, IssuePriority } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Layers,
  Sparkles,
  Command
} from 'lucide-react';
import { IssueStatusIcon, getStatusLabel } from './IssueStatusIcon';
import { IssuePriorityIcon, getPriorityLabel } from './IssuePriorityIcon';

export const CreateIssueModal: React.FC = () => {
  const {
    isCreateIssueOpen,
    setIsCreateIssueOpen,
    createIssue,
    teams,
    users,
    labels,
    projects,
    cycles,
    state
  } = useWorkspace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [status, setStatus] = useState<IssueStatus>('todo');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [estimate, setEstimate] = useState<number>(2);
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [cycleId, setCycleId] = useState<string>('');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreateIssueOpen) {
      setTitle('');
      setDescription('');
      const defaultTeam = state.currentTeamId !== 'all' ? state.currentTeamId : teams[0]?.id || '';
      setTeamId(defaultTeam);
      setStatus('todo');
      setPriority('medium');
      setEstimate(2);
      setAssigneeId(users[0]?.id || '');
      setProjectId(projects[0]?.id || '');
      const activeCycle = cycles.find((c) => c.status === 'active');
      setCycleId(activeCycle?.id || '');
      setSelectedLabelIds([]);
      setTimeout(() => titleInputRef.current?.focus(), 60);
    }
  }, [isCreateIssueOpen, state.currentTeamId, teams, users, projects, cycles]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    createIssue({
      title: title.trim(),
      description: description.trim(),
      teamId: teamId || teams[0].id,
      status,
      priority,
      estimate,
      assigneeId: assigneeId || undefined,
      projectId: projectId || undefined,
      cycleId: cycleId || undefined,
      labelIds: selectedLabelIds
    });

    setIsCreateIssueOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsCreateIssueOpen(false);
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  if (!isCreateIssueOpen) return null;

  const currentTeam = teams.find((t) => t.id === teamId) || teams[0];
  const statuses: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
  const priorities: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none'];
  const estimates = [0, 1, 2, 3, 5, 8, 13];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.15 }}
          className="bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 rounded">
                {currentTeam?.key || 'NEW'}
              </span>
              <h3 className="font-semibold text-zinc-100 text-sm">New Issue</h3>
            </div>
            <button
              onClick={() => setIsCreateIssueOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 p-1 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Title Input */}
            <div>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Issue title (e.g. Optimize Redis session serialization latency)"
                className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-base font-medium focus:outline-none border-b border-zinc-800 pb-2"
                required
              />
            </div>

            {/* Description Textarea */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description, acceptance criteria, or context... (Markdown supported)"
                rows={4}
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 rounded-lg p-3 text-zinc-200 placeholder-zinc-600 text-xs focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Property Controls Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Team Selector */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Team
                </label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IssueStatus)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {getStatusLabel(st)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssuePriority)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none"
                >
                  {priorities.map((pr) => (
                    <option key={pr} value={pr}>
                      {getPriorityLabel(pr)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimate Points */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Story Points
                </label>
                <select
                  value={estimate}
                  onChange={(e) => setEstimate(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none font-mono"
                >
                  {estimates.map((pts) => (
                    <option key={pts} value={pts}>
                      {pts} pt{pts > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row: Assignee, Project, Cycle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Assignee */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Assignee
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycle */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">
                  Sprint Cycle
                </label>
                <select
                  value={cycleId}
                  onChange={(e) => setCycleId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-md px-2 py-1.5 focus:outline-none"
                >
                  <option value="">Backlog (No cycle)</option>
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labels Pills */}
            <div>
              <label className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1.5">
                Labels
              </label>
              <div className="flex flex-wrap gap-1.5">
                {labels.map((lbl) => {
                  const isSelected = selectedLabelIds.includes(lbl.id);
                  return (
                    <button
                      type="button"
                      key={lbl.id}
                      onClick={() => toggleLabel(lbl.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                          : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lbl.color }} />
                      <span>{lbl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs">
            <div className="text-zinc-500 flex items-center gap-1.5">
              <Command size={12} />
              <span>
                Press <kbd className="px-1 py-0.2 bg-zinc-800 text-zinc-300 font-mono rounded text-[10px]">⌘+Enter</kbd> to save
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateIssueOpen(false)}
                className="px-3 py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={!title.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-semibold shadow-sm shadow-indigo-600/30 transition-colors"
              >
                <Plus size={14} />
                Create Issue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

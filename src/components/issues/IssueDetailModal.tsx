import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { IssueStatus, IssuePriority } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  GitBranch,
  GitPullRequest,
  Flame,
  Figma,
  CheckSquare,
  Plus,
  Send,
  Calendar,
  Layers,
  Copy,
  Check,
  Clock,
  ExternalLink,
  MessageSquare,
  History
} from 'lucide-react';
import { IssueStatusIcon, getStatusLabel } from './IssueStatusIcon';
import { IssuePriorityIcon, getPriorityLabel } from './IssuePriorityIcon';

export const IssueDetailModal: React.FC = () => {
  const {
    selectedIssueId,
    setSelectedIssueId,
    issues,
    updateIssue,
    deleteIssue,
    addComment,
    toggleSubTask,
    addSubTask,
    users,
    teams,
    labels,
    projects,
    cycles,
    simulateGitEvent,
    addToast
  } = useWorkspace();

  const [newComment, setNewComment] = useState('');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [copiedBranch, setCopiedBranch] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');

  const issue = issues.find((i) => i.id === selectedIssueId);

  if (!selectedIssueId || !issue) return null;

  const assignee = users.find((u) => u.id === issue.assigneeId);
  const creator = users.find((u) => u.id === issue.creatorId);
  const team = teams.find((t) => t.id === issue.teamId);
  const project = projects.find((p) => p.id === issue.projectId);
  const cycle = cycles.find((c) => c.id === issue.cycleId);
  const issueLabels = labels.filter((l) => issue.labelIds.includes(l.id));

  const handleCopyBranch = (branchName: string) => {
    navigator.clipboard.writeText(`git checkout -b ${branchName}`);
    setCopiedBranch(true);
    addToast({
      title: 'Branch command copied to clipboard',
      description: `git checkout -b ${branchName}`,
      type: 'info'
    });
    setTimeout(() => setCopiedBranch(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(issue.id, newComment);
    setNewComment('');
  };

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;
    addSubTask(issue.id, newSubTaskTitle);
    setNewSubTaskTitle('');
  };

  const statuses: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled'];
  const priorities: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none'];
  const estimates = [0, 1, 2, 3, 5, 8, 13];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-zinc-900 border-l border-zinc-700/80 shadow-2xl w-full max-w-4xl h-full flex flex-col overflow-hidden text-zinc-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Navigation */}
          <div className="px-6 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/80 rounded">
                {issue.identifier}
              </span>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <span>{team?.name}</span>
                {project && (
                  <>
                    <span>/</span>
                    <span className="text-zinc-300">{project.name}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => deleteIssue(issue.id)}
                className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded-md transition-colors"
                title="Delete ticket"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setSelectedIssueId(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                title="Close (Esc)"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Main Body Split: Left (Content) & Right (Properties) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Left Content Column */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Title input */}
              <div>
                <input
                  type="text"
                  value={issue.title}
                  onChange={(e) => updateIssue(issue.id, { title: e.target.value })}
                  className="w-full bg-transparent text-xl font-semibold text-zinc-100 placeholder-zinc-500 focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors pb-1"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={issue.description}
                  onChange={(e) => updateIssue(issue.id, { description: e.target.value })}
                  rows={5}
                  placeholder="Add a detailed description or acceptance criteria..."
                  className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Git Branch Helper */}
              {issue.gitBranches.length > 0 && (
                <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                      <GitBranch size={14} className="text-indigo-400" />
                      Git Branch
                    </span>
                    <button
                      onClick={() => handleCopyBranch(issue.gitBranches[0].name)}
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      {copiedBranch ? <Check size={12} /> : <Copy size={12} />}
                      {copiedBranch ? 'Copied' : 'Copy git checkout'}
                    </button>
                  </div>
                  <code className="block px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px] rounded">
                    git checkout -b {issue.gitBranches[0].name}
                  </code>
                </div>
              )}

              {/* Sentry Incident Alert Card */}
              {issue.sentryAlerts.length > 0 && (
                <div className="p-3.5 bg-orange-950/20 border border-orange-800/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-orange-400">
                      <Flame size={14} />
                      Sentry Crash Incident #{issue.sentryAlerts[0].id}
                    </span>
                    <a
                      href={issue.sentryAlerts[0].url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-orange-400 hover:underline"
                    >
                      View in Sentry <ExternalLink size={11} />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono bg-zinc-950/60 p-2 rounded border border-orange-900/40">
                    {issue.sentryAlerts[0].title}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
                    <span>Events: <strong className="text-zinc-200">{issue.sentryAlerts[0].eventCount}</strong></span>
                    <span>Users: <strong className="text-zinc-200">{issue.sentryAlerts[0].userCount}</strong></span>
                  </div>
                </div>
              )}

              {/* Linked GitHub Pull Requests */}
              {issue.pullRequests.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Pull Requests
                    </label>
                    {issue.pullRequests.some((p) => p.status === 'open') && (
                      <button
                        onClick={() => simulateGitEvent('pr_merge', issue.id)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        Simulate PR Merge → Done
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {issue.pullRequests.map((pr) => (
                      <div
                        key={pr.id}
                        className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GitPullRequest
                            size={16}
                            className={pr.status === 'merged' ? 'text-purple-400' : 'text-emerald-400'}
                          />
                          <div className="min-w-0">
                            <a
                              href={pr.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-zinc-200 hover:text-indigo-400 truncate block"
                            >
                              #{pr.number} {pr.title}
                            </a>
                            <span className="text-[10px] text-zinc-500">by @{pr.author}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                            pr.status === 'merged'
                              ? 'bg-purple-950/50 text-purple-300 border-purple-800'
                              : 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {pr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tasks Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare size={13} />
                    Sub-tasks ({issue.subTasks.filter((st) => st.completed).length}/{issue.subTasks.length})
                  </label>
                </div>

                <div className="space-y-1.5">
                  {issue.subTasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => toggleSubTask(issue.id, st.id)}
                      className="flex items-center gap-2.5 p-2 bg-zinc-950/40 hover:bg-zinc-800/50 border border-zinc-800/80 rounded-md cursor-pointer transition-colors text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => {}}
                        className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className={st.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}>
                        {st.title}
                      </span>
                    </div>
                  ))}

                  <form onSubmit={handleAddSubTask} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newSubTaskTitle}
                      onChange={(e) => setNewSubTaskTitle(e.target.value)}
                      placeholder="+ Add sub-task..."
                      className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!newSubTaskTitle.trim()}
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 text-xs rounded-md font-medium transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Tabs: Comments vs Activity */}
              <div className="pt-4 border-t border-zinc-800">
                <div className="flex gap-4 border-b border-zinc-800 pb-2 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex items-center gap-1.5 transition-colors ${
                      activeTab === 'details' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <MessageSquare size={13} />
                    Comments ({issue.comments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex items-center gap-1.5 transition-colors ${
                      activeTab === 'activity' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <History size={13} />
                    Activity Log ({issue.activity.length})
                  </button>
                </div>

                {activeTab === 'details' ? (
                  <div className="pt-3 space-y-3">
                    {issue.comments.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-2">No comments yet. Leave a message below.</p>
                    ) : (
                      issue.comments.map((cm) => {
                        const author = users.find((u) => u.id === cm.authorId);
                        return (
                          <div key={cm.id} className="flex gap-2.5 text-xs bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/80">
                            <img
                              src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={author?.name}
                              className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-zinc-200">{author?.name || 'Engineer'}</span>
                                <span className="text-[10px] text-zinc-500">
                                  {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-zinc-300 leading-relaxed">{cm.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* New Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send size={12} />
                        Post
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="pt-3 space-y-2">
                    {issue.activity.map((act) => (
                      <div key={act.id} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-850/60">
                        <span className="text-zinc-400">{act.details}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Properties Panel */}
            <div className="w-full md:w-72 bg-zinc-950/90 border-t md:border-t-0 md:border-l border-zinc-800 p-5 space-y-4 text-xs shrink-0 overflow-y-auto">
              <h4 className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                Properties
              </h4>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-zinc-500 text-[11px]">Status</label>
                <select
                  value={issue.status}
                  onChange={(e) => updateIssue(issue.id, { status: e.target.value as IssueStatus })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {getStatusLabel(st)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-zinc-500 text-[11px]">Priority</label>
                <select
                  value={issue.priority}
                  onChange={(e) => updateIssue(issue.id, { priority: e.target.value as IssuePriority })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none"
                >
                  {priorities.map((pr) => (
                    <option key={pr} value={pr}>
                      {getPriorityLabel(pr)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-1">
                <label className="text-zinc-500 text-[11px]">Assignee</label>
                <select
                  value={issue.assigneeId || ''}
                  onChange={(e) => updateIssue(issue.id, { assigneeId: e.target.value || undefined })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Story Points / Estimate */}
              <div className="space-y-1">
                <label className="text-zinc-500 text-[11px]">Story Points (Estimate)</label>
                <select
                  value={issue.estimate}
                  onChange={(e) => updateIssue(issue.id, { estimate: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none font-mono"
                >
                  {estimates.map((pts) => (
                    <option key={pts} value={pts}>
                      {pts} pt{pts > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycle */}
              <div className="space-y-1">
                <label className="text-zinc-500 text-[11px]">Sprint Cycle</label>
                <select
                  value={issue.cycleId || ''}
                  onChange={(e) => updateIssue(issue.id, { cycleId: e.target.value || undefined })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="">No cycle (Backlog)</option>
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project */}
              <div className="space-y-1">
                <label className="text-zinc-500 text-[11px]">Project</label>
                <select
                  value={issue.projectId || ''}
                  onChange={(e) => updateIssue(issue.id, { projectId: e.target.value || undefined })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Labels */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-850">
                <label className="text-zinc-500 text-[11px]">Labels</label>
                <div className="flex flex-wrap gap-1">
                  {labels.map((lbl) => {
                    const isAttached = issue.labelIds.includes(lbl.id);
                    return (
                      <button
                        key={lbl.id}
                        onClick={() => {
                          const newLabels = isAttached
                            ? issue.labelIds.filter((id) => id !== lbl.id)
                            : [...issue.labelIds, lbl.id];
                          updateIssue(issue.id, { labelIds: newLabels });
                        }}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                          isAttached
                            ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lbl.color }} />
                        {lbl.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

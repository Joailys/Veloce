import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Issue, IssueStatus } from '../../types';
import { IssueStatusIcon, getStatusLabel } from './IssueStatusIcon';
import { IssuePriorityIcon, getPriorityLabel } from './IssuePriorityIcon';
import {
  Plus,
  GitPullRequest,
  Flame,
  Figma,
  CheckSquare,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';

export const IssueBoardView: React.FC = () => {
  const {
    filteredIssues,
    updateIssue,
    setSelectedIssueId,
    setIsCreateIssueOpen,
    createIssue,
    users,
    labels,
    projects,
    state
  } = useWorkspace();

  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);

  const columns: { status: IssueStatus; title: string }[] = [
    { status: 'backlog', title: 'Backlog' },
    { status: 'todo', title: 'Todo' },
    { status: 'in_progress', title: 'In Progress' },
    { status: 'in_review', title: 'In Review' },
    { status: 'done', title: 'Done' },
    { status: 'canceled', title: 'Canceled' }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedIssueId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: IssueStatus) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (issueId) {
      updateIssue(issueId, { status: targetStatus });
    }
    setDraggedIssueId(null);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 flex gap-4 min-h-0 bg-zinc-950/60 select-none">
      {columns.map((col) => {
        const columnIssues = filteredIssues.filter((i) => i.status === col.status);
        const columnPoints = columnIssues.reduce((sum, i) => sum + i.estimate, 0);

        return (
          <div
            key={col.status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
            className="w-72 sm:w-80 shrink-0 flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-xl max-h-full overflow-hidden"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 shrink-0">
              <div className="flex items-center gap-2">
                <IssueStatusIcon status={col.status} size={15} />
                <span className="font-semibold text-xs text-zinc-200">{col.title}</span>
                <span className="text-[11px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded-full font-mono">
                  {columnIssues.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 font-mono">{columnPoints} pts</span>
                <button
                  onClick={() => createIssue({ status: col.status })}
                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                  title="Add ticket to column"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Column Cards List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {columnIssues.length === 0 ? (
                <div className="h-28 border border-dashed border-zinc-800/80 rounded-lg flex items-center justify-center text-zinc-600 text-xs">
                  No issues
                </div>
              ) : (
                columnIssues.map((issue) => {
                  const assignee = users.find((u) => u.id === issue.assigneeId);
                  const project = projects.find((p) => p.id === issue.projectId);
                  const issueLabels = labels.filter((l) => issue.labelIds.includes(l.id));
                  const completedSubTasks = issue.subTasks.filter((st) => st.completed).length;

                  return (
                    <div
                      key={issue.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue.id)}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className="group bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/90 hover:border-zinc-700 rounded-lg p-3 shadow-xs cursor-pointer transition-all hover:shadow-md select-none space-y-2.5"
                    >
                      {/* Top: Identifier & Priority */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-zinc-400 font-semibold text-[11px]">
                          {issue.identifier}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <IssuePriorityIcon priority={issue.priority} size={14} />
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xs font-medium text-zinc-200 line-clamp-2 leading-relaxed ${
                          issue.status === 'done' || issue.status === 'canceled'
                            ? 'line-through text-zinc-500'
                            : ''
                        }`}
                      >
                        {issue.title}
                      </h4>

                      {/* Labels */}
                      {issueLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {issueLabels.map((l) => (
                            <span
                              key={l.id}
                              className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-medium text-[10px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                              {l.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom row: Badges, Points & Assignee */}
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[11px] text-zinc-400">
                        <div className="flex items-center gap-2">
                          {/* Sentry Badge */}
                          {issue.sentryAlerts.length > 0 && (
                            <span className="flex items-center gap-0.5 text-orange-400 text-[10px] font-mono">
                              <Flame size={11} />
                              {issue.sentryAlerts[0].id}
                            </span>
                          )}

                          {/* GitHub PR */}
                          {issue.pullRequests.length > 0 && (
                            <span
                              className={`flex items-center gap-0.5 text-[10px] font-mono ${
                                issue.pullRequests[0].status === 'merged'
                                  ? 'text-purple-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              <GitPullRequest size={11} />#{issue.pullRequests[0].number}
                            </span>
                          )}

                          {/* Subtasks */}
                          {issue.subTasks.length > 0 && (
                            <span className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
                              <CheckSquare size={11} />
                              {completedSubTasks}/{issue.subTasks.length}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px] font-semibold">
                            {issue.estimate} pt
                          </span>

                          {assignee ? (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-4 h-4 rounded-full object-cover border border-zinc-700"
                              title={`Assigned to ${assignee.name}`}
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-dashed border-zinc-700 text-zinc-600 flex items-center justify-center text-[9px]">
                              -
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

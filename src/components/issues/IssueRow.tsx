import React, { useState } from 'react';
import { Issue, IssueStatus, IssuePriority } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { IssueStatusIcon, getStatusLabel } from './IssueStatusIcon';
import { IssuePriorityIcon, getPriorityLabel } from './IssuePriorityIcon';
import {
  GitPullRequest,
  Flame,
  Figma,
  CheckSquare,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Calendar
} from 'lucide-react';

interface Props {
  issue: Issue;
  isSelected: boolean;
  isFocused?: boolean;
  onSelect: () => void;
  onClick: () => void;
}

export const IssueRow: React.FC<Props> = ({
  issue,
  isSelected,
  isFocused = false,
  onSelect,
  onClick
}) => {
  const { users, labels, projects, cycles, updateIssue, deleteIssue } = useWorkspace();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);

  const assignee = users.find((u) => u.id === issue.assigneeId);
  const project = projects.find((p) => p.id === issue.projectId);
  const cycle = cycles.find((c) => c.id === issue.cycleId);
  const issueLabels = labels.filter((l) => issue.labelIds.includes(l.id));

  const completedSubTasks = issue.subTasks.filter((st) => st.completed).length;

  const statuses: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled'];
  const priorities: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none'];

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-850 hover:bg-zinc-800/40 cursor-pointer transition-colors text-xs select-none ${
        isSelected ? 'bg-indigo-950/30 hover:bg-indigo-950/40' : ''
      } ${isFocused ? 'ring-1 ring-indigo-500/80' : ''}`}
    >
      {/* Left items: Checkbox, Priority, Identifier, Status, Title, Tags */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer opacity-40 group-hover:opacity-100 transition-opacity"
        />

        {/* Priority Icon with quick dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPriorityMenu(!showPriorityMenu);
              setShowStatusMenu(false);
              setShowAssigneeMenu(false);
            }}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
            title={`Priority: ${getPriorityLabel(issue.priority)}`}
          >
            <IssuePriorityIcon priority={issue.priority} size={15} />
          </button>

          {showPriorityMenu && (
            <div
              className="absolute left-0 mt-1 w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    updateIssue(issue.id, { priority: p });
                    setShowPriorityMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-zinc-800 text-zinc-200 text-xs transition-colors"
                >
                  <IssuePriorityIcon priority={p} size={14} />
                  <span>{getPriorityLabel(p)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Identifier (e.g. ENG-101) */}
        <span className="font-mono text-zinc-400 font-semibold text-[11px] shrink-0 w-16">
          {issue.identifier}
        </span>

        {/* Status Icon with quick dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusMenu(!showStatusMenu);
              setShowPriorityMenu(false);
              setShowAssigneeMenu(false);
            }}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
            title={`Status: ${getStatusLabel(issue.status)}`}
          >
            <IssueStatusIcon status={issue.status} size={15} />
          </button>

          {showStatusMenu && (
            <div
              className="absolute left-0 mt-1 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    updateIssue(issue.id, { status: st });
                    setShowStatusMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-zinc-800 text-zinc-200 text-xs transition-colors"
                >
                  <IssueStatusIcon status={st} size={14} />
                  <span>{getStatusLabel(st)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <span
          className={`font-medium text-zinc-200 truncate max-w-xl ${
            issue.status === 'done' || issue.status === 'canceled'
              ? 'line-through text-zinc-500'
              : ''
          }`}
        >
          {issue.title}
        </span>

        {/* Labels badges */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          {issueLabels.map((label) => (
            <span
              key={label.id}
              className="flex items-center gap-1 px-1.5 py-0.2 rounded-md font-medium text-[10px] border border-zinc-700/60 bg-zinc-800/40 text-zinc-300"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
            </span>
          ))}
        </div>
      </div>

      {/* Right items: Project, Cycle, Dev Badges, Estimate, Assignee */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {/* Sentry Alert Badge */}
        {issue.sentryAlerts.length > 0 && (
          <span
            className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-orange-950/40 text-orange-400 border border-orange-800/50 text-[10px] font-mono font-medium"
            title={`Sentry Alert: ${issue.sentryAlerts[0].eventCount} crash events`}
          >
            <Flame size={11} />
            {issue.sentryAlerts[0].id}
          </span>
        )}

        {/* GitHub PR Badge */}
        {issue.pullRequests.length > 0 && (
          <span
            className={`flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium border ${
              issue.pullRequests[0].status === 'merged'
                ? 'bg-purple-950/40 text-purple-400 border-purple-800/50'
                : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
            }`}
            title={`GitHub PR #${issue.pullRequests[0].number}: ${issue.pullRequests[0].title}`}
          >
            <GitPullRequest size={11} />#{issue.pullRequests[0].number}
          </span>
        )}

        {/* Figma specs badge */}
        {issue.figmaLinks.length > 0 && (
          <span
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.2 rounded bg-pink-950/30 text-pink-400 border border-pink-800/40 text-[10px]"
            title={`Figma: ${issue.figmaLinks[0].frameName}`}
          >
            <Figma size={10} />
          </span>
        )}

        {/* Sub-tasks counter */}
        {issue.subTasks.length > 0 && (
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <CheckSquare size={12} className="text-zinc-500" />
            {completedSubTasks}/{issue.subTasks.length}
          </span>
        )}

        {/* Comments counter */}
        {issue.comments.length > 0 && (
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <MessageSquare size={12} className="text-zinc-500" />
            {issue.comments.length}
          </span>
        )}

        {/* Project Tag */}
        {project && (
          <span className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] max-w-[100px] truncate">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
            <span className="truncate">{project.name}</span>
          </span>
        )}

        {/* Estimate Points */}
        <span
          className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[10px] font-semibold"
          title={`${issue.estimate} Story Points`}
        >
          {issue.estimate} pt
        </span>

        {/* Assignee Avatar with quick dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAssigneeMenu(!showAssigneeMenu);
              setShowStatusMenu(false);
              setShowPriorityMenu(false);
            }}
            className="p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all flex items-center justify-center"
            title={assignee ? `Assigned to ${assignee.name}` : 'Unassigned'}
          >
            {assignee ? (
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-5 h-5 rounded-full border border-dashed border-zinc-600 bg-zinc-900 text-zinc-500 flex items-center justify-center text-[10px]">
                +
              </div>
            )}
          </button>

          {showAssigneeMenu && (
            <div
              className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  updateIssue(issue.id, { assigneeId: undefined });
                  setShowAssigneeMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 text-zinc-400 text-xs transition-colors"
              >
                <div className="w-4 h-4 rounded-full border border-dashed border-zinc-600" />
                <span>Unassigned</span>
              </button>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    updateIssue(issue.id, { assigneeId: u.id });
                    setShowAssigneeMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-xs transition-colors"
                >
                  <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                  <span className="truncate">{u.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

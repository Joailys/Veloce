import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { IssueStatusIcon } from './IssueStatusIcon';
import { IssuePriorityIcon } from './IssuePriorityIcon';
import { Calendar, GitPullRequest, Flame } from 'lucide-react';

export const IssueTimelineView: React.FC = () => {
  const { filteredIssues, setSelectedIssueId, users, cycles, setIsCreateIssueOpen } = useWorkspace();

  if (filteredIssues.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-zinc-950/60">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <Calendar size={22} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">No issues on timeline</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
          There are no issues matching the current team filter or active search to display on the timeline.
        </p>
        <button
          onClick={() => setIsCreateIssueOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          Create New Issue (C)
        </button>
      </div>
    );
  }

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 3 + i);
    return {
      date: d,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 3
    };
  });

  const activeSprint = cycles.find((c) => c.status === 'active') || cycles[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-950/60 overflow-hidden select-none">
      {/* Timeline Controls Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-indigo-400" />
          <span className="font-semibold text-zinc-200">
            {activeSprint ? activeSprint.name : 'Sprint Schedule & Execution Timeline'}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400">
          Showing {filteredIssues.length} tickets mapped across schedule
        </span>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Days Header */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-10">
          <div className="w-80 p-2.5 border-r border-zinc-800 text-xs font-semibold text-zinc-400 shrink-0">
            Issue / Assignee
          </div>
          <div className="flex-1 grid grid-cols-14 min-w-[700px]">
            {days.map((d, i) => (
              <div
                key={i}
                className={`p-2 border-r border-zinc-800 text-center text-[11px] font-mono ${
                  d.isToday ? 'bg-indigo-950/40 text-indigo-300 font-bold' : 'text-zinc-400'
                }`}
              >
                <div>{d.dayName}</div>
                <div className="text-zinc-200 text-xs mt-0.5">{d.dayNum}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-850">
          {filteredIssues.map((issue, idx) => {
            const assignee = users.find((u) => u.id === issue.assigneeId);
            // Derive bar offset and width from issue identifier and status
            const startCol = (idx * 2) % 10;
            const span = issue.estimate >= 5 ? 5 : issue.estimate >= 3 ? 3 : 2;

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className="flex hover:bg-zinc-800/30 cursor-pointer transition-colors group"
              >
                {/* Left ticket description */}
                <div className="w-80 p-2.5 border-r border-zinc-850 flex items-center justify-between shrink-0 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <IssueStatusIcon status={issue.status} size={14} />
                    <span className="font-mono text-[11px] font-semibold text-zinc-400 shrink-0">
                      {issue.identifier}
                    </span>
                    <span className="text-xs text-zinc-200 truncate font-medium">{issue.title}</span>
                  </div>
                  {assignee && (
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="w-4 h-4 rounded-full object-cover shrink-0 ml-2 border border-zinc-700"
                    />
                  )}
                </div>

                {/* Timeline Gantt bar */}
                <div className="flex-1 grid grid-cols-14 min-w-[700px] relative items-center py-2 px-1">
                  <div
                    className={`h-6 rounded-md flex items-center px-2 text-[10px] font-medium font-mono text-zinc-100 shadow-sm border transition-all ${
                      issue.status === 'done'
                        ? 'bg-emerald-900/60 border-emerald-700/80 text-emerald-200'
                        : issue.status === 'in_progress'
                        ? 'bg-amber-900/60 border-amber-700/80 text-amber-200'
                        : issue.status === 'in_review'
                        ? 'bg-purple-900/60 border-purple-700/80 text-purple-200'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                    }`}
                    style={{
                      gridColumnStart: startCol + 1,
                      gridColumnEnd: `span ${span}`
                    }}
                  >
                    <span className="truncate">{issue.identifier} ({issue.estimate} pts)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

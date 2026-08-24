import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Layers,
  Users,
  GitPullRequest
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { issues, cycles, users, state } = useWorkspace();

  const filteredIssues = issues.filter(
    (i) => state.currentTeamId === 'all' || i.teamId === state.currentTeamId
  );

  const doneIssues = filteredIssues.filter((i) => i.status === 'done');
  const inProgressIssues = filteredIssues.filter((i) => i.status === 'in_progress' || i.status === 'in_review');
  const todoIssues = filteredIssues.filter((i) => i.status === 'todo' || i.status === 'backlog');

  const totalPoints = filteredIssues.reduce((sum, i) => sum + i.estimate, 0);
  const donePoints = doneIssues.reduce((sum, i) => sum + i.estimate, 0);

  // Dynamic velocity data computed from real cycles and issues
  const velocityData = cycles.map((c) => {
    const cIssues = issues.filter((i) => i.cycleId === c.id);
    const pts = cIssues.filter((i) => i.status === 'done').reduce((s, i) => s + i.estimate, 0);
    return {
      cycle: c.name,
      points: pts,
      issuesCount: cIssues.length
    };
  });

  const maxPointsInCycles = Math.max(...velocityData.map((v) => v.points), 10);
  const avgVelocity =
    velocityData.length > 0
      ? (velocityData.reduce((acc, v) => acc + v.points, 0) / velocityData.length).toFixed(1)
      : '0.0';

  const prsCount = filteredIssues.reduce((sum, i) => sum + i.pullRequests.length, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Top Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <BarChart3 size={18} className="text-cyan-400" />
          Engineering Velocity & Insights
        </h2>
        <p className="text-xs text-zinc-400">
          Cycle time metrics, throughput velocity, PR turnaround, and workload distribution
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
            <Clock size={13} className="text-indigo-400" />
            Active Tickets
          </span>
          <div className="text-2xl font-bold text-zinc-100 font-mono">
            {filteredIssues.length} <span className="text-sm font-normal text-zinc-400">tickets</span>
          </div>
          <p className="text-[11px] text-zinc-500">{inProgressIssues.length} in development</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
            <GitPullRequest size={13} className="text-purple-400" />
            Linked Pull Requests
          </span>
          <div className="text-2xl font-bold text-purple-300 font-mono">
            {prsCount} <span className="text-sm font-normal text-zinc-400">PRs</span>
          </div>
          <p className="text-[11px] text-zinc-500">Across GitHub / GitLab</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
            <TrendingUp size={13} className="text-emerald-400" />
            Sprint Velocity
          </span>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            {avgVelocity} <span className="text-sm font-normal text-zinc-400">pts / cycle</span>
          </div>
          <p className="text-[11px] text-zinc-500">{cycles.length} sprint cycles tracked</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-sky-400" />
            Completed Work
          </span>
          <div className="text-2xl font-bold text-sky-300 font-mono">
            {donePoints} <span className="text-sm font-normal text-zinc-400">/ {totalPoints} pts</span>
          </div>
          <p className="text-[11px] text-zinc-500">{doneIssues.length} tickets resolved</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Velocity Comparison */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-400" />
              Velocity Trends Across Cycles
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Story Points Completed</span>
          </div>

          {velocityData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500">No sprint cycles created yet.</p>
              <span className="text-[11px] text-zinc-600 mt-1">
                Schedule a sprint cycle to see real burndown points.
              </span>
            </div>
          ) : (
            <div className="h-48 flex items-end gap-6 pt-6 px-4 border-b border-zinc-800">
              {velocityData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-mono font-bold text-zinc-300 group-hover:text-indigo-400 transition-colors">
                    {item.points} pts
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 group-hover:from-indigo-600 group-hover:to-indigo-400 rounded-t-lg transition-all"
                    style={{ height: `${Math.max((item.points / maxPointsInCycles) * 100, 6)}%` }}
                  />
                  <span className="text-[10px] text-zinc-400 font-mono text-center truncate w-full">
                    {item.cycle}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
            <Layers size={16} className="text-amber-400" />
            Issue Status Distribution
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Done', count: doneIssues.length, color: '#10b981', points: donePoints },
              {
                label: 'In Progress / Review',
                count: inProgressIssues.length,
                color: '#f59e0b',
                points: inProgressIssues.reduce((s, i) => s + i.estimate, 0)
              },
              {
                label: 'Todo / Backlog',
                count: todoIssues.length,
                color: '#6366f1',
                points: todoIssues.reduce((s, i) => s + i.estimate, 0)
              }
            ].map((st) => {
              const pct = filteredIssues.length > 0 ? Math.round((st.count / filteredIssues.length) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{st.label}</span>
                    <span className="text-zinc-400 font-mono">
                      {st.count} issues ({st.points} pts • {pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: st.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Workload & Assignee Distribution */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
        <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
          <Users size={16} className="text-sky-400" />
          Team Workload & Assigned Story Points
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user) => {
            const userIssues = filteredIssues.filter((i) => i.assigneeId === user.id);
            const userPoints = userIssues.reduce((s, i) => s + i.estimate, 0);
            const userDone = userIssues.filter((i) => i.status === 'done').length;

            return (
              <div
                key={user.id}
                className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-100 text-xs truncate">{user.name}</p>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1 font-mono text-xs">
                  <span className="text-zinc-400">Total Work:</span>
                  <span className="font-bold text-indigo-300">{userPoints} pts</span>
                </div>
                <div className="flex items-baseline justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Completed:</span>
                  <span>{userDone}/{userIssues.length} issues</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

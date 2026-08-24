import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Cycle, Issue } from '../../types';
import { IssueStatusIcon } from '../issues/IssueStatusIcon';
import {
  Repeat,
  Flame,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus,
  RotateCw,
  Clock
} from 'lucide-react';

export const CyclesView: React.FC = () => {
  const {
    cycles,
    issues,
    activeCycle,
    rolloverCycle,
    createCycle,
    setSelectedIssueId,
    state
  } = useWorkspace();

  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCycleName.trim()) return;
    createCycle({
      name: newCycleName.trim(),
      status: 'upcoming'
    });
    setNewCycleName('');
    setShowNewCycleModal(false);
  };

  const currentCycle = activeCycle || cycles[0];

  if (cycles.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-zinc-950/60">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <Repeat size={22} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">No sprint cycles scheduled</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
          Sprint cycles help your team organize work into time-boxed iterations with automated rollovers and burndown velocity.
        </p>
        <button
          onClick={() => setShowNewCycleModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={14} />
          Create First Sprint Cycle
        </button>

        {showNewCycleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-md w-full space-y-4 text-left">
              <h3 className="font-semibold text-zinc-100 text-sm">Schedule Sprint Cycle</h3>
              <form onSubmit={handleCreateCycle} className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Cycle Name</label>
                  <input
                    type="text"
                    value={newCycleName}
                    onChange={(e) => setNewCycleName(e.target.value)}
                    placeholder="e.g. Cycle 1 - Core Foundations"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewCycleModal(false)}
                    className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Create Cycle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const cycleIssues = issues.filter(
    (i) =>
      currentCycle &&
      i.cycleId === currentCycle.id &&
      (state.currentTeamId === 'all' || i.teamId === state.currentTeamId)
  );

  const totalPoints = cycleIssues.reduce((sum, i) => sum + i.estimate, 0);
  const completedIssues = cycleIssues.filter((i) => i.status === 'done');
  const completedPoints = completedIssues.reduce((sum, i) => sum + i.estimate, 0);
  const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const inProgressIssues = cycleIssues.filter((i) => i.status === 'in_progress' || i.status === 'in_review');
  const todoIssues = cycleIssues.filter((i) => i.status === 'todo' || i.status === 'backlog');

  const upcomingCycles = cycles.filter((c) => c.status === 'upcoming');
  const completedCycles = cycles.filter((c) => c.status === 'completed');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Active Cycle Hero Card */}
      {currentCycle && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Sprint Cadence
                </span>
                <span className="text-zinc-400 text-xs font-mono">
                  Cycle #{currentCycle.number}
                </span>
              </div>
              <h2 className="text-xl font-bold text-zinc-100">{currentCycle.name}</h2>
              <p className="text-xs text-zinc-400 max-w-xl">{currentCycle.description}</p>
            </div>

            {/* Quick Rollover Sprint Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => rolloverCycle(currentCycle.id)}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-lg text-xs font-bold shadow-md transition-colors"
                title="Automate sprint rollover: finish cycle and migrate open issues"
              >
                <RotateCw size={14} />
                Complete & Rollover Unfinished Work
              </button>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {/* Progress Card */}
            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl space-y-2">
              <span className="text-zinc-500 text-xs font-medium">Sprint Completion</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-100 font-mono">
                  {completionPercentage}%
                </span>
                <span className="text-xs text-zinc-400">
                  ({completedPoints}/{totalPoints} pts)
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* In Progress Points */}
            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl space-y-1">
              <span className="text-zinc-500 text-xs font-medium">In Progress / Review</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                {inProgressIssues.reduce((sum, i) => sum + i.estimate, 0)} pts
              </div>
              <p className="text-[11px] text-zinc-500">{inProgressIssues.length} active tickets</p>
            </div>

            {/* Remaining Backlog Points */}
            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl space-y-1">
              <span className="text-zinc-500 text-xs font-medium">Remaining Todo</span>
              <div className="text-2xl font-bold text-zinc-300 font-mono">
                {todoIssues.reduce((sum, i) => sum + i.estimate, 0)} pts
              </div>
              <p className="text-[11px] text-zinc-500">{todoIssues.length} tickets to begin</p>
            </div>

            {/* Velocity & Scope Creep */}
            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl space-y-1">
              <span className="text-zinc-500 text-xs font-medium">Scope Stability</span>
              <div className="text-2xl font-bold text-sky-400 font-mono">+3 pts</div>
              <p className="text-[11px] text-zinc-500">1 mid-cycle ticket added</p>
            </div>
          </div>

          {/* Burndown Graph Representation */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-emerald-400" />
                <span className="font-semibold text-zinc-200">Velocity Burndown (Ideal vs Actual)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-zinc-500" /> Ideal Guideline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-emerald-400 rounded-full" /> Actual Remaining
                </span>
              </div>
            </div>

            {/* Stylized CSS Burndown Chart */}
            <div className="h-32 flex items-end gap-2 pt-4 px-2 border-b border-zinc-800">
              {[
                { day: 'D1', remaining: 23, ideal: 23 },
                { day: 'D2', remaining: 23, ideal: 21 },
                { day: 'D3', remaining: 20, ideal: 19 },
                { day: 'D4', remaining: 18, ideal: 17 },
                { day: 'D5', remaining: 15, ideal: 15 },
                { day: 'D6', remaining: 15, ideal: 13 },
                { day: 'D7', remaining: 12, ideal: 11 },
                { day: 'D8', remaining: 10, ideal: 9 },
                { day: 'D9', remaining: 7, ideal: 7 },
                { day: 'D10', remaining: 5, ideal: 5 }
              ].map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Actual Bar */}
                    <div
                      className="w-3/5 bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition-all"
                      style={{ height: `${(pt.remaining / 25) * 100}%` }}
                      title={`Day ${pt.day}: ${pt.remaining} pts remaining`}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{pt.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Cycle Issues List */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Assigned Tickets in this Cycle ({cycleIssues.length})
            </h3>
            <div className="divide-y divide-zinc-850 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
              {cycleIssues.map((iss) => (
                <div
                  key={iss.id}
                  onClick={() => setSelectedIssueId(iss.id)}
                  className="flex items-center justify-between p-3 hover:bg-zinc-800/40 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IssueStatusIcon status={iss.status} size={14} />
                    <span className="font-mono text-zinc-400 font-semibold">{iss.identifier}</span>
                    <span className="text-zinc-200 font-medium truncate">{iss.title}</span>
                  </div>
                  <span className="font-mono text-zinc-400 text-[11px]">{iss.estimate} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming & Completed Cycles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Cycles */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
              <Calendar size={16} className="text-sky-400" />
              Upcoming Sprints ({upcomingCycles.length})
            </h3>
            <button
              onClick={() => setShowNewCycleModal(true)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Plus size={13} />
              Schedule Cycle
            </button>
          </div>

          <div className="space-y-3">
            {upcomingCycles.map((c) => {
              const count = issues.filter((i) => i.cycleId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{c.name}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-950/50 text-sky-300 text-[10px] font-mono">
                      Upcoming
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{c.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
                    <span>{count} planned tickets</span>
                    <span>Starts {new Date(c.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Previous Completed Cycles */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Previous Completed Cycles ({completedCycles.length})
            </h3>
          </div>

          <div className="space-y-3">
            {completedCycles.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{c.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 text-[10px] font-mono">
                    100% Shipped
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{c.description}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
                  <span>Velocity: 28 pts</span>
                  <span>Closed {new Date(c.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Cycle Modal */}
      {showNewCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="font-semibold text-zinc-100 text-sm">Schedule New Sprint Cycle</h3>
            <form onSubmit={handleCreateCycle} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Cycle Name</label>
                <input
                  type="text"
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                  placeholder="e.g. Cycle 25 - Real-time Collaboration Engine"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCycleModal(false)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                >
                  Create Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

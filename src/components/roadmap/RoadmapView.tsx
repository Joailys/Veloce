import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Map, Calendar, Layers, ChevronRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { ProjectHealth } from '../../types';

export const RoadmapView: React.FC = () => {
  const { projects, teams, users, setSelectedIssueId } = useWorkspace();
  const [selectedQuarter, setSelectedQuarter] = useState<'all' | 'Q3' | 'Q4'>('all');

  const quarters = [
    { id: 'Q1', label: 'Q1 2026 (Jan - Mar)', months: ['Jan', 'Feb', 'Mar'] },
    { id: 'Q2', label: 'Q2 2026 (Apr - Jun)', months: ['Apr', 'May', 'Jun'] },
    { id: 'Q3', label: 'Q3 2026 (Jul - Sep)', months: ['Jul', 'Aug', 'Sep'] },
    { id: 'Q4', label: 'Q4 2026 (Oct - Dec)', months: ['Oct', 'Nov', 'Dec'] }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Map size={18} className="text-purple-400" />
            Strategic Product Roadmap 2026
          </h2>
          <p className="text-xs text-zinc-400">
            Multi-quarter milestones, strategic deliverables and cross-functional team initiatives
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setSelectedQuarter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedQuarter === 'all' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
            }`}
          >
            All 2026
          </button>
          <button
            onClick={() => setSelectedQuarter('Q3')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedQuarter === 'Q3' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
            }`}
          >
            Current (Q3)
          </button>
          <button
            onClick={() => setSelectedQuarter('Q4')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedQuarter === 'Q4' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
            }`}
          >
            Future (Q4)
          </button>
        </div>
      </div>

      {/* Roadmap Timeline Matrix */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        {/* Timeline Quarters Header */}
        <div className="grid grid-cols-12 border-b border-zinc-800 bg-zinc-950/80 text-xs font-semibold text-zinc-400">
          <div className="col-span-4 p-3.5 border-r border-zinc-800">
            Strategic Initiatives
          </div>
          <div className="col-span-8 grid grid-cols-4 divide-x divide-zinc-800 text-center">
            <div className="p-3.5 bg-zinc-900/40">Q1 2026</div>
            <div className="p-3.5 bg-zinc-900/40">Q2 2026</div>
            <div className="p-3.5 bg-indigo-950/40 text-indigo-300 font-bold">
              Q3 2026 <span className="text-[10px] text-indigo-400 font-mono">(Current)</span>
            </div>
            <div className="p-3.5 bg-zinc-900/40">Q4 2026</div>
          </div>
        </div>

        {/* Initiatives Bars */}
        <div className="divide-y divide-zinc-850">
          {projects.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No active initiatives scheduled on the strategic roadmap.
            </div>
          ) : (
            projects.map((proj, idx) => {
              const team = teams.find((t) => t.id === proj.teamId);
              const lead = users.find((u) => u.id === proj.leadId);

              // Calculate placement across quarters
              const startOffset = idx === 0 ? 55 : idx === 1 ? 50 : idx === 2 ? 45 : 35;
              const width = idx === 0 ? 30 : idx === 1 ? 25 : idx === 2 ? 35 : 25;

              return (
                <div
                  key={proj.id}
                  className="grid grid-cols-12 items-center hover:bg-zinc-800/30 transition-colors text-xs"
                >
                  {/* Left: Project info */}
                  <div className="col-span-4 p-3.5 border-r border-zinc-850 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="font-bold text-zinc-100 truncate">{proj.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                      <span>{team?.name}</span>
                      <span>•</span>
                      <span>Lead: {lead?.name}</span>
                    </div>
                  </div>

                  {/* Right: Interactive Timeline Gantt Bar */}
                  <div className="col-span-8 p-3.5 relative flex items-center h-16">
                    {/* Grid Quarter guides */}
                    <div className="absolute inset-0 grid grid-cols-4 divide-x divide-zinc-800/40 pointer-events-none" />

                    {/* The Initiative bar */}
                    <div
                      className="relative z-10 h-9 rounded-lg shadow-md flex items-center justify-between px-3 text-white font-medium transition-all group cursor-pointer"
                      style={{
                        marginLeft: `${startOffset}%`,
                        width: `${width}%`,
                        backgroundColor: proj.color
                      }}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-mono text-[10px] uppercase font-bold bg-black/30 px-1 rounded">
                          {proj.key}
                        </span>
                        <span className="truncate text-xs font-semibold">{proj.name}</span>
                      </div>

                      <span className="text-[10px] font-mono shrink-0 ml-2 bg-black/40 px-1.5 py-0.5 rounded">
                        {proj.targetDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Strategic Themes Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Zero-Trust & Security
          </span>
          <p className="text-xs text-zinc-300">
            Transitioning enterprise workloads to biometric WebAuthn and end-to-end cryptographic delta audit streams.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Sub-10ms Speed Engine
          </span>
          <p className="text-xs text-zinc-300">
            Fuzzy index trie search, full keyboard-first action dispatch HUD, and Redis sliding-window socket batching.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Dev Ecosystem Automation
          </span>
          <p className="text-xs text-zinc-300">
            Bi-directional GitHub/GitLab PR synchronizer, Sentry crash ingestion with auto-triage rules, and Figma token pipelines.
          </p>
        </div>
      </div>
    </div>
  );
};

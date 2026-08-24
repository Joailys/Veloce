import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Project, ProjectHealth } from '../../types';
import {
  FolderGit2,
  Plus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    issues,
    users,
    teams,
    createProject,
    updateProject,
    setSelectedIssueId,
    state
  } = useWorkspace();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // New Project Form state
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [teamId, setTeamId] = useState(teams[0]?.id || '');
  const [leadId, setLeadId] = useState(users[0]?.id || '');
  const [targetDate, setTargetDate] = useState('2026-09-30');
  const [color, setColor] = useState('#6366f1');

  const getHealthBadge = (health: ProjectHealth) => {
    switch (health) {
      case 'on_track':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            On Track
          </span>
        );
      case 'at_risk':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1">
            <AlertTriangle size={11} />
            At Risk
          </span>
        );
      case 'delayed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-950/60 text-red-300 border border-red-800/60 flex items-center gap-1">
            <Clock size={11} />
            Delayed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60 flex items-center gap-1">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name: name.trim(),
      summary: summary.trim(),
      teamId,
      leadId,
      targetDate,
      color,
      health: 'on_track'
    });

    setName('');
    setSummary('');
    setShowCreateModal(false);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectIssues = selectedProject
    ? issues.filter((i) => i.projectId === selectedProject.id)
    : [];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <FolderGit2 size={18} className="text-indigo-400" />
            Projects & Initiatives
          </h2>
          <p className="text-xs text-zinc-400">
            Strategic milestones, target releases, and cross-team roadmaps
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
            <FolderGit2 size={22} />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">No projects yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
            Projects allow your engineering and product teams to bundle related epics, milestones, and cross-cycle issues.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={14} />
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => {
            const pIssues = issues.filter((i) => i.projectId === proj.id);
            const totalPoints = pIssues.reduce((sum, i) => sum + i.estimate, 0);
            const doneIssues = pIssues.filter((i) => i.status === 'done');
            const donePoints = doneIssues.reduce((sum, i) => sum + i.estimate, 0);
            const progress = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
            const lead = users.find((u) => u.id === proj.leadId);
            const team = teams.find((t) => t.id === proj.teamId);

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 shadow-lg cursor-pointer transition-all space-y-4 group"
              >
                {/* Header: Name, Health */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase px-1.5 py-0.2 bg-zinc-950 rounded">
                        {proj.key}
                      </span>
                      <span className="text-[11px] text-zinc-400 truncate">{team?.name}</span>
                    </div>
                    <h3 className="font-bold text-zinc-100 text-sm truncate group-hover:text-indigo-400 transition-colors">
                      {proj.name}
                    </h3>
                  </div>

                  {getHealthBadge(proj.health)}
                </div>

                {/* Summary */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {proj.summary}
                </p>

                {/* Progress Bar & Stats */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>{progress}% complete</span>
                    <span>
                      {donePoints}/{totalPoints} pts ({doneIssues.length}/{pIssues.length} tickets)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: proj.color
                      }}
                    />
                  </div>
                </div>

                {/* Milestones checklist snippet */}
                {proj.milestones.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-semibold text-zinc-500">
                      Key Milestones
                    </span>
                    <div className="space-y-1">
                      {proj.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-[11px] text-zinc-400"
                        >
                          <span className="flex items-center gap-1.5">
                            {m.completed ? (
                              <CheckCircle2 size={12} className="text-emerald-400" />
                            ) : (
                              <Clock size={12} className="text-zinc-600" />
                            )}
                            <span className={m.completed ? 'line-through text-zinc-500' : ''}>
                              {m.title}
                            </span>
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500">{m.targetDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer: Lead avatar & Target Date */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-850 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    {lead && (
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                      />
                    )}
                    <span className="text-[11px] text-zinc-300">{lead?.name}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Calendar size={12} className="text-zinc-500" />
                    <span>Target: {proj.targetDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-indigo-400 uppercase font-bold">
                  {selectedProject.key}
                </span>
                <h3 className="text-lg font-bold text-zinc-100">{selectedProject.name}</h3>
                <p className="text-xs text-zinc-400">{selectedProject.description}</p>
              </div>
              <button
                onClick={() => setSelectedProjectId(null)}
                className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            {/* Health updater */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-zinc-400">Health Status:</span>
              {(['on_track', 'at_risk', 'delayed', 'completed'] as ProjectHealth[]).map((h) => (
                <button
                  key={h}
                  onClick={() => updateProject(selectedProject.id, { health: h })}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    selectedProject.health === h ? 'ring-2 ring-indigo-500 font-bold' : 'opacity-60'
                  }`}
                >
                  {getHealthBadge(h)}
                </button>
              ))}
            </div>

            {/* Associated Tickets */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Linked Tickets ({projectIssues.length})
              </h4>
              <div className="divide-y divide-zinc-850 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
                {projectIssues.map((iss) => (
                  <div
                    key={iss.id}
                    onClick={() => {
                      setSelectedProjectId(null);
                      setSelectedIssueId(iss.id);
                    }}
                    className="flex items-center justify-between p-2.5 hover:bg-zinc-800/40 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400 font-semibold">{iss.identifier}</span>
                      <span className="text-zinc-200 font-medium">{iss.title}</span>
                    </div>
                    <span className="font-mono text-zinc-500 text-[11px]">{iss.estimate} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-lg w-full space-y-4">
            <h3 className="font-semibold text-zinc-100 text-sm">Create New Initiative</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Search Engine v3"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Executive Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description of the initiative's strategic goal..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Team</label>
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-200"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Project Lead</label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-200"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-200"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Accent Color</label>
                  <div className="flex gap-2 pt-1">
                    {['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full border ${
                          color === c ? 'ring-2 ring-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

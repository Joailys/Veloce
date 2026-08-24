import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Settings,
  Shield,
  Users,
  Database,
  Download,
  Upload,
  RefreshCw,
  Check,
  Building,
  Tag,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Layers,
  Eraser
} from 'lucide-react';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    teams,
    users,
    labels,
    issues,
    projects,
    cycles,
    createTeam,
    deleteTeam,
    createUser,
    deleteUser,
    createLabel,
    deleteLabel,
    clearAllData,
    resetToDefault,
    exportWorkspaceJson,
    importWorkspaceJson,
    addToast
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'labels' | 'roles' | 'data'>('general');

  // Form states for modals / inline add
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamKey, setTeamKey] = useState('');
  const [teamDesc, setTeamDesc] = useState('');

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<UserRole>('member');

  const [showAddLabel, setShowAddLabel] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('#6366f1');

  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const permissionsMatrix: { feature: string; admin: boolean; lead: boolean; member: boolean; guest: boolean }[] = [
    { feature: 'Create & Delete Issues', admin: true, lead: true, member: true, guest: false },
    { feature: 'Manage Sprint Cycles & Rollovers', admin: true, lead: true, member: false, guest: false },
    { feature: 'Create & Edit Strategic Projects', admin: true, lead: true, member: true, guest: false },
    { feature: 'Configure Dev Webhooks & Integrations', admin: true, lead: true, member: false, guest: false },
    { feature: 'Manage Workflow Automations Rules', admin: true, lead: true, member: false, guest: false },
    { feature: 'Export Full Database Backups', admin: true, lead: false, member: false, guest: false },
    { feature: 'View Roadmaps & Sprint Velocity', admin: true, lead: true, member: true, guest: true }
  ];

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamKey.trim()) return;
    createTeam({
      name: teamName.trim(),
      key: teamKey.trim().toUpperCase(),
      description: teamDesc.trim(),
      icon: 'Cpu'
    });
    setTeamName('');
    setTeamKey('');
    setTeamDesc('');
    setShowAddTeam(false);
  };

  const handleCreateMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const avatarUrl = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`;
    
    createUser({
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: memberRole,
      avatar: avatarUrl
    });
    setMemberName('');
    setMemberEmail('');
    setShowAddMember(false);
  };

  const handleCreateLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelName.trim()) return;
    createLabel({
      name: labelName.trim().toLowerCase(),
      color: labelColor
    });
    setLabelName('');
    setShowAddLabel(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importWorkspaceJson(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const success = importWorkspaceJson(importJsonText.trim());
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
    }
  };

  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981',
    '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899', '#71717a'
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Top Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Settings size={18} className="text-zinc-400" />
          Workspace & Organization Settings
        </h2>
        <p className="text-xs text-zinc-400">
          Configure security permissions, team definitions, team members, labels, and production data lifecycle
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'general' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Building size={14} />
          Teams ({teams.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'members' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users size={14} />
          Members ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('labels')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'labels' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Tag size={14} />
          Labels ({labels.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'roles' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield size={14} />
          Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'data' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Database size={14} />
          Data & Clean Reset
        </button>
      </div>

      {/* Tab: General (Teams & Organization) */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Workspace Details */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="font-semibold text-zinc-200 text-sm">Organization Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue="Acme Cloud Technologies"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Custom URL Slug</label>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md px-2 text-zinc-400">
                  <span>app.veloce.io/</span>
                  <input
                    type="text"
                    defaultValue="acme-cloud"
                    className="bg-transparent p-2 text-zinc-200 focus:outline-none flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Teams Table */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-zinc-200 text-sm">Configured Teams</h3>
                <p className="text-xs text-zinc-500">Each team owns an issue identifier prefix (e.g. ENG-101)</p>
              </div>
              <button
                onClick={() => setShowAddTeam(!showAddTeam)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus size={14} />
                Add Team
              </button>
            </div>

            {/* Add Team Form */}
            {showAddTeam && (
              <form onSubmit={handleCreateTeamSubmit} className="p-3 bg-zinc-950 border border-zinc-700/80 rounded-lg space-y-3">
                <h4 className="text-xs font-semibold text-zinc-200">Create New Team</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Team Name (e.g. Mobile iOS)"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md p-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Key Identifier (e.g. MOB)"
                    value={teamKey}
                    onChange={(e) => setTeamKey(e.target.value.toUpperCase())}
                    maxLength={5}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono uppercase rounded-md p-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={teamDesc}
                    onChange={(e) => setTeamDesc(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md p-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTeam(false)}
                    className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                  >
                    Save Team
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-zinc-850 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40 text-xs">
              {teams.map((t) => {
                const teamIssuesCount = issues.filter((i) => i.teamId === t.id).length;
                return (
                  <div key={t.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded">
                        {t.key}
                      </span>
                      <div>
                        <h4 className="font-bold text-zinc-200">{t.name}</h4>
                        <p className="text-[11px] text-zinc-500">{t.description || 'No description'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {teamIssuesCount} issues
                      </span>
                      {teams.length > 1 && (
                        <button
                          onClick={() => deleteTeam(t.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 hover:bg-zinc-800 rounded transition-colors"
                          title="Delete Team"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Members Management */}
      {activeTab === 'members' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-zinc-200 text-sm">Workspace Members</h3>
              <p className="text-xs text-zinc-500">Collaborators assigned to tickets, reviews, and cycles</p>
            </div>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={14} />
              Add Member
            </button>
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <form onSubmit={handleCreateMemberSubmit} className="p-3 bg-zinc-950 border border-zinc-700/80 rounded-lg space-y-3">
              <h4 className="text-xs font-semibold text-zinc-200">Invite New Team Member</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Thomas Laurent)"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md p-2 focus:outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md p-2 focus:outline-none focus:border-indigo-500"
                  required
                />
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as UserRole)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md p-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="admin">Admin</option>
                  <option value="lead">Tech Lead</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest / Viewer</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Add Member
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-zinc-850 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40 text-xs">
            {users.map((u) => {
              const assignedCount = issues.filter((i) => i.assigneeId === u.id).length;
              return (
                <div key={u.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <h4 className="font-bold text-zinc-200">{u.name}</h4>
                      <p className="text-[11px] text-zinc-500">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="capitalize px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono text-[10px]">
                      {u.role}
                    </span>
                    <span className="text-zinc-500 text-[11px] font-mono">
                      {assignedCount} issues
                    </span>
                    {users.length > 1 && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 hover:bg-zinc-800 rounded transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Labels Management */}
      {activeTab === 'labels' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-zinc-200 text-sm">Issue Labels</h3>
              <p className="text-xs text-zinc-500">Color-coded categorization tags for bug triage, features, and tech debt</p>
            </div>
            <button
              onClick={() => setShowAddLabel(!showAddLabel)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={14} />
              Add Label
            </button>
          </div>

          {/* Add Label Form */}
          {showAddLabel && (
            <form onSubmit={handleCreateLabelSubmit} className="p-3 bg-zinc-950 border border-zinc-700/80 rounded-lg space-y-3">
              <h4 className="text-xs font-semibold text-zinc-200">Create New Label</h4>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  placeholder="Label name (e.g. security, performance)"
                  value={labelName}
                  onChange={(e) => setLabelName(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md p-2 focus:outline-none focus:border-indigo-500"
                  required
                />
                <div className="flex items-center gap-1.5">
                  {presetColors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setLabelColor(c)}
                      className={`w-6 h-6 rounded-full border transition-transform ${
                        labelColor === c ? 'scale-110 border-white ring-2 ring-indigo-500/50' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLabel(false)}
                  className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Save Label
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {labels.map((l) => {
              const labeledCount = issues.filter((i) => i.labelIds.includes(l.id)).length;
              return (
                <div
                  key={l.id}
                  className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                    <span className="font-semibold text-zinc-200">{l.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-mono text-[10px]">{labeledCount} tickets</span>
                    <button
                      onClick={() => deleteLabel(l.id)}
                      className="text-zinc-600 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete Label"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Permissions Matrix */}
      {activeTab === 'roles' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-zinc-200 text-sm">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-zinc-400">Granular permission governance for workspace team members</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] font-mono">
                  <th className="py-2.5 px-3">Capability / Operation</th>
                  <th className="py-2.5 px-3 text-center">Admin</th>
                  <th className="py-2.5 px-3 text-center">Tech Lead</th>
                  <th className="py-2.5 px-3 text-center">Member</th>
                  <th className="py-2.5 px-3 text-center">Guest / Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-zinc-200">{row.feature}</td>
                    <td className="py-3 px-3 text-center">
                      {row.admin ? (
                        <Check size={14} className="text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.lead ? (
                        <Check size={14} className="text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.member ? (
                        <Check size={14} className="text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.guest ? (
                        <Check size={14} className="text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Data & Clean Reset */}
      {activeTab === 'data' && (
        <div className="space-y-5">
          {/* Clean Workspace / Wipe Data */}
          <div className="bg-zinc-900/90 border border-amber-900/40 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Eraser size={18} />
              <span>Clean Workspace (Start Fresh Without Fake Data)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Clear all demo tickets, sample cycles, and mock projects so you can start working immediately with real team data and zero clutter.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Clear all sample data and start completely fresh?')) {
                  clearAllData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Eraser size={14} />
              Wipe Fake Data & Start Clean
            </button>
          </div>

          {/* Export / Import */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-lg">
              <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
                <Download size={16} className="text-indigo-400" />
                Export Workspace Backup
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download JSON snapshot containing all issues, cycles, projects, comments, and automations.
              </p>
              <button
                onClick={exportWorkspaceJson}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download size={14} />
                Download JSON Backup
              </button>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-lg">
              <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
                <Upload size={16} className="text-sky-400" />
                Import Workspace JSON
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload or paste a JSON backup to restore or import project data.
              </p>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
                >
                  <Upload size={13} />
                  Choose File
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Paste JSON
                </button>
              </div>
            </div>
          </div>

          {/* Reset Demo Dataset */}
          <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-5 space-y-3 shadow-lg">
            <h3 className="font-semibold text-red-300 text-sm flex items-center gap-2">
              <RefreshCw size={16} className="text-red-400" />
              Restore Sample Demo Dataset
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Reset tickets, cycles, and projects back to initial high-performance sample dataset.
            </p>
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-3.5 py-2 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw size={14} />
              Restore Initial Data
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100">Paste Workspace JSON Backup</h3>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              rows={8}
              placeholder="Paste JSON object here..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleImportTextSubmit}
                disabled={!importJsonText.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold"
              >
                Import Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Bot,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
  Zap,
  Trash2,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { AutomationTrigger, AutomationAction } from '../../types';

export const AutomationsView: React.FC = () => {
  const {
    automations,
    automationLogs,
    toggleAutomationRule,
    createAutomationRule,
    deleteAutomationRule
  } = useWorkspace();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<AutomationTrigger>('pr_merged');
  const [action, setAction] = useState<AutomationAction>('set_status_done');

  const triggersList: { id: AutomationTrigger; label: string }[] = [
    { id: 'pr_merged', label: 'When GitHub / GitLab PR is Merged' },
    { id: 'pr_opened', label: 'When GitHub / GitLab PR is Opened' },
    { id: 'sentry_alert_received', label: 'When Sentry Error Alert is Ingested' },
    { id: 'issue_priority_urgent', label: 'When Issue Priority is set to Urgent (P1)' },
    { id: 'issue_status_done', label: 'When Issue is marked as Done' },
    { id: 'cycle_completed', label: 'When Active Sprint Cycle ends' }
  ];

  const actionsList: { id: AutomationAction; label: string }[] = [
    { id: 'set_status_done', label: 'Transition Issue Status to "Done"' },
    { id: 'set_status_in_review', label: 'Transition Issue Status to "In Review"' },
    { id: 'assign_lead', label: 'Auto-assign Team Lead to Issue' },
    { id: 'add_label_bug', label: 'Attach Label "Bug" and set High Priority' },
    { id: 'post_slack_notification', label: 'Broadcast Message to Slack #eng-triage' },
    { id: 'rollover_to_next_cycle', label: 'Migrate Unfinished Issues to Next Cycle' }
  ];

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createAutomationRule({
      name: name.trim(),
      description: description.trim() || 'Custom workflow rule',
      enabled: true,
      trigger,
      action
    });

    setName('');
    setDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Bot size={18} className="text-fuchsia-400" />
            Workflow Automations Engine
          </h2>
          <p className="text-xs text-zinc-400">
            Define declarative triggers and actions to automate engineering tickets and sprint rituals
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus size={14} />
          New Automation Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-xl border transition-all shadow-md space-y-4 ${
              rule.enabled
                ? 'bg-zinc-900/90 border-zinc-700/80'
                : 'bg-zinc-950/60 border-zinc-850 opacity-60'
            }`}
          >
            {/* Header & Toggle */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap size={14} className={rule.enabled ? 'text-amber-400' : 'text-zinc-500'} />
                  <h3 className="font-bold text-zinc-100 text-sm">{rule.name}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{rule.description}</p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleAutomationRule(rule.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                  rule.enabled ? 'bg-indigo-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Visual Logic Flow: IF Trigger -> THEN Action */}
            <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800 flex items-center gap-2 text-xs font-mono">
              <div className="flex-1 bg-zinc-900 px-2.5 py-1.5 rounded border border-zinc-800 text-zinc-300">
                <span className="text-indigo-400 font-bold">WHEN:</span> {rule.trigger.replace(/_/g, ' ')}
              </div>
              <ArrowRight size={14} className="text-zinc-600 shrink-0" />
              <div className="flex-1 bg-zinc-900 px-2.5 py-1.5 rounded border border-zinc-800 text-zinc-300">
                <span className="text-emerald-400 font-bold">THEN:</span> {rule.action.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-500 font-mono">
              <span>Executed: <strong className="text-zinc-300">{rule.executionCount} times</strong></span>
              {rule.lastExecutedAt && (
                <span>Last run: {new Date(rule.lastExecutedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Execution Logs Feed */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
            <History size={16} className="text-indigo-400" />
            Live Automation Execution Audit Log
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            {automationLogs.length} events logged
          </span>
        </div>

        <div className="divide-y divide-zinc-850 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
          {automationLogs.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-xs">
              No automation events triggered yet. Rules will execute automatically as issues and developer actions occur.
            </div>
          ) : (
            automationLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 flex items-center justify-between hover:bg-zinc-900/50 transition-colors text-xs font-mono"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-200 truncate">{log.ruleName}</p>
                    <span className="text-zinc-400 text-[11px]">
                      Trigger: <span className="text-zinc-300">{log.trigger}</span> → Action: <span className="text-emerald-300">{log.actionTaken}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {log.issueIdentifier && (
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-bold">
                      {log.issueIdentifier}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-lg w-full space-y-4">
            <h3 className="font-semibold text-zinc-100 text-sm">Create Workflow Automation</h3>
            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Move to Done on Squash Merge"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Trigger (WHEN)</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-200"
                >
                  {triggersList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Action (THEN)</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as AutomationAction)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-200"
                >
                  {actionsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
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
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Plug,
  GitPullRequest,
  Flame,
  MessageSquare,
  Figma,
  CheckCircle2,
  Zap,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Code
} from 'lucide-react';
import { Integration } from '../../types';

export const IntegrationsView: React.FC = () => {
  const {
    integrations,
    toggleIntegration,
    simulateGitEvent,
    simulateSentryAlert,
    issues,
    addToast
  } = useWorkspace();

  const [simulatedPayload, setSimulatedPayload] = useState<string | null>(null);

  const handleSimulate = (type: 'pr_merge' | 'pr_open' | 'sentry') => {
    if (type === 'pr_merge') {
      simulateGitEvent('pr_merge');
      setSimulatedPayload(
        JSON.stringify(
          {
            event: 'pull_request.closed',
            action: 'merged',
            repository: 'veloce-app/core',
            sender: 'alexriver',
            pull_request: {
              number: 489,
              title: 'perf(sync): sliding window batching for delta pubsub',
              merged: true,
              merged_at: new Date().toISOString()
            }
          },
          null,
          2
        )
      );
    } else if (type === 'pr_open') {
      simulateGitEvent('pr_open');
      setSimulatedPayload(
        JSON.stringify(
          {
            event: 'pull_request.opened',
            repository: 'veloce-app/web',
            sender: 'sarahchen',
            pull_request: {
              number: 143,
              title: 'feat(auth): biometric authentication passkeys',
              draft: false,
              created_at: new Date().toISOString()
            }
          },
          null,
          2
        )
      );
    } else {
      simulateSentryAlert();
      setSimulatedPayload(
        JSON.stringify(
          {
            event: 'sentry.issue_alert',
            project: 'veloce-production-app',
            issue: {
              id: 'ERR-8120',
              title: 'RedisConnectionTimeout: connection timed out to cluster master',
              events_count: 512,
              impacted_users: 39,
              level: 'error',
              timestamp: new Date().toISOString()
            }
          },
          null,
          2
        )
      );
    }
  };

  const getIntegrationIcon = (id: Integration['id']) => {
    switch (id) {
      case 'github':
        return <GitPullRequest size={22} className="text-zinc-100" />;
      case 'gitlab':
        return <GitPullRequest size={22} className="text-orange-400" />;
      case 'sentry':
        return <Flame size={22} className="text-orange-500" />;
      case 'slack':
        return <MessageSquare size={22} className="text-emerald-400" />;
      case 'figma':
        return <Figma size={22} className="text-pink-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none bg-zinc-950/60">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Plug size={18} className="text-emerald-400" />
          Dev Ecosystem & Webhook Integrations
        </h2>
        <p className="text-xs text-zinc-400">
          Native bidirectional sync with GitHub, GitLab, Sentry, Slack and Figma
        </p>
      </div>

      {/* Dev Event Simulator Bar */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-zinc-900 border border-indigo-800/60 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <Zap size={16} className="text-amber-400 animate-bounce" />
              Interactive Webhook & Event Simulator
            </h3>
            <p className="text-xs text-zinc-300">
              Test automated triage triggers in real-time by simulating incoming external events.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
            Live Webhook Listener Active
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={() => handleSimulate('pr_merge')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <GitPullRequest size={14} />
            Simulate GitHub PR Merge → Auto-Done
          </button>
          <button
            onClick={() => handleSimulate('pr_open')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <GitPullRequest size={14} />
            Simulate GitHub PR Open → In Review
          </button>
          <button
            onClick={() => handleSimulate('sentry')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <Flame size={14} />
            Simulate Sentry Crash Ingestion → Bug Ticket
          </button>
        </div>

        {/* Payload JSON Inspector */}
        {simulatedPayload && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1">
              <span className="flex items-center gap-1">
                <Code size={12} className="text-indigo-400" />
                Latest Ingested Webhook Payload:
              </span>
              <button
                onClick={() => setSimulatedPayload(null)}
                className="text-zinc-500 hover:text-zinc-300 text-[10px]"
              >
                Clear
              </button>
            </div>
            <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-36">
              {simulatedPayload}
            </pre>
          </div>
        )}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                  {getIntegrationIcon(item.id)}
                </div>
                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    item.connected
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {item.connected ? 'Connected' : 'Disconnected'}
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-zinc-100 text-sm">{item.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
              </div>

              {/* Details info */}
              <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-850 text-xs font-mono space-y-1 text-zinc-400">
                {item.details.org && (
                  <div>Organization: <strong className="text-zinc-200">{item.details.org}</strong></div>
                )}
                {item.details.slackChannel && (
                  <div>Channel: <strong className="text-zinc-200">{item.details.slackChannel}</strong></div>
                )}
                {item.details.sentryProject && (
                  <div>Project: <strong className="text-zinc-200">{item.details.sentryProject}</strong></div>
                )}
                {item.details.repos && (
                  <div>Synced repos: <strong className="text-zinc-200">{item.details.repos.join(', ')}</strong></div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={13} />
                HMAC Signed
              </span>
              <span className="font-mono text-[11px]">Sync: Instant</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import {
  User,
  Team,
  Label,
  Issue,
  Cycle,
  Project,
  Integration,
  AutomationRule,
  AutomationLog
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'You (Admin)',
    email: 'admin@workspace.local',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    teamIds: ['team_eng']
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_eng',
    name: 'Engineering',
    key: 'ENG',
    description: 'Core product engineering and development',
    icon: 'Cpu',
    color: '#6366f1',
    memberIds: ['usr_1']
  }
];

export const INITIAL_LABELS: Label[] = [
  { id: 'lbl_bug', name: 'Bug', color: '#ef4444', description: 'Defect or unexpected behavior' },
  { id: 'lbl_feat', name: 'Feature', color: '#8b5cf6', description: 'New functionality or enhancement' },
  { id: 'lbl_perf', name: 'Performance', color: '#10b981', description: 'Speed, latency, or efficiency optimization' },
  { id: 'lbl_sec', name: 'Security', color: '#f97316', description: 'Vulnerability fix or security hardening' },
  { id: 'lbl_design', name: 'Design', color: '#ec4899', description: 'Visual styling, layout, or UX ergonomics' },
  { id: 'lbl_dx', name: 'DX / Tooling', color: '#3b82f6', description: 'Developer experience, CI/CD, and tooling' }
];

export const INITIAL_CYCLES: Cycle[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_ISSUES: Issue[] = [];

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync pull requests, link branches, and auto-close issues on merge.',
    connected: false,
    icon: 'Github',
    details: {
      org: '',
      repos: []
    }
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Connect self-hosted GitLab or GitLab.com merge requests.',
    connected: false,
    icon: 'Gitlab',
    details: {
      org: '',
      repos: []
    }
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Ingest production error alerts directly into issue backlog.',
    connected: false,
    icon: 'AlertTriangle',
    details: {
      sentryProject: ''
    }
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Real-time issue status notifications, cycle roll-overs and triage alerts.',
    connected: false,
    icon: 'MessageSquare',
    details: {
      slackChannel: ''
    }
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Embed real-time design files, component specs, and canvas previews.',
    connected: false,
    icon: 'Figma',
    details: {
      figmaTeam: ''
    }
  },
  {
    id: 'webhook',
    name: 'Custom Webhooks',
    description: 'Dispatch real-time payload webhooks on issue creation, updates, and sprint changes.',
    connected: false,
    icon: 'Webhook',
    details: {
      webhookUrl: ''
    }
  }
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'rule_1',
    name: 'Auto-Move to Done on Pull Request Merge',
    description: 'When a pull request linked to an issue is merged, automatically set issue status to Done.',
    enabled: true,
    trigger: 'pr_merged',
    action: 'set_status_done',
    executionCount: 0
  },
  {
    id: 'rule_2',
    name: 'Auto-Move to In Review on Pull Request Open',
    description: 'When a developer opens a PR with the issue identifier in title, transition issue to In Review.',
    enabled: true,
    trigger: 'pr_opened',
    action: 'set_status_in_review',
    executionCount: 0
  },
  {
    id: 'rule_3',
    name: 'Auto-Tag Bug on Sentry Error Ingestion',
    description: 'When a Sentry alert is ingested, attach "Bug" label and set high priority.',
    enabled: true,
    trigger: 'sentry_alert_received',
    action: 'add_label_bug',
    executionCount: 0
  },
  {
    id: 'rule_4',
    name: 'Urgent Issue Lead Assignment',
    description: 'When an issue priority is set to Urgent (P1), auto-assign team lead.',
    enabled: true,
    trigger: 'issue_priority_urgent',
    action: 'assign_lead',
    executionCount: 0
  }
];

export const INITIAL_LOGS: AutomationLog[] = [];

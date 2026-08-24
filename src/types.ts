export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'canceled';

export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export type ProjectHealth = 'on_track' | 'at_risk' | 'delayed' | 'completed';

export type UserRole = 'admin' | 'lead' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  teamIds: string[];
}

export interface Team {
  id: string;
  name: string;
  key: string; // e.g. "ENG", "PROD", "SEC"
  description: string;
  icon: string;
  color: string;
  memberIds: string[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface GitBranch {
  name: string;
  repo: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  url: string;
  status: 'open' | 'draft' | 'merged' | 'closed';
  author: string;
  updatedAt: string;
}

export interface SentryAlert {
  id: string;
  title: string;
  eventCount: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  url: string;
}

export interface FigmaLink {
  fileKey: string;
  fileName: string;
  frameName: string;
  url: string;
  thumbnailUrl?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface IssueRelation {
  type: 'blocks' | 'blocked_by' | 'relates_to' | 'duplicate';
  targetIssueId: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  actorId: string;
  type: 'created' | 'status_change' | 'priority_change' | 'assigned' | 'cycle_change' | 'git_event' | 'automation';
  details: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  identifier: string; // e.g. "ENG-104"
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  estimate: number; // 0, 1, 2, 3, 5, 8, 13
  assigneeId?: string;
  creatorId: string;
  teamId: string;
  projectId?: string;
  cycleId?: string;
  labelIds: string[];
  subTasks: SubTask[];
  relations: IssueRelation[];
  pullRequests: PullRequest[];
  gitBranches: GitBranch[];
  sentryAlerts: SentryAlert[];
  figmaLinks: FigmaLink[];
  comments: Comment[];
  activity: ActivityItem[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Cycle {
  id: string;
  number: number;
  name: string;
  teamId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  description?: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  summary: string;
  description: string;
  icon: string;
  color: string;
  health: ProjectHealth;
  leadId: string;
  teamId: string;
  targetDate: string;
  startDate: string;
  milestones: Milestone[];
  createdAt: string;
}

export interface Integration {
  id: 'github' | 'gitlab' | 'sentry' | 'slack' | 'figma' | 'webhook';
  name: string;
  description: string;
  connected: boolean;
  icon: string;
  details: {
    org?: string;
    repos?: string[];
    slackChannel?: string;
    sentryProject?: string;
    figmaTeam?: string;
    webhookUrl?: string;
    apiKey?: string;
  };
}

export type AutomationTrigger = 
  | 'pr_opened'
  | 'pr_merged'
  | 'sentry_alert_received'
  | 'issue_priority_urgent'
  | 'issue_status_done'
  | 'cycle_completed';

export type AutomationAction =
  | 'set_status_in_review'
  | 'set_status_done'
  | 'assign_lead'
  | 'add_label_bug'
  | 'post_slack_notification'
  | 'rollover_to_next_cycle';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  action: AutomationAction;
  teamId?: string;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface AutomationLog {
  id: string;
  ruleName: string;
  trigger: string;
  actionTaken: string;
  issueIdentifier?: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface WorkspaceState {
  currentTeamId: string; // 'all' or specific teamId
  activeTab: 'issues' | 'cycles' | 'projects' | 'roadmap' | 'insights' | 'integrations' | 'automations' | 'settings';
  activeView?: 'issues' | 'cycles' | 'projects' | 'roadmap' | 'insights' | 'integrations' | 'automations' | 'settings';
  viewMode: 'list' | 'board' | 'timeline';
  issueLayout?: 'list' | 'board' | 'timeline';
  searchQuery: string;
  selectedStatusFilter: IssueStatus[];
  selectedPriorityFilter: IssuePriority[];
  selectedAssigneeFilter: string[];
  selectedLabelFilter: string[];
  selectedProjectFilter: string[];
  selectedCycleFilter: string[];
  groupBy: 'status' | 'priority' | 'assignee' | 'project' | 'cycle' | 'none';
  orderBy: 'priority' | 'updatedAt' | 'createdAt' | 'estimate' | 'title';
  orderDirection: 'asc' | 'desc';
  theme: 'dark' | 'light';
}

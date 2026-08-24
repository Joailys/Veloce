import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Issue,
  Project,
  Cycle,
  Team,
  User,
  Label,
  Integration,
  AutomationRule,
  AutomationLog,
  IssueStatus,
  IssuePriority,
  WorkspaceState,
  ActivityItem,
  Comment,
  SubTask,
  PullRequest,
  GitBranch,
  FigmaLink,
  SentryAlert
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TEAMS,
  INITIAL_LABELS,
  INITIAL_CYCLES,
  INITIAL_PROJECTS,
  INITIAL_ISSUES,
  INITIAL_INTEGRATIONS,
  INITIAL_AUTOMATIONS,
  INITIAL_LOGS
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'default' | 'success' | 'warning' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface WorkspaceContextType {
  // State Collections
  users: User[];
  currentUser: User;
  teams: Team[];
  labels: Label[];
  cycles: Cycle[];
  projects: Project[];
  issues: Issue[];
  integrations: Integration[];
  automations: AutomationRule[];
  automationLogs: AutomationLog[];
  state: WorkspaceState;
  
  // UI & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
  isCreateIssueOpen: boolean;
  setIsCreateIssueOpen: (open: boolean) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  selectedIssueIds: string[];
  toggleSelectIssue: (id: string) => void;
  selectAllIssues: (ids: string[]) => void;
  clearSelectedIssues: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // View state setters
  setCurrentTeamId: (teamId: string) => void;
  setActiveTab: (tab: WorkspaceState['activeTab']) => void;
  setActiveView: (tab: WorkspaceState['activeTab']) => void;
  setViewMode: (mode: WorkspaceState['viewMode']) => void;
  setIssueLayout: (mode: WorkspaceState['viewMode']) => void;
  setSearchQuery: (query: string) => void;
  toggleStatusFilter: (status: IssueStatus) => void;
  togglePriorityFilter: (priority: IssuePriority) => void;
  toggleAssigneeFilter: (userId: string) => void;
  toggleLabelFilter: (labelId: string) => void;
  toggleProjectFilter: (projectId: string) => void;
  toggleCycleFilter: (cycleId: string) => void;
  clearAllFilters: () => void;
  setGroupBy: (group: WorkspaceState['groupBy']) => void;
  setOrderBy: (order: WorkspaceState['orderBy']) => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Issue CRUD & Operations
  createIssue: (issueData: Partial<Issue>) => Issue;
  quickAddIssue: (title: string, teamId?: string, status?: IssueStatus) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  batchUpdateIssues: (ids: string[], updates: Partial<Issue>) => void;
  addComment: (issueId: string, content: string) => void;
  deleteComment: (issueId: string, commentId: string) => void;
  toggleSubTask: (issueId: string, subTaskId: string) => void;
  addSubTask: (issueId: string, title: string) => void;
  deleteSubTask: (issueId: string, subTaskId: string) => void;
  addPullRequest: (issueId: string, pr: Omit<PullRequest, 'id' | 'updatedAt'>) => void;
  addGitBranch: (issueId: string, branch: GitBranch) => void;
  addFigmaLink: (issueId: string, figma: FigmaLink) => void;

  // Cycle CRUD & Automation
  createCycle: (cycleData: Partial<Cycle>) => Cycle;
  updateCycle: (id: string, updates: Partial<Cycle>) => void;
  deleteCycle: (id: string) => void;
  rolloverCycle: (sourceCycleId: string, targetCycleId?: string) => void;

  // Project CRUD
  createProject: (projectData: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Label CRUD
  createLabel: (label: Omit<Label, 'id'>) => Label;
  updateLabel: (id: string, updates: Partial<Label>) => void;
  deleteLabel: (id: string) => void;

  // User / Team CRUD
  createUser: (userData: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  createTeam: (teamData: Partial<Team>) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Integrations & Dev Simulation
  toggleIntegration: (id: Integration['id']) => void;
  updateIntegrationConfig: (id: Integration['id'], details: Partial<Integration['details']>) => void;
  simulateGitEvent: (type: 'pr_open' | 'pr_merge', issueId?: string) => void;
  simulateSentryAlert: () => void;

  // Automations
  toggleAutomationRule: (ruleId: string) => void;
  createAutomationRule: (rule: Omit<AutomationRule, 'id' | 'executionCount'>) => void;
  deleteAutomationRule: (ruleId: string) => void;

  // Data Lifecycle (Empty workspace / Reset / Import / Export)
  clearAllData: () => void;
  resetToDefault: () => void;
  resetToDefaultData: () => void;
  exportWorkspaceJson: () => void;
  importWorkspaceJson: (jsonString: string) => boolean;

  // Computed
  filteredIssues: Issue[];
  activeCycle: Cycle | undefined;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_PREFIX = 'veloce_workspace_clean_v5_';

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [labels, setLabels] = useState<Label[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'labels');
    return saved ? JSON.parse(saved) : INITIAL_LABELS;
  });

  const [cycles, setCycles] = useState<Cycle[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'cycles');
    return saved ? JSON.parse(saved) : INITIAL_CYCLES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'integrations');
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
  });

  const [automations, setAutomations] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'automations');
    return saved ? JSON.parse(saved) : INITIAL_AUTOMATIONS;
  });

  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [state, setState] = useState<WorkspaceState>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'state');
    return saved
      ? JSON.parse(saved)
      : {
          currentTeamId: 'all',
          activeTab: 'issues',
          viewMode: 'list',
          searchQuery: '',
          selectedStatusFilter: [],
          selectedPriorityFilter: [],
          selectedAssigneeFilter: [],
          selectedLabelFilter: [],
          selectedProjectFilter: [],
          selectedCycleFilter: [],
          groupBy: 'status',
          orderBy: 'priority',
          orderDirection: 'desc',
          theme: 'dark'
        };
  });

  // UI state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(teams));
  }, [teams]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'labels', JSON.stringify(labels));
  }, [labels]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'cycles', JSON.stringify(cycles));
  }, [cycles]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'issues', JSON.stringify(issues));
  }, [issues]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'integrations', JSON.stringify(integrations));
  }, [integrations]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'automations', JSON.stringify(automations));
  }, [automations]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'logs', JSON.stringify(automationLogs));
  }, [automationLogs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'state', JSON.stringify(state));
  }, [state]);

  // Toast handlers
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Multi-select helpers
  const toggleSelectIssue = useCallback((id: string) => {
    setSelectedIssueIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const selectAllIssues = useCallback((ids: string[]) => {
    setSelectedIssueIds(ids);
  }, []);

  const clearSelectedIssues = useCallback(() => {
    setSelectedIssueIds([]);
  }, []);

  // View & Filter setters
  const setCurrentTeamId = useCallback((teamId: string) => {
    setState((prev) => ({ ...prev, currentTeamId: teamId }));
  }, []);

  const setActiveTab = useCallback((activeTab: WorkspaceState['activeTab']) => {
    setState((prev) => ({ ...prev, activeTab }));
  }, []);

  const setViewMode = useCallback((viewMode: WorkspaceState['viewMode']) => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState((prev) => ({ ...prev, searchQuery }));
  }, []);

  const toggleStatusFilter = useCallback((status: IssueStatus) => {
    setState((prev) => {
      const exists = prev.selectedStatusFilter.includes(status);
      return {
        ...prev,
        selectedStatusFilter: exists
          ? prev.selectedStatusFilter.filter((s) => s !== status)
          : [...prev.selectedStatusFilter, status]
      };
    });
  }, []);

  const togglePriorityFilter = useCallback((priority: IssuePriority) => {
    setState((prev) => {
      const exists = prev.selectedPriorityFilter.includes(priority);
      return {
        ...prev,
        selectedPriorityFilter: exists
          ? prev.selectedPriorityFilter.filter((p) => p !== priority)
          : [...prev.selectedPriorityFilter, priority]
      };
    });
  }, []);

  const toggleAssigneeFilter = useCallback((userId: string) => {
    setState((prev) => {
      const exists = prev.selectedAssigneeFilter.includes(userId);
      return {
        ...prev,
        selectedAssigneeFilter: exists
          ? prev.selectedAssigneeFilter.filter((u) => u !== userId)
          : [...prev.selectedAssigneeFilter, userId]
      };
    });
  }, []);

  const toggleLabelFilter = useCallback((labelId: string) => {
    setState((prev) => {
      const exists = prev.selectedLabelFilter.includes(labelId);
      return {
        ...prev,
        selectedLabelFilter: exists
          ? prev.selectedLabelFilter.filter((l) => l !== labelId)
          : [...prev.selectedLabelFilter, labelId]
      };
    });
  }, []);

  const toggleProjectFilter = useCallback((projectId: string) => {
    setState((prev) => {
      const exists = prev.selectedProjectFilter.includes(projectId);
      return {
        ...prev,
        selectedProjectFilter: exists
          ? prev.selectedProjectFilter.filter((p) => p !== projectId)
          : [...prev.selectedProjectFilter, projectId]
      };
    });
  }, []);

  const toggleCycleFilter = useCallback((cycleId: string) => {
    setState((prev) => {
      const exists = prev.selectedCycleFilter.includes(cycleId);
      return {
        ...prev,
        selectedCycleFilter: exists
          ? prev.selectedCycleFilter.filter((c) => c !== cycleId)
          : [...prev.selectedCycleFilter, cycleId]
      };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchQuery: '',
      selectedStatusFilter: [],
      selectedPriorityFilter: [],
      selectedAssigneeFilter: [],
      selectedLabelFilter: [],
      selectedProjectFilter: [],
      selectedCycleFilter: []
    }));
  }, []);

  const setGroupBy = useCallback((groupBy: WorkspaceState['groupBy']) => {
    setState((prev) => ({ ...prev, groupBy }));
  }, []);

  const setOrderBy = useCallback((orderBy: WorkspaceState['orderBy']) => {
    setState((prev) => ({ ...prev, orderBy }));
  }, []);

  const setTheme = useCallback((theme: 'dark' | 'light') => {
    setState((prev) => ({ ...prev, theme }));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Automations helper function
  const triggerAutomations = useCallback(
    (trigger: AutomationRule['trigger'], targetIssue: Issue, customInfo?: string) => {
      const matchingRules = automations.filter((r) => r.enabled && r.trigger === trigger);
      if (matchingRules.length === 0) return;

      matchingRules.forEach((rule) => {
        let actionDesc = '';
        let modifiedIssue: Partial<Issue> = {};

        switch (rule.action) {
          case 'set_status_done':
            actionDesc = 'Set status to Done';
            modifiedIssue.status = 'done';
            modifiedIssue.completedAt = new Date().toISOString();
            break;
          case 'set_status_in_review':
            actionDesc = 'Set status to In Review';
            modifiedIssue.status = 'in_review';
            break;
          case 'assign_lead': {
            const team = teams.find((t) => t.id === targetIssue.teamId);
            const lead = users.find((u) => u.role === 'lead' && u.teamIds.includes(team?.id || ''));
            if (lead) {
              actionDesc = `Assigned Lead: ${lead.name}`;
              modifiedIssue.assigneeId = lead.id;
            }
            break;
          }
          case 'add_label_bug': {
            const bugLabel = labels.find((l) => l.name.toLowerCase() === 'bug');
            if (bugLabel && !targetIssue.labelIds.includes(bugLabel.id)) {
              actionDesc = 'Added label Bug & set priority High';
              modifiedIssue.labelIds = [...targetIssue.labelIds, bugLabel.id];
              modifiedIssue.priority = 'high';
            }
            break;
          }
          default:
            actionDesc = `Executed ${rule.action}`;
        }

        if (Object.keys(modifiedIssue).length > 0) {
          setIssues((prev) =>
            prev.map((iss) => (iss.id === targetIssue.id ? { ...iss, ...modifiedIssue } : iss))
          );
        }

        setAutomations((prev) =>
          prev.map((r) =>
            r.id === rule.id
              ? { ...r, executionCount: r.executionCount + 1, lastExecutedAt: new Date().toISOString() }
              : r
          )
        );

        const newLog: AutomationLog = {
          id: 'log_' + Date.now(),
          ruleName: rule.name,
          trigger: customInfo || trigger,
          actionTaken: actionDesc,
          issueIdentifier: targetIssue.identifier,
          timestamp: new Date().toISOString(),
          status: 'success'
        };
        setAutomationLogs((prev) => [newLog, ...prev.slice(0, 49)]);

        addToast({
          title: `Automation: ${rule.name}`,
          description: `${targetIssue.identifier} → ${actionDesc}`,
          type: 'info'
        });
      });
    },
    [automations, teams, users, labels, addToast]
  );

  // Issues CRUD
  const createIssue = useCallback(
    (issueData: Partial<Issue>): Issue => {
      const defaultTeamId = state.currentTeamId !== 'all' ? state.currentTeamId : (teams[0]?.id || 'team_1');
      const teamId = issueData.teamId || defaultTeamId;
      const team = teams.find((t) => t.id === teamId) || teams[0] || { key: 'ISSUE' };
      const teamPrefix = team.key || 'ISSUE';
      
      const existingTeamIssues = issues.filter((i) => i.teamId === teamId);
      const nextNum = existingTeamIssues.length + 101;
      const identifier = `${teamPrefix}-${nextNum}`;

      const activeCycleForTeam = cycles.find((c) => c.teamId === teamId && c.status === 'active');

      const newIssue: Issue = {
        id: 'iss_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        identifier,
        title: issueData.title || 'Untitled Issue',
        description: issueData.description || '',
        status: issueData.status || 'todo',
        priority: issueData.priority || 'medium',
        estimate: issueData.estimate !== undefined ? issueData.estimate : 2,
        assigneeId: issueData.assigneeId,
        creatorId: currentUser.id,
        teamId,
        projectId: issueData.projectId,
        cycleId: issueData.cycleId || activeCycleForTeam?.id,
        labelIds: issueData.labelIds || [],
        subTasks: issueData.subTasks || [],
        relations: [],
        pullRequests: issueData.pullRequests || [],
        gitBranches: issueData.gitBranches || [
          {
            name: `feat/${identifier.toLowerCase()}-${(issueData.title || 'ticket')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .slice(0, 30)}`,
            repo: `veloce-app/${teamPrefix.toLowerCase()}`
          }
        ],
        sentryAlerts: issueData.sentryAlerts || [],
        figmaLinks: issueData.figmaLinks || [],
        comments: [],
        activity: [
          {
            id: 'act_' + Date.now(),
            actorId: currentUser.id,
            type: 'created',
            details: `created issue ${identifier}`,
            timestamp: new Date().toISOString()
          }
        ],
        dueDate: issueData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setIssues((prev) => [newIssue, ...prev]);

      addToast({
        title: `Created ${identifier}`,
        description: newIssue.title,
        type: 'success',
        action: {
          label: 'Open',
          onClick: () => setSelectedIssueId(newIssue.id)
        }
      });

      if (newIssue.priority === 'urgent') {
        triggerAutomations('issue_priority_urgent', newIssue, 'Priority set to Urgent');
      }

      return newIssue;
    },
    [state.currentTeamId, teams, issues, cycles, currentUser.id, addToast, triggerAutomations]
  );

  const quickAddIssue = useCallback(
    (title: string, teamId?: string, status?: IssueStatus): Issue => {
      return createIssue({
        title: title.trim(),
        teamId,
        status: status || 'todo',
        priority: 'medium',
        estimate: 2
      });
    },
    [createIssue]
  );

  const updateIssue = useCallback(
    (id: string, updates: Partial<Issue>) => {
      setIssues((prev) => {
        const target = prev.find((i) => i.id === id);
        if (!target) return prev;

        const newActivity: ActivityItem[] = [...target.activity];

        if (updates.status && updates.status !== target.status) {
          newActivity.push({
            id: 'act_' + Date.now(),
            actorId: currentUser.id,
            type: 'status_change',
            details: `changed status from ${target.status} to ${updates.status}`,
            timestamp: new Date().toISOString()
          });
        }

        if (updates.priority && updates.priority !== target.priority) {
          newActivity.push({
            id: 'act_' + Date.now(),
            actorId: currentUser.id,
            type: 'priority_change',
            details: `changed priority to ${updates.priority}`,
            timestamp: new Date().toISOString()
          });
        }

        if (updates.assigneeId !== undefined && updates.assigneeId !== target.assigneeId) {
          const assigneeName = users.find((u) => u.id === updates.assigneeId)?.name || 'Unassigned';
          newActivity.push({
            id: 'act_' + Date.now(),
            actorId: currentUser.id,
            type: 'assigned',
            details: `assigned to ${assigneeName}`,
            timestamp: new Date().toISOString()
          });
        }

        const updated = {
          ...target,
          ...updates,
          activity: newActivity,
          updatedAt: new Date().toISOString(),
          completedAt:
            updates.status === 'done'
              ? target.completedAt || new Date().toISOString()
              : updates.status ? undefined : target.completedAt
        };

        if (updates.priority === 'urgent' && target.priority !== 'urgent') {
          triggerAutomations('issue_priority_urgent', updated, 'Priority elevated to Urgent');
        }
        if (updates.status === 'done' && target.status !== 'done') {
          triggerAutomations('issue_status_done', updated, 'Status changed to Done');
        }

        return prev.map((iss) => (iss.id === id ? updated : iss));
      });
    },
    [currentUser.id, users, triggerAutomations]
  );

  const deleteIssue = useCallback(
    (id: string) => {
      const target = issues.find((i) => i.id === id);
      setIssues((prev) => prev.filter((i) => i.id !== id));
      if (selectedIssueId === id) setSelectedIssueId(null);
      setSelectedIssueIds((prev) => prev.filter((i) => i !== id));

      if (target) {
        addToast({
          title: `Deleted ${target.identifier}`,
          description: target.title,
          type: 'warning',
          action: {
            label: 'Undo',
            onClick: () => {
              setIssues((prev) => [target, ...prev]);
            }
          }
        });
      }
    },
    [issues, selectedIssueId, addToast]
  );

  const batchUpdateIssues = useCallback(
    (ids: string[], updates: Partial<Issue>) => {
      setIssues((prev) =>
        prev.map((iss) => {
          if (ids.includes(iss.id)) {
            return {
              ...iss,
              ...updates,
              updatedAt: new Date().toISOString()
            };
          }
          return iss;
        })
      );
      addToast({
        title: `Updated ${ids.length} issues`,
        type: 'success'
      });
    },
    [addToast]
  );

  const addComment = useCallback(
    (issueId: string, content: string) => {
      if (!content.trim()) return;
      const newComment: Comment = {
        id: 'cm_' + Date.now(),
        authorId: currentUser.id,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };

      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.id === issueId) {
            return {
              ...iss,
              comments: [...iss.comments, newComment],
              updatedAt: new Date().toISOString()
            };
          }
          return iss;
        })
      );
    },
    [currentUser.id]
  );

  const deleteComment = useCallback((issueId: string, commentId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            comments: iss.comments.filter((c) => c.id !== commentId),
            updatedAt: new Date().toISOString()
          };
        }
        return iss;
      })
    );
  }, []);

  const toggleSubTask = useCallback((issueId: string, subTaskId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const updatedSubTasks = iss.subTasks.map((st) =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          );
          return {
            ...iss,
            subTasks: updatedSubTasks,
            updatedAt: new Date().toISOString()
          };
        }
        return iss;
      })
    );
  }, []);

  const addSubTask = useCallback((issueId: string, title: string) => {
    if (!title.trim()) return;
    const newSubTask: SubTask = {
      id: 'st_' + Date.now(),
      title: title.trim(),
      completed: false
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            subTasks: [...iss.subTasks, newSubTask],
            updatedAt: new Date().toISOString()
          };
        }
        return iss;
      })
    );
  }, []);

  const deleteSubTask = useCallback((issueId: string, subTaskId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            subTasks: iss.subTasks.filter((st) => st.id !== subTaskId),
            updatedAt: new Date().toISOString()
          };
        }
        return iss;
      })
    );
  }, []);

  const addPullRequest = useCallback(
    (issueId: string, pr: Omit<PullRequest, 'id' | 'updatedAt'>) => {
      const newPR: PullRequest = {
        ...pr,
        id: 'pr_' + Date.now(),
        updatedAt: new Date().toISOString()
      };
      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.id === issueId) {
            return {
              ...iss,
              pullRequests: [...iss.pullRequests, newPR],
              updatedAt: new Date().toISOString()
            };
          }
          return iss;
        })
      );
      addToast({
        title: `Linked PR #${pr.number}`,
        type: 'success'
      });
    },
    [addToast]
  );

  const addGitBranch = useCallback((issueId: string, branch: GitBranch) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            gitBranches: [...iss.gitBranches, branch],
            updatedAt: new Date().toISOString()
          };
        }
        return iss;
      })
    );
  }, []);

  const addFigmaLink = useCallback(
    (issueId: string, figma: FigmaLink) => {
      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.id === issueId) {
            return {
              ...iss,
              figmaLinks: [...iss.figmaLinks, figma],
              updatedAt: new Date().toISOString()
            };
          }
          return iss;
        })
      );
      addToast({
        title: 'Linked Figma design',
        type: 'success'
      });
    },
    [addToast]
  );

  // Cycles CRUD & Rollover
  const createCycle = useCallback((cycleData: Partial<Cycle>): Cycle => {
    const newCycle: Cycle = {
      id: 'cycle_' + Date.now(),
      number: cycles.length + 1,
      name: cycleData.name || `Cycle ${cycles.length + 1}`,
      teamId: cycleData.teamId || teams[0]?.id || 'team_core',
      startDate: cycleData.startDate || new Date().toISOString(),
      endDate: cycleData.endDate || new Date(Date.now() + 14 * 86400000).toISOString(),
      status: cycleData.status || 'upcoming',
      description: cycleData.description || ''
    };
    setCycles((prev) => [newCycle, ...prev]);
    addToast({
      title: `Created ${newCycle.name}`,
      type: 'success'
    });
    return newCycle;
  }, [cycles.length, teams, addToast]);

  const updateCycle = useCallback((id: string, updates: Partial<Cycle>) => {
    setCycles((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCycle = useCallback((id: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== id));
    // Unassign cycle from issues
    setIssues((prev) =>
      prev.map((iss) => (iss.cycleId === id ? { ...iss, cycleId: undefined } : iss))
    );
    addToast({
      title: 'Cycle deleted',
      type: 'info'
    });
  }, [addToast]);

  const rolloverCycle = useCallback(
    (sourceCycleId: string, targetCycleId?: string) => {
      const sourceCycle = cycles.find((c) => c.id === sourceCycleId);
      if (!sourceCycle) return;

      const targetCycle = targetCycleId
        ? cycles.find((c) => c.id === targetCycleId)
        : cycles.find((c) => c.status === 'upcoming' && c.teamId === sourceCycle.teamId) ||
          createCycle({
            name: `Cycle ${sourceCycle.number + 1} - Rollover`,
            teamId: sourceCycle.teamId,
            status: 'active'
          });

      const unfinishedIssues = issues.filter(
        (i) => i.cycleId === sourceCycleId && i.status !== 'done' && i.status !== 'canceled'
      );

      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.cycleId === sourceCycleId && iss.status !== 'done' && iss.status !== 'canceled') {
            return {
              ...iss,
              cycleId: targetCycle.id,
              activity: [
                ...iss.activity,
                {
                  id: 'act_' + Date.now(),
                  actorId: currentUser.id,
                  type: 'cycle_change',
                  details: `Rolled over to ${targetCycle.name}`,
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return iss;
        })
      );

      setCycles((prev) =>
        prev.map((c) => (c.id === sourceCycleId ? { ...c, status: 'completed' } : c))
      );

      addToast({
        title: `Cycle ${sourceCycle.number} Completed`,
        description: `Rolled over ${unfinishedIssues.length} tickets to ${targetCycle.name}`,
        type: 'success'
      });
    },
    [cycles, issues, currentUser.id, createCycle, addToast]
  );

  // Projects CRUD
  const createProject = useCallback(
    (projectData: Partial<Project>): Project => {
      const defaultTeamId = teams[0]?.id || 'team_core';
      const newProject: Project = {
        id: 'proj_' + Date.now(),
        name: projectData.name || 'New Project Initiative',
        key: projectData.key || 'INIT',
        summary: projectData.summary || '',
        description: projectData.description || '',
        icon: projectData.icon || 'FolderGit2',
        color: projectData.color || '#6366f1',
        health: projectData.health || 'on_track',
        leadId: projectData.leadId || currentUser.id,
        teamId: projectData.teamId || defaultTeamId,
        startDate: projectData.startDate || new Date().toISOString().slice(0, 10),
        targetDate:
          projectData.targetDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        milestones: projectData.milestones || [],
        createdAt: new Date().toISOString()
      };
      setProjects((prev) => [newProject, ...prev]);
      addToast({
        title: `Created Project: ${newProject.name}`,
        type: 'success'
      });
      return newProject;
    },
    [currentUser.id, teams, addToast]
  );

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setIssues((prev) =>
      prev.map((iss) => (iss.projectId === id ? { ...iss, projectId: undefined } : iss))
    );
    addToast({
      title: 'Project deleted',
      type: 'info'
    });
  }, [addToast]);

  // Labels CRUD
  const createLabel = useCallback((label: Omit<Label, 'id'>): Label => {
    const newLabel: Label = {
      ...label,
      id: 'lbl_' + Date.now()
    };
    setLabels((prev) => [...prev, newLabel]);
    addToast({
      title: `Created label: ${newLabel.name}`,
      type: 'success'
    });
    return newLabel;
  }, [addToast]);

  const updateLabel = useCallback((id: string, updates: Partial<Label>) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const deleteLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    setIssues((prev) =>
      prev.map((iss) => ({
        ...iss,
        labelIds: iss.labelIds.filter((lId) => lId !== id)
      }))
    );
  }, []);

  // Users CRUD
  const createUser = useCallback((userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: 'usr_' + Date.now()
    };
    setUsers((prev) => [...prev, newUser]);
    addToast({
      title: `Added team member: ${newUser.name}`,
      type: 'success'
    });
    return newUser;
  }, [addToast]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  }, [currentUser.id]);

  const deleteUser = useCallback((id: string) => {
    if (currentUser.id === id) {
      addToast({
        title: 'Cannot delete active session user',
        type: 'warning'
      });
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, [currentUser.id, addToast]);

  // Teams CRUD
  const createTeam = useCallback(
    (teamData: Partial<Team>): Team => {
      const newTeam: Team = {
        id: 'team_' + Date.now(),
        name: teamData.name || 'New Team',
        key: (teamData.key || 'TEAM').toUpperCase(),
        description: teamData.description || '',
        icon: teamData.icon || 'Users',
        color: teamData.color || '#6366f1',
        memberIds: [currentUser.id]
      };
      setTeams((prev) => [...prev, newTeam]);
      addToast({
        title: `Created Team: ${newTeam.name} (${newTeam.key})`,
        type: 'success'
      });
      return newTeam;
    },
    [currentUser.id, addToast]
  );

  const updateTeam = useCallback((id: string, updates: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Integrations
  const toggleIntegration = useCallback((id: Integration['id']) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, connected: !item.connected } : item))
    );
  }, []);

  const updateIntegrationConfig = useCallback((id: Integration['id'], details: Partial<Integration['details']>) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, details: { ...item.details, ...details } } : item
      )
    );
  }, []);

  const simulateGitEvent = useCallback(
    (type: 'pr_open' | 'pr_merge', targetIssueId?: string) => {
      const issue = targetIssueId
        ? issues.find((i) => i.id === targetIssueId)
        : issues.find((i) => i.status === (type === 'pr_merge' ? 'in_review' : 'in_progress')) ||
          issues[0];

      if (!issue) return;

      if (type === 'pr_merge') {
        const prNumber = Math.floor(Math.random() * 500) + 100;
        const updatedPRs: PullRequest[] = [
          ...issue.pullRequests.filter((p) => p.status !== 'merged'),
          {
            id: 'pr_' + Date.now(),
            number: prNumber,
            title: `feat(${issue.identifier.toLowerCase()}): auto-merged pull request`,
            url: `https://github.com/veloce-app/core/pull/${prNumber}`,
            status: 'merged',
            author: currentUser.name.toLowerCase().replace(/\s+/g, ''),
            updatedAt: new Date().toISOString()
          }
        ];

        setIssues((prev) =>
          prev.map((iss) => {
            if (iss.id === issue.id) {
              return {
                ...iss,
                pullRequests: updatedPRs,
                status: 'done',
                completedAt: new Date().toISOString(),
                activity: [
                  ...iss.activity,
                  {
                    id: 'act_' + Date.now(),
                    actorId: currentUser.id,
                    type: 'git_event',
                    details: `GitHub PR #${prNumber} merged into main`,
                    timestamp: new Date().toISOString()
                  }
                ]
              };
            }
            return iss;
          })
        );

        triggerAutomations('pr_merged', issue, `GitHub PR #${prNumber} Merged`);
        addToast({
          title: `GitHub PR #${prNumber} Merged`,
          description: `${issue.identifier} marked as Done`,
          type: 'success'
        });
      } else {
        const prNumber = Math.floor(Math.random() * 500) + 100;
        const newPR: PullRequest = {
          id: 'pr_' + Date.now(),
          number: prNumber,
          title: `feat(${issue.identifier.toLowerCase()}): new pull request submitted`,
          url: `https://github.com/veloce-app/core/pull/${prNumber}`,
          status: 'open',
          author: currentUser.name.toLowerCase().replace(/\s+/g, ''),
          updatedAt: new Date().toISOString()
        };

        setIssues((prev) =>
          prev.map((iss) => {
            if (iss.id === issue.id) {
              return {
                ...iss,
                pullRequests: [...iss.pullRequests, newPR],
                status: 'in_review',
                activity: [
                  ...iss.activity,
                  {
                    id: 'act_' + Date.now(),
                    actorId: currentUser.id,
                    type: 'git_event',
                    details: `GitHub PR #${prNumber} opened`,
                    timestamp: new Date().toISOString()
                  }
                ]
              };
            }
            return iss;
          })
        );

        triggerAutomations('pr_opened', issue, `GitHub PR #${prNumber} Opened`);
        addToast({
          title: `GitHub PR #${prNumber} Created`,
          description: `${issue.identifier} transitioned to In Review`,
          type: 'info'
        });
      }
    },
    [issues, currentUser, triggerAutomations, addToast]
  );

  const simulateSentryAlert = useCallback(() => {
    const errorCodes = ['ERR-8120', 'ERR-9404', 'ERR-3091', 'ERR-7210'];
    const randomCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
    const errorTitles = [
      'UnhandledPromiseRejection: Connection timeout to Redis cluster',
      'TypeError: Cannot read properties of undefined (reading "sessionToken")',
      'Invariant Violation: Minified React error #31 on /insights/velocity',
      'MemoryLeakWarning: MaxListenersExceeded on EventEmitter3'
    ];
    const randomTitle = errorTitles[Math.floor(Math.random() * errorTitles.length)];

    const sentryAlert: SentryAlert = {
      id: randomCode,
      title: randomTitle,
      eventCount: Math.floor(Math.random() * 800) + 50,
      userCount: Math.floor(Math.random() * 80) + 12,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      url: `https://sentry.io/organizations/veloce/issues/${randomCode}`
    };

    const bugLabel = labels.find((l) => l.name.toLowerCase() === 'bug');

    const newIssue = createIssue({
      title: `Sentry: ${randomTitle.slice(0, 65)}`,
      description: `Automated issue ingested from Sentry Production Alert **#${randomCode}**\n\n- Events: **${sentryAlert.eventCount}**\n- Impacted Users: **${sentryAlert.userCount}**\n- First seen: ${sentryAlert.firstSeen}\n\n[Open in Sentry Dashboard](${sentryAlert.url})`,
      priority: 'high',
      status: 'todo',
      teamId: teams[0]?.id || 'team_core',
      labelIds: bugLabel ? [bugLabel.id] : []
    });

    setIssues((prev) =>
      prev.map((iss) => (iss.id === newIssue.id ? { ...iss, sentryAlerts: [sentryAlert] } : iss))
    );

    triggerAutomations('sentry_alert_received', newIssue, `Sentry Alert #${randomCode} Ingestion`);
  }, [labels, createIssue, teams, triggerAutomations]);

  // Automations CRUD
  const toggleAutomationRule = useCallback((ruleId: string) => {
    setAutomations((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const createAutomationRule = useCallback(
    (rule: Omit<AutomationRule, 'id' | 'executionCount'>) => {
      const newRule: AutomationRule = {
        ...rule,
        id: 'rule_' + Date.now(),
        executionCount: 0
      };
      setAutomations((prev) => [newRule, ...prev]);
      addToast({
        title: `Automation Created: ${newRule.name}`,
        type: 'success'
      });
    },
    [addToast]
  );

  const deleteAutomationRule = useCallback((ruleId: string) => {
    setAutomations((prev) => prev.filter((r) => r.id !== ruleId));
  }, []);

  // Data Lifecycle
  const clearAllData = useCallback(() => {
    setIssues([]);
    setCycles([]);
    setProjects([]);
    addToast({
      title: 'Workspace Cleared',
      description: 'All tickets, cycles, and initiatives have been reset to a clean empty state.',
      type: 'info'
    });
  }, [addToast]);

  const resetToDefault = useCallback(() => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setTeams(INITIAL_TEAMS);
    setLabels(INITIAL_LABELS);
    setCycles(INITIAL_CYCLES);
    setProjects(INITIAL_PROJECTS);
    setIssues(INITIAL_ISSUES);
    setIntegrations(INITIAL_INTEGRATIONS);
    setAutomations(INITIAL_AUTOMATIONS);
    setAutomationLogs(INITIAL_LOGS);
    setState({
      currentTeamId: 'all',
      activeTab: 'issues',
      viewMode: 'list',
      searchQuery: '',
      selectedStatusFilter: [],
      selectedPriorityFilter: [],
      selectedAssigneeFilter: [],
      selectedLabelFilter: [],
      selectedProjectFilter: [],
      selectedCycleFilter: [],
      groupBy: 'status',
      orderBy: 'priority',
      orderDirection: 'desc',
      theme: 'dark'
    });
    addToast({
      title: 'Sample Data Restored',
      type: 'success'
    });
  }, [addToast]);

  const exportWorkspaceJson = useCallback(() => {
    const data = {
      users,
      currentUser,
      teams,
      labels,
      cycles,
      projects,
      issues,
      integrations,
      automations,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veloce-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      title: 'Workspace Exported as JSON',
      type: 'success'
    });
  }, [users, currentUser, teams, labels, cycles, projects, issues, integrations, automations, addToast]);

  const importWorkspaceJson = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.issues) setIssues(parsed.issues);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.cycles) setCycles(parsed.cycles);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.labels) setLabels(parsed.labels);
        if (parsed.automations) setAutomations(parsed.automations);
        addToast({
          title: 'Workspace Backup Imported Successfully',
          type: 'success'
        });
        return true;
      } catch (err) {
        addToast({
          title: 'Failed to import JSON backup',
          description: 'Invalid JSON structure file.',
          type: 'warning'
        });
        return false;
      }
    },
    [addToast]
  );

  // Filtered issues computation
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (state.currentTeamId !== 'all' && issue.teamId !== state.currentTeamId) {
        return false;
      }
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        const matchesIdent = issue.identifier.toLowerCase().includes(q);
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesDesc = issue.description.toLowerCase().includes(q);
        if (!matchesIdent && !matchesTitle && !matchesDesc) return false;
      }
      if (
        state.selectedStatusFilter.length > 0 &&
        !state.selectedStatusFilter.includes(issue.status)
      ) {
        return false;
      }
      if (
        state.selectedPriorityFilter.length > 0 &&
        !state.selectedPriorityFilter.includes(issue.priority)
      ) {
        return false;
      }
      if (
        state.selectedAssigneeFilter.length > 0 &&
        (!issue.assigneeId || !state.selectedAssigneeFilter.includes(issue.assigneeId))
      ) {
        return false;
      }
      if (
        state.selectedLabelFilter.length > 0 &&
        !issue.labelIds.some((lId) => state.selectedLabelFilter.includes(lId))
      ) {
        return false;
      }
      if (
        state.selectedProjectFilter.length > 0 &&
        (!issue.projectId || !state.selectedProjectFilter.includes(issue.projectId))
      ) {
        return false;
      }
      if (
        state.selectedCycleFilter.length > 0 &&
        (!issue.cycleId || !state.selectedCycleFilter.includes(issue.cycleId))
      ) {
        return false;
      }

      return true;
    });
  }, [issues, state]);

  // Active cycle computation
  const activeCycle = useMemo(() => {
    if (state.currentTeamId === 'all') {
      return cycles.find((c) => c.status === 'active');
    }
    return cycles.find((c) => c.teamId === state.currentTeamId && c.status === 'active');
  }, [cycles, state.currentTeamId]);

  return (
    <WorkspaceContext.Provider
      value={{
        users,
        currentUser,
        teams,
        labels,
        cycles,
        projects,
        issues,
        integrations,
        automations,
        automationLogs,
        state: {
          ...state,
          activeView: state.activeTab,
          issueLayout: state.viewMode
        },

        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        isCreateIssueOpen,
        setIsCreateIssueOpen,
        selectedIssueId,
        setSelectedIssueId,
        selectedIssueIds,
        toggleSelectIssue,
        selectAllIssues,
        clearSelectedIssues,
        toasts,
        addToast,
        removeToast,

        setCurrentTeamId,
        setActiveTab,
        setActiveView: setActiveTab,
        setViewMode,
        setIssueLayout: setViewMode,
        setSearchQuery,
        toggleStatusFilter,
        togglePriorityFilter,
        toggleAssigneeFilter,
        toggleLabelFilter,
        toggleProjectFilter,
        toggleCycleFilter,
        clearAllFilters,
        setGroupBy,
        setOrderBy,
        setTheme,

        createIssue,
        quickAddIssue,
        updateIssue,
        deleteIssue,
        batchUpdateIssues,
        addComment,
        deleteComment,
        toggleSubTask,
        addSubTask,
        deleteSubTask,
        addPullRequest,
        addGitBranch,
        addFigmaLink,

        createCycle,
        updateCycle,
        deleteCycle,
        rolloverCycle,

        createProject,
        updateProject,
        deleteProject,

        createLabel,
        updateLabel,
        deleteLabel,

        createUser,
        updateUser,
        deleteUser,
        createTeam,
        updateTeam,
        deleteTeam,

        toggleIntegration,
        updateIntegrationConfig,
        simulateGitEvent,
        simulateSentryAlert,

        toggleAutomationRule,
        createAutomationRule,
        deleteAutomationRule,

        clearAllData,
        resetToDefault,
        resetToDefaultData: resetToDefault,
        exportWorkspaceJson,
        importWorkspaceJson,

        filteredIssues,
        activeCycle
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

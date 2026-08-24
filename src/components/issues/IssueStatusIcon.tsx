import React from 'react';
import { IssueStatus } from '../../types';
import { Circle, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';

interface Props {
  status: IssueStatus;
  className?: string;
  size?: number;
}

export const IssueStatusIcon: React.FC<Props> = ({ status, className = '', size = 16 }) => {
  switch (status) {
    case 'backlog':
      return <Circle size={size} className={`text-zinc-500 stroke-dashed ${className}`} strokeDasharray="3 3" />;
    case 'todo':
      return <Circle size={size} className={`text-zinc-400 dark:text-zinc-400 ${className}`} strokeWidth={2} />;
    case 'in_progress':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <Clock size={size} className="text-amber-500 dark:text-amber-400" />
        </div>
      );
    case 'in_review':
      return <Eye size={size} className={`text-purple-500 dark:text-purple-400 ${className}`} />;
    case 'done':
      return <CheckCircle2 size={size} className={`text-emerald-500 dark:text-emerald-400 fill-emerald-500/10 ${className}`} />;
    case 'canceled':
      return <XCircle size={size} className={`text-zinc-500 dark:text-zinc-500 ${className}`} />;
    default:
      return <AlertCircle size={size} className={`text-zinc-400 ${className}`} />;
  }
};

export const getStatusLabel = (status: IssueStatus): string => {
  switch (status) {
    case 'backlog':
      return 'Backlog';
    case 'todo':
      return 'Todo';
    case 'in_progress':
      return 'In Progress';
    case 'in_review':
      return 'In Review';
    case 'done':
      return 'Done';
    case 'canceled':
      return 'Canceled';
  }
};

export const getStatusColorClass = (status: IssueStatus): string => {
  switch (status) {
    case 'backlog':
      return 'text-zinc-400 bg-zinc-800/40 border-zinc-700/50';
    case 'todo':
      return 'text-zinc-300 bg-zinc-800/60 border-zinc-700';
    case 'in_progress':
      return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
    case 'in_review':
      return 'text-purple-400 bg-purple-950/40 border-purple-800/50';
    case 'done':
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
    case 'canceled':
      return 'text-zinc-500 bg-zinc-900/40 border-zinc-800';
  }
};

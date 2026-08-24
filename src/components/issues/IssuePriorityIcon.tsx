import React from 'react';
import { IssuePriority } from '../../types';
import { AlertTriangle, Signal, SignalMedium, SignalLow, Minus } from 'lucide-react';

interface Props {
  priority: IssuePriority;
  className?: string;
  size?: number;
}

export const IssuePriorityIcon: React.FC<Props> = ({ priority, className = '', size = 16 }) => {
  switch (priority) {
    case 'urgent':
      return <AlertTriangle size={size} className={`text-red-500 fill-red-500/20 ${className}`} />;
    case 'high':
      return <Signal size={size} className={`text-orange-500 ${className}`} />;
    case 'medium':
      return <SignalMedium size={size} className={`text-amber-500 ${className}`} />;
    case 'low':
      return <SignalLow size={size} className={`text-blue-400 ${className}`} />;
    case 'none':
    default:
      return <Minus size={size} className={`text-zinc-600 dark:text-zinc-600 ${className}`} />;
  }
};

export const getPriorityLabel = (priority: IssuePriority): string => {
  switch (priority) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    case 'none':
      return 'No Priority';
  }
};

export const getPriorityColor = (priority: IssuePriority): string => {
  switch (priority) {
    case 'urgent':
      return '#ef4444';
    case 'high':
      return '#f97316';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#3b82f6';
    case 'none':
      return '#71717a';
  }
};

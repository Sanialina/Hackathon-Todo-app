export type Priority = 'High' | 'Medium' | 'Low';
export type Recurrence = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: Priority;
  tags: string[];
  dueDate: string; // ISO date string
  recurrence: Recurrence;
  createdAt: number;
}

export type SortOption = 'date-added' | 'priority' | 'due-date' | 'alphabetical';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface FilterState {
  search: string;
  status: FilterStatus;
  priority: Priority | 'All';
  sort: SortOption;
}
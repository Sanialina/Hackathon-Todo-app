import React from 'react';
import { Calendar, Tag, Repeat, Edit2, Trash2, Check, Clock } from 'lucide-react';
import { Task, Priority } from '../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    High: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggle }) => {
  const isExpired = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div 
      className={`
        group relative p-5 rounded-2xl border transition-all duration-300 animate-slide-up
        ${task.isCompleted 
          ? 'bg-slate-900/30 border-white/5 opacity-70 scale-[0.99]' 
          : 'bg-glass-100 hover:bg-glass-200 border-white/10 hover:border-white/20 hover:-translate-y-1 shadow-lg hover:shadow-2xl shadow-black/20'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`
            mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
            ${task.isCompleted 
              ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
              : 'border-slate-500/50 hover:border-indigo-400 bg-transparent'
            }
          `}
        >
          {task.isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`font-semibold text-lg truncate pr-2 ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
            {task.recurrence !== 'None' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Repeat className="w-3 h-3" /> {task.recurrence}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${task.isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
            {task.dueDate && (
              <div className={`flex items-center gap-1.5 ${isExpired ? 'text-rose-400 font-medium' : ''}`}>
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
                {isExpired && <span className="ml-1 px-1.5 py-0.5 bg-rose-500/10 rounded text-[9px] uppercase tracking-wide">Overdue</span>}
              </div>
            )}
            
            {task.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">
                    <Tag className="w-3 h-3 opacity-50" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions (Hover only on desktop) */}
        <div className="flex flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
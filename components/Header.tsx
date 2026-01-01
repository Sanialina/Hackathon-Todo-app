import React from 'react';
import { Plus, CheckCircle2, ListTodo } from 'lucide-react';

interface HeaderProps {
  stats: { total: number; completed: number; active: number };
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onAddTask }) => {
  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-up">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200 mb-2">
          My Tasks
        </h1>
        <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
            {stats.active} Active
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {stats.completed} Done
          </span>
          {stats.total > 0 && (
            <span className="text-slate-500 hidden sm:inline-block">
               • {completionRate}% Complete
            </span>
          )}
        </div>
      </div>
      
      <button
        onClick={onAddTask}
        className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        New Task
      </button>
    </div>
  );
};

export default Header;
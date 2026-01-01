import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { FilterState, Priority, SortOption, FilterStatus } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  return (
    <div className="p-4 rounded-2xl bg-glass-100 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col md:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      
      {/* Search */}
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Controls Container */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
        
        {/* Status Select */}
        <div className="relative min-w-[120px]">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterStatus }))}
            className="w-full appearance-none bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm rounded-xl py-2.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Priority Select */}
        <div className="relative min-w-[120px]">
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as Priority | 'All' }))}
            className="w-full appearance-none bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm rounded-xl py-2.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Sort Select */}
        <div className="relative min-w-[140px]">
          <select
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as SortOption }))}
            className="w-full appearance-none bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm rounded-xl py-2.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer"
          >
            <option value="date-added">Date Added</option>
            <option value="due-date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="alphabetical">Name (A-Z)</option>
          </select>
          <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
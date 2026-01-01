import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Layout, Calendar as CalendarIcon, CheckCircle2, Circle } from 'lucide-react';
import { Task, FilterState, Priority } from './types';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import FilterBar from './components/FilterBar';
import Header from './components/Header';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('prism-tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    priority: 'All',
    sort: 'date-added',
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('prism-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Handlers ---
  const handleAddTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setIsModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(undefined);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    // Removed confirmation for immediate deletion and better UX flow
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const isCompleting = !task.isCompleted;
      
      const newTasks = [...prev];
      newTasks[taskIndex] = { ...task, isCompleted: isCompleting };

      // Handle Recurrence Logic: Create next instance if completing a recurring task
      if (isCompleting && task.recurrence !== 'None' && task.dueDate) {
        const nextDate = new Date(task.dueDate);
        if (task.recurrence === 'Daily') nextDate.setDate(nextDate.getDate() + 1);
        if (task.recurrence === 'Weekly') nextDate.setDate(nextDate.getDate() + 7);
        if (task.recurrence === 'Monthly') nextDate.setMonth(nextDate.getMonth() + 1);

        const nextTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          title: `${task.title} (Recurring)`,
          isCompleted: false,
          dueDate: nextDate.toISOString(),
          createdAt: Date.now(),
        };
        // Add next task to top
        newTasks.unshift(nextTask);
      }

      return newTasks;
    });
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  // --- Derived State (Filtering & Sorting) ---
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (filters.status === 'active') result = result.filter(t => !t.isCompleted);
    if (filters.status === 'completed') result = result.filter(t => t.isCompleted);
    if (filters.priority !== 'All') result = result.filter(t => t.priority === filters.priority);
    if (filters.search) {
      const lowerQ = filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerQ) || 
        t.description.toLowerCase().includes(lowerQ) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQ))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'priority':
          const pMap: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
          return pMap[b.priority] - pMap[a.priority];
        case 'due-date':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'date-added':
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [tasks, filters]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.isCompleted).length,
    active: tasks.filter(t => !t.isCompleted).length
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-100 selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[#0f172a] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8 h-full">
        {/* Header */}
        <Header 
          stats={stats} 
          onAddTask={openAddModal} 
        />

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Task List */}
        <div className="grid gap-4 pb-20">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-20 bg-glass-100 backdrop-blur-md rounded-3xl border border-white/5 flex flex-col items-center justify-center animate-fade-in">
              <div className="bg-white/5 p-4 rounded-full mb-4">
                <Layout className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 text-lg font-medium">No tasks found</p>
              <p className="text-slate-500 text-sm mt-1">Adjust filters or create a new task</p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={() => openEditModal(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onToggle={() => handleToggleComplete(task.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Add Button (Mobile) */}
      <button 
        onClick={openAddModal}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default App;
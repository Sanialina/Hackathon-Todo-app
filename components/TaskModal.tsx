import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag as TagIcon, RotateCw, AlertCircle } from 'lucide-react';
import { Task, Priority, Recurrence } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialData?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>('None');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
      setRecurrence(initialData.recurrence);
      setTags(initialData.tags);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setRecurrence('None');
    setTags([]);
    setErrors({});
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const task: Task = {
      id: initialData ? initialData.id : crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      isCompleted: initialData ? initialData.isCompleted : false,
      priority,
      tags,
      recurrence,
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
      createdAt: initialData ? initialData.createdAt : Date.now(),
    };

    onSubmit(task);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <h2 className="text-xl font-semibold text-white">
            {initialData ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({...errors, title: ''}); }}
              placeholder="What needs to be done?"
              className={`w-full bg-black/20 border ${errors.title ? 'border-rose-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
              autoFocus
            />
            {errors.title && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Grid Layout for options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Flag className="w-3 h-3" /> Priority
              </label>
              <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                {(['Low', 'Medium', 'High'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      priority === p 
                        ? p === 'High' ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/20' 
                        : p === 'Medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/20' 
                        : 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Recurrence */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="None">None</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
             <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date
              </label>
             <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <TagIcon className="w-3 h-3" /> Tags
            </label>
            <div className="min-h-[46px] bg-black/20 border border-white/10 rounded-xl px-3 py-2 flex flex-wrap gap-2 focus-within:border-indigo-500 transition-colors">
              {tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-indigo-500/20 text-indigo-200 text-xs px-2 py-1 rounded-md border border-indigo-500/30">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Type and press enter..." : ""}
                className="bg-transparent border-none text-sm text-white focus:ring-0 p-0 flex-1 min-w-[100px]"
              />
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 pt-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/40 active:scale-[0.98] transition-all"
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
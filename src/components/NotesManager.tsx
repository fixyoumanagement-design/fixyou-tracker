import React, { useState, useEffect } from 'react';
import { Note, Task, Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle, 
  Search, 
  Briefcase, 
  X, 
  CheckCircle2, 
  Clock, 
  Circle,
  Pin
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NotesManagerProps {
  projects: Project[];
}

export const NotesManager: React.FC<NotesManagerProps> = ({ projects }) => {
  const [subTab, setSubTab] = useState<'notes' | 'tasks'>('notes');
  
  // Note states
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteSearch, setNoteSearch] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

  // Task states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('ALL');
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>('ALL');
  const [taskFilterProject, setTaskFilterProject] = useState<string>('ALL');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    projectId: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
    dueDate: ''
  });

  // Load from LocalStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('fixyou_notes');
    const savedTasks = localStorage.getItem('fixyou_tasks');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes:', e);
      }
    } else {
      // Default placeholder notes to guide the user
      const defaultNotes: Note[] = [
        {
          id: 'def-1',
          title: '📌 Rate Card Talent & KOL Update',
          content: 'KOL Tier A (Beauty): Rp15.000.000 / Flat post\nKOL Tier B (Lifestyle): Rp7.500.000 / Post\nVendor Sound & Stage: PT SoundIndo (Contact: 0812-3456-xxxx) - Diskon 10% jika booked D-30.',
          updatedAt: new Date().toISOString()
        },
        {
          id: 'def-2',
          title: '💡 Ide Kampanye Aktivasi Juli',
          content: '- Pop up booth di JCC Senayan.\n- Sediakan photobox gratis dengan frame brand client.\n- Kasih voucher diskon 20% apabila posting IG Story tag @brand.',
          updatedAt: new Date().toISOString()
        }
      ];
      setNotes(defaultNotes);
      localStorage.setItem('fixyou_notes', JSON.stringify(defaultNotes));
    }

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse tasks:', e);
      }
    } else {
      const defaultTasks: Task[] = [
        {
          id: 'task-def-1',
          title: 'Kirim invoice termin 1 ke client',
          priority: 'HIGH',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-def-2',
          title: 'Review proposal rundown talent',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(defaultTasks);
      localStorage.setItem('fixyou_tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  // Save changes helper
  const saveNotesToStorage = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('fixyou_notes', JSON.stringify(updatedNotes));
  };

  const saveTasksToStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('fixyou_tasks', JSON.stringify(updatedTasks));
  };

  // Note actions
  const handleOpenNoteModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({ title: note.title, content: note.content });
    } else {
      setEditingNote(null);
      setNoteForm({ title: '', content: '' });
    }
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title.trim() && !noteForm.content.trim()) return;

    let updated: Note[];
    if (editingNote) {
      updated = notes.map(n => 
        n.id === editingNote.id 
          ? { ...n, title: noteForm.title || 'Untitled Note', content: noteForm.content, updatedAt: new Date().toISOString() }
          : n
      );
    } else {
      const newNote: Note = {
        id: 'note-' + Date.now(),
        title: noteForm.title || 'Untitled Note',
        content: noteForm.content,
        updatedAt: new Date().toISOString()
      };
      updated = [newNote, ...notes];
    }
    saveNotesToStorage(updated);
    setIsNoteModalOpen(false);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus catatan ini?')) {
      const updated = notes.filter(n => n.id !== id);
      saveNotesToStorage(updated);
    }
  };

  // Task actions
  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        projectId: task.projectId || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || ''
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        projectId: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    let updated: Task[];
    if (editingTask) {
      updated = tasks.map(t => 
        t.id === editingTask.id 
          ? { 
              ...t, 
              title: taskForm.title, 
              projectId: taskForm.projectId || undefined,
              priority: taskForm.priority,
              status: taskForm.status,
              dueDate: taskForm.dueDate || undefined
            }
          : t
      );
    } else {
      const newTask: Task = {
        id: 'task-' + Date.now(),
        title: taskForm.title,
        projectId: taskForm.projectId || undefined,
        priority: taskForm.priority,
        status: taskForm.status,
        dueDate: taskForm.dueDate || undefined,
        createdAt: new Date().toISOString()
      };
      updated = [newTask, ...tasks];
    }
    saveTasksToStorage(updated);
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus kerjaan dari daftar?')) {
      const updated = tasks.filter(t => t.id !== id);
      saveTasksToStorage(updated);
    }
  };

  const handleToggleTaskStatus = (task: Task) => {
    const nextStatus = 
      task.status === 'PENDING' ? 'IN_PROGRESS' : 
      task.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
    
    const updated = tasks.map(t => 
      t.id === task.id ? { ...t, status: nextStatus as any } : t
    );
    saveTasksToStorage(updated);
  };

  // Filter notes
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
    n.content.toLowerCase().includes(noteSearch.toLowerCase())
  );

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase());
    const matchStatus = taskFilterStatus === 'ALL' || t.status === taskFilterStatus;
    const matchPriority = taskFilterPriority === 'ALL' || t.priority === taskFilterPriority;
    const matchProject = taskFilterProject === 'ALL' || t.projectId === taskFilterProject;
    return matchSearch && matchStatus && matchPriority && matchProject;
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b-2 border-[#141414]">
        <button
          onClick={() => setSubTab('notes')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 font-semibold text-xs uppercase tracking-widest border-t-2 border-x-2 transition-all duration-150 active:translate-y-[1px]",
            subTab === 'notes'
              ? "bg-white text-[#141414] border-[#141414] -mb-[2px] z-10 font-black shadow-[0_-2px_0_0_#141414]"
              : "bg-gray-100/50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <FileText size={14} />
          Catatan / Notes
        </button>
        <button
          onClick={() => setSubTab('tasks')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 font-semibold text-xs uppercase tracking-widest border-t-2 border-x-2 transition-all duration-150 active:translate-y-[1px]",
            subTab === 'tasks'
              ? "bg-white text-[#141414] border-[#141414] -mb-[2px] z-10 font-black shadow-[0_-2px_0_0_#141414]"
              : "bg-gray-100/50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <CheckSquare size={14} />
          List Kerjaan / To-Do Checklist
        </button>
      </div>

      {subTab === 'notes' ? (
        <div className="space-y-6">
          {/* Notes Header Search & Create */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Cari catatan..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border-2 border-[#141414] outline-none font-mono focus:shadow-[2px_2px_0px_0px_#141414] transition-all"
                value={noteSearch}
                onChange={e => setNoteSearch(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            <button
              onClick={() => handleOpenNoteModal()}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-yellow-400 hover:bg-[#141414] hover:text-white text-[#141414] border-2 border-[#141414] transition-all duration-150 shadow-[4px_4px_0px_0px_#141414] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#141414]"
            >
              <Plus size={14} />
              Buat Catatan Baru
            </button>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.div
                  layout
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleOpenNoteModal(note)}
                  className="bg-yellow-50 hover:bg-yellow-100/80 border-2 border-[#141414] p-5 cursor-pointer shadow-[6px_6px_0px_0px_#141414] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_#141414] transition-all group flex flex-col justify-between"
                  style={{ minHeight: '160px' }}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-sm text-[#141414] uppercase tracking-wide group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {note.title}
                      </h4>
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          title="Hapus Catatan"
                          className="p-1 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-[11px] text-gray-600 whitespace-pre-line line-clamp-5">
                      {note.content}
                    </p>
                  </div>
                  <div className="border-t border-[#141414]/10 mt-4 pt-2 flex items-center justify-between">
                    <span className="font-mono text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                      Last Saved
                    </span>
                    <span className="font-mono text-[9px] text-[#141414] font-medium">
                      {new Date(note.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredNotes.length === 0 && (
              <div className="col-span-full bg-white border-2 border-dashed border-[#141414] p-12 text-center">
                <FileText size={40} className="mx-auto text-gray-300 mb-2" />
                <p className="font-mono text-xs uppercase text-gray-400 font-bold">Catatan Tidak Ditemukan</p>
                <p className="font-mono text-[10px] text-gray-400 mt-1">Buat catatan baru untuk menyimpan ide, schedule, rate card atau kontak!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tasks Filters & Search */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-1">
              <input
                type="text"
                placeholder="Cari kerjaan..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border-2 border-[#141414] outline-none font-mono focus:shadow-[2px_2px_0px_0px_#141414] transition-all"
                value={taskSearch}
                onChange={e => setTaskSearch(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {/* Filter Project */}
            <div>
              <select
                className="w-full bg-white border-2 border-[#141414] p-2 font-mono text-[10px] font-black uppercase tracking-wider outline-none appearance-none cursor-pointer"
                value={taskFilterProject}
                onChange={e => setTaskFilterProject(e.target.value)}
              >
                <option value="ALL">📂 SEMUA PROJECT</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>💼 {p.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Filter Priority */}
            <div>
              <select
                className="w-full bg-white border-2 border-[#141414] p-2 font-mono text-[10px] font-black uppercase tracking-wider outline-none appearance-none cursor-pointer"
                value={taskFilterPriority}
                onChange={e => setTaskFilterPriority(e.target.value)}
              >
                <option value="ALL">⚠️ SEMUA PRIORITY</option>
                <option value="LOW">🟢 LOW PRIORITY</option>
                <option value="MEDIUM">🟡 MEDIUM PRIORITY</option>
                <option value="HIGH">🔴 HIGH PRIORITY</option>
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <select
                className="w-full bg-white border-2 border-[#141414] p-2 font-mono text-[10px] font-black uppercase tracking-wider outline-none appearance-none cursor-pointer"
                value={taskFilterStatus}
                onChange={e => setTaskFilterStatus(e.target.value)}
              >
                <option value="ALL">🔄 SEMUA STATUS</option>
                <option value="PENDING">📋 PENDING</option>
                <option value="IN_PROGRESS">⚡ IN PROGRESS</option>
                <option value="COMPLETED">✅ COMPLETED</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => handleOpenTaskModal()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-emerald-400 hover:bg-[#141414] hover:text-white text-[#141414] border-2 border-[#141414] transition-all duration-150 shadow-[4px_4px_0px_0px_#141414] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#141414]"
              >
                <Plus size={14} />
                Tambah Tugas
              </button>
            </div>
          </div>

          {/* Task Board / Table */}
          <div className="bg-white border-2 border-[#141414] shadow-[8px_8px_0px_0px_#141414]">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#141414] text-white text-[10px] tracking-widest uppercase border-b-2 border-[#141414]">
                    <th className="p-4 w-12 text-center">Status</th>
                    <th className="p-4">Kerjaan / Tugas</th>
                    <th className="p-4">Link Project</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4 w-20 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[#141414]/10">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => {
                      const linkedProj = projects.find(p => p.id === task.projectId);
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) && task.status !== 'COMPLETED';

                      return (
                        <motion.tr
                          layout
                          key={task.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={cn(
                            "group hover:bg-gray-50/75 transition-colors",
                            task.status === 'COMPLETED' ? "bg-gray-50/40 text-gray-400" : ""
                          )}
                        >
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleTaskStatus(task)}
                              className="focus:outline-none transition-transform hover:scale-115 active:scale-95 inline-block text-center"
                              title="Update Status Kerja"
                            >
                              {task.status === 'COMPLETED' ? (
                                <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                              ) : task.status === 'IN_PROGRESS' ? (
                                <Clock size={18} className="text-amber-500 mx-auto animate-spin-[spin_3s_linear_infinite]" />
                              ) : (
                                <Circle size={18} className="text-gray-400 hover:text-indigo-600 mx-auto" />
                              )}
                            </button>
                          </td>

                          <td className="p-4 font-sans">
                            <div className="flex flex-col gap-0.5">
                              <span className={cn(
                                "text-xs font-bold uppercase",
                                task.status === 'COMPLETED' ? "line-through text-gray-400 font-normal" : "text-[#141414]"
                              )}>
                                {task.title}
                              </span>
                              <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
                                status: <strong className={cn(
                                  task.status === 'COMPLETED' ? "text-emerald-600" :
                                  task.status === 'IN_PROGRESS' ? "text-amber-600" : "text-gray-500"
                                )}>{task.status}</strong>
                              </span>
                            </div>
                          </td>

                          <td className="p-4 font-sans text-xs">
                            {linkedProj ? (
                              <div className="flex items-center gap-1">
                                <Briefcase size={11} className="text-[#141414]/60" />
                                <span className="font-bold underline text-indigo-600 uppercase text-[10px] tracking-wide">
                                  {linkedProj.name}
                                </span>
                              </div>
                            ) : (
                              <span className="font-mono text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                                General Task
                              </span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className={cn(
                              "font-mono text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                              task.priority === 'HIGH' ? "bg-red-100 text-red-700" :
                              task.priority === 'MEDIUM' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            )}>
                              {task.priority}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={11} className={cn(
                                "text-gray-400",
                                isOverdue ? "text-red-500 font-bold" : ""
                              )} />
                              <span className={cn(
                                "font-mono font-medium",
                                isOverdue ? "text-red-600 font-black" : "text-gray-600"
                              )}>
                                {task.dueDate ? (
                                  new Date(task.dueDate).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                ) : '-'}
                              </span>
                              {isOverdue && (
                                <span className="text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 ml-1">
                                  <AlertCircle size={8} /> JATUH TEMPO
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenTaskModal(task)}
                                className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
                                title="Edit Detail"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                title="Hapus Kerjaan"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center bg-gray-50/50">
                        <CheckSquare size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="font-mono text-xs uppercase text-gray-400 font-bold">Daftar Kerjaan Kosong</p>
                        <p className="font-mono text-[10px] text-gray-400 mt-1">Gunakan filter pencarian lain atau buat tugas checklist baru!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 bg-[#141414]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-[#141414] shadow-[12px_12px_0px_0px_#141414] w-full max-w-xl flex flex-col"
            >
              <div className="bg-[#141414] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-yellow-400" />
                  <span className="font-black text-xs uppercase tracking-widest font-mono">
                    {editingNote ? 'Edit Catatan Fixyou' : 'Buat Catatan Baru'}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Judul Catatan / Title</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-sans text-sm outline-none focus:border-[#141414] transition-colors"
                    placeholder="E.G. Rate Card Talent Beauty"
                    value={noteForm.title}
                    onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Isi Catatan / Note Content</label>
                  <textarea
                    rows={8}
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs outline-none focus:border-[#141414] transition-colors resize-none"
                    placeholder="Tulis ide, memo, atau data rate talent di sini..."
                    value={noteForm.content}
                    onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-gray-150 hover:bg-gray-50 text-[#141414] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-yellow-400 hover:bg-[#141414] hover:text-white text-[#141414] border-2 border-[#141414] transition-all shadow-[2px_2px_0px_0px_#141414]"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TASKS MODAL */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-[#141414]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-[#141414] shadow-[12px_12px_0px_0px_#141414] w-full max-w-xl flex flex-col"
            >
              <div className="bg-[#141414] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} className="text-emerald-400" />
                  <span className="font-black text-xs uppercase tracking-widest font-mono">
                    {editingTask ? 'Edit Detail Tugas / List Kerja' : 'Tambah Tugas Checklist Baru'}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Nama Tugas / Task Title</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-sans text-sm outline-none focus:border-[#141414] transition-colors"
                    placeholder="E.G. Blast rundown WA group, bayar talent..."
                    value={taskForm.title}
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Link dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#141414]">Link Dengan Project</label>
                    <select
                      className="w-full bg-[#F5F5F3] border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none cursor-pointer"
                      value={taskForm.projectId}
                      onChange={e => setTaskForm({ ...taskForm, projectId: e.target.value })}
                    >
                      <option value="">-- Tugas Umum / General Task --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name.toUpperCase()} (Client: {p.client})</option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Batas Tanggal / Due Date</label>
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-2 border-gray-100 p-2.5 font-mono text-xs outline-none focus:border-[#141414]"
                      value={taskForm.dueDate}
                      onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Skala Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['LOW', 'MEDIUM', 'HIGH'] as const).map(prio => (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setTaskForm({ ...taskForm, priority: prio })}
                          className={cn(
                            "py-2 px-1 text-[10px] font-black uppercase tracking-wider border-2 transition-all",
                            taskForm.priority === prio
                              ? prio === 'HIGH' ? "bg-red-500 text-white border-red-500"
                                : prio === 'MEDIUM' ? "bg-amber-400 text-white border-amber-400"
                                : "bg-blue-500 text-white border-blue-500"
                              : "bg-white border-gray-200 text-[#141414] hover:bg-gray-50"
                          )}
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Urutan Progress / Status</label>
                    <select
                      className="w-full bg-[#F5F5F3] border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none cursor-pointer"
                      value={taskForm.status}
                      onChange={e => setTaskForm({ ...taskForm, status: e.target.value as any })}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-gray-150 hover:bg-gray-50 text-[#141414] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-400 hover:bg-[#141414] hover:text-white text-[#141414] border-2 border-[#141414] transition-all shadow-[2px_2px_0px_0px_#141414]"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

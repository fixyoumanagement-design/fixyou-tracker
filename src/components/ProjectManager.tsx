import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, ExternalLink, Download } from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import { formatRupiah, cn } from '../lib/utils';
import { exportProjectsToExcel } from '../lib/export';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectManagerProps {
  projects: Project[];
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
}

const statusColors: Record<ProjectStatus, string> = {
  'WAIT': 'bg-gray-400',
  'BOOKING': 'bg-blue-500',
  'FIXED/RUNNING': 'bg-amber-500',
  'FINALIZED': 'bg-emerald-500'
};

export const ProjectManager: React.FC<ProjectManagerProps> = ({ 
  projects, 
  onAdd, 
  onEdit, 
  onDelete,
  onUpdateStatus
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'ALL'>('ALL');
  const [filterBrand, setFilterBrand] = useState('ALL');

  const brands = ['ALL', ...Array.from(new Set(projects.map(p => p.brand)))];

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesBrand = filterBrand === 'ALL' || p.brand === filterBrand;
    return matchesSearch && matchesStatus && matchesBrand;
  });

  const TabButton = ({ status, label }: { status: ProjectStatus | 'ALL', label: string }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={cn(
        "px-4 py-2 font-black uppercase text-[10px] tracking-widest transition-all",
        filterStatus === status 
          ? "bg-[#141414] text-white" 
          : "text-gray-400 hover:text-[#141414]"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Project Engine</h2>
        <div className="flex gap-4">
          <button
            onClick={() => exportProjectsToExcel(projects)}
            className="flex items-center gap-2 bg-white border-2 border-[#141414] text-[#141414] px-6 py-3 font-bold uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_#141414] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Download size={16} />
            Export data
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#141414] text-white px-6 py-3 font-bold uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_#10B981] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Plus size={16} />
            Create New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white border-2 border-[#141414] p-4 shadow-[4px_4px_0px_0px_#141414]">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="SEARCH BY PROJECT OR CLIENT..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 font-mono text-[11px] focus:outline-none focus:border-[#141414]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 font-mono text-[11px] focus:outline-none appearance-none uppercase"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            {brands.map(b => <option key={b} value={b}>{b === 'ALL' ? 'ALL BRANDS' : b}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-center border-l border-gray-100">
           <span className="font-mono text-[10px] text-gray-400 uppercase font-bold pr-3">Found:</span>
           <span className="font-mono text-[11px] font-black">{filtered.length} Items</span>
        </div>
      </div>

      <div className="border-b-2 border-[#141414] flex flex-wrap">
        <TabButton status="ALL" label="ALL PROJECTS" />
        <TabButton status="WAIT" label="WAIT" />
        <TabButton status="BOOKING" label="BOOKING" />
        <TabButton status="FIXED/RUNNING" label="RUNNING" />
        <TabButton status="FINALIZED" label="FINALIZED" />
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] hover:shadow-[6px_6px_0px_0px_#141414] transition-all relative overflow-hidden"
            >
              <div className={cn("absolute top-0 left-0 w-1 h-full", statusColors[p.status])} />
              
              <div className="p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#141414] text-white px-2 py-0.5 text-[8px] font-mono uppercase font-bold">
                      {p.brand}
                    </span>
                    <span className="text-gray-400 font-mono text-[10px] uppercase font-bold">
                      {new Date(p.runningDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-lg font-black uppercase leading-tight mb-1">{p.name}</h4>
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px] uppercase">
                    <span className="text-amber-600 font-bold">{p.client}</span>
                    <span>•</span>
                    <span>{p.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pr-8">
                  <div>
                    <label className="block text-[8px] font-mono text-gray-400 uppercase font-black mb-1">Gross Revenue</label>
                    <span className="font-mono text-xs font-black">{formatRupiah(p.revenue)}</span>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-gray-400 uppercase font-black mb-1">Net Profit</label>
                    <span className="font-mono text-xs font-black text-emerald-600">{formatRupiah(p.profit)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    className={cn(
                      "font-mono text-[10px] font-black uppercase px-3 py-1.5 border-2 border-[#141414] focus:outline-none cursor-pointer",
                      statusColors[p.status],
                      "text-white"
                    )}
                    value={p.status}
                    onChange={(e) => onUpdateStatus(p.id, e.target.value as ProjectStatus)}
                  >
                    <option value="WAIT">WAIT</option>
                    <option value="BOOKING">BOOKING</option>
                    <option value="FIXED/RUNNING">RUNNING</option>
                    <option value="FINALIZED">FINALIZED</option>
                  </select>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(p)}
                      className="p-2 border-2 border-[#141414] hover:bg-gray-100 transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)}
                      className="p-2 border-2 border-[#141414] hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
              No matching projects found in the system
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

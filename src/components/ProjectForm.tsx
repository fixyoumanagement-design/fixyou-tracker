import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Project, JobCategory, ProjectStatus } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: any) => void;
  initialData?: Project | null;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    brand: '',
    runningDate: new Date().toISOString().split('T')[0],
    revenue: 0,
    payout: 0,
    status: 'WAIT' as ProjectStatus,
    category: 'PIC' as JobCategory
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        client: initialData.client,
        brand: initialData.brand,
        runningDate: new Date(initialData.runningDate).toISOString().split('T')[0],
        revenue: initialData.revenue,
        payout: initialData.payout,
        status: initialData.status,
        category: initialData.category
      });
    } else {
      setFormData({
        name: '',
        client: '',
        brand: '',
        runningDate: new Date().toISOString().split('T')[0],
        revenue: 0,
        payout: 0,
        status: 'WAIT',
        category: 'PIC'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const profit = formData.revenue - formData.payout;
      await onSubmit({ ...formData, profit, runningDate: new Date(formData.runningDate).toISOString() });
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#141414]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white border-4 border-[#141414] shadow-[12px_12px_0px_0px_#141414] overflow-hidden"
          >
            <div className="bg-[#141414] p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest italic">
                {initialData ? 'Update Project Engine' : 'Initialize New Project'}
              </h2>
              <button onClick={onClose} className="hover:rotate-90 transition-transform p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Project Name</label>
                  <input
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.G. TALENT MANAGEMENT Q4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Client / Principal</label>
                  <input
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none transition-colors"
                    value={formData.client}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    placeholder="E.G. STARBUCK ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Entity</label>
                  <input
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none transition-colors"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="FIXYOU / ARUTALA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Running Date</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none transition-colors"
                    value={formData.runningDate}
                    onChange={e => setFormData({ ...formData, runningDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 text-emerald-600">Revenue (Gross)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-gray-50 border-2 border-emerald-100 p-3 font-mono text-xs focus:border-emerald-500 outline-none transition-colors"
                    value={formData.revenue}
                    onChange={e => setFormData({ ...formData, revenue: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 text-amber-600">Payout (to Talent/Vendor)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-gray-50 border-2 border-amber-100 p-3 font-mono text-xs focus:border-amber-500 outline-none transition-colors"
                    value={formData.payout}
                    onChange={e => setFormData({ ...formData, payout: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Job Category</label>
                  <select
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as JobCategory })}
                  >
                    <option value="PIC">AS PIC</option>
                    <option value="Job Partner">JOB PARTNER</option>
                    <option value="Job Vendor">JOB VENDOR</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Workflow Status</label>
                  <select
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 font-mono text-xs focus:border-[#141414] outline-none appearance-none"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  >
                    <option value="WAIT">WAIT</option>
                    <option value="BOOKING">BOOKING</option>
                    <option value="FIXED/RUNNING">RUNNING</option>
                    <option value="FINALIZED">FINALIZED</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                 <div className="mr-auto">
                    <span className="block text-[8px] font-black uppercase text-gray-300">ESTIMATED PROFIT</span>
                    <span className="font-mono text-lg font-black text-emerald-600">
                      Rp{(formData.revenue - formData.payout).toLocaleString('id-ID')}
                    </span>
                 </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-gray-400 hover:text-[#141414] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "flex items-center gap-2 bg-[#141414] text-white px-8 py-3 font-bold uppercase text-xs tracking-widest transition-all",
                    isSubmitting 
                      ? "opacity-50 cursor-not-allowed" 
                      : "shadow-[4px_4px_0px_0px_#10B981] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  )}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSubmitting ? 'PROCESSING...' : (initialData ? 'Update Core' : 'Deploy Project')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

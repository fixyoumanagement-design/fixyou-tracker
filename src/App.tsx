/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthGuard } from './components/AuthGuard';
import { Sidebar } from './components/Sidebar';
import { Stats } from './components/dashboard/Stats';
import { Charts } from './components/dashboard/Charts';
import { Ledger } from './components/dashboard/Ledger';
import { ProjectManager } from './components/ProjectManager';
import { ProjectForm } from './components/ProjectForm';
import { Toast } from './components/ui/Toast';
import { useProjects } from './hooks/useProjects';
import { Project, ProjectStatus } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });
  
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
  };

  const handleCreate = async (data: any) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        showToast('PROJECT CORE UPDATED');
      } else {
        await addProject(data);
        showToast('CORE PROJECT DEPLOYED');
      }
    } catch (e) {
      showToast('SYSTEM ERROR: CALIBRATION FAILED', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('REMOVING PROJECT FROM DATA ENGINE. PROCEED?')) {
      try {
        await deleteProject(id);
        showToast('PROJECT ERASED FROM SYSTEM');
      } catch (e) {
        showToast('ERROR: DELETION FAILED', 'error');
      }
    }
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: ProjectStatus) => {
    const p = projects.find(proj => proj.id === id);
    if (p) {
      try {
        await updateProject(id, { ...p, status, profit: p.revenue - p.payout });
        showToast(`STATUS RECONFIGURED: ${status}`);
      } catch (e) {
        showToast('STATUS UPDATE FAILED', 'error');
      }
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F5F5F3]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 ml-64 p-10">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <p className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-1">
                Operational Control Center
              </p>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                {activeTab === 'dashboard' && 'Core Insights'}
                {activeTab === 'projects' && 'Project Factory'}
                {activeTab === 'accounting' && 'Financial Ledger'}
                {activeTab === 'reports' && 'Strategic Reports'}
              </h1>
            </div>
            <div className="font-mono text-[10px] font-bold text-[#141414] flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM LIVE
              </div>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <>
                  <Stats projects={projects} />
                  <div className="grid grid-cols-1 gap-8">
                    <Charts projects={projects} />
                    <Ledger projects={projects} />
                  </div>
                </>
              )}

              {activeTab === 'projects' && (
                <ProjectManager 
                  projects={projects}
                  onAdd={openAdd}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}

              {activeTab === 'accounting' && (
                <div className="space-y-8">
                  <Stats projects={projects} />
                  <Ledger projects={projects} />
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="bg-white border-2 border-[#141414] p-20 flex items-center justify-center shadow-[8px_8px_0px_0px_#141414]">
                   <div className="text-center">
                      <h2 className="text-2xl font-black uppercase mb-4">Module Under Calibration</h2>
                      <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
                        Advanced analytics reporting will be available in next deployment
                      </p>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <ProjectForm 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          initialData={editingProject}
        />

        <Toast 
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      </div>
    </AuthGuard>
  );
}

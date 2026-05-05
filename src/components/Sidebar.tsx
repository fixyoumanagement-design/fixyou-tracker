import React from 'react';
import { LayoutDashboard, Briefcase, FileText, PieChart, LogOut, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { logout } from '../lib/firebase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'accounting', label: 'Accounting', icon: FileText },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r-2 border-[#141414] flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 border-b-2 border-[#141414] bg-[#141414] text-white">
        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
          Fixyou
          <span className="block text-[10px] font-mono tracking-widest mt-1 opacity-60">Management</span>
        </h1>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-widest text-[11px] transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-[#141414] text-white shadow-[4px_4px_0px_0px_#10B981]" 
                    : "text-[#141414] hover:bg-gray-100"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t-2 border-[#141414] space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-500 hover:text-[#141414] transition-colors">
          <Settings size={16} />
          Settings
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

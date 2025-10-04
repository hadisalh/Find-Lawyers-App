import React, { useState } from 'react';
import { ScaleIcon, Bars3Icon, XMarkIcon } from '../ui/icons';

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-slate-900 text-white p-4 flex-col fixed h-full hidden md:flex">
        {sidebar}
      </aside>
      
      {/* Mobile Sidebar and Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
        
        {/* Mobile Sidebar */}
        <aside className={`absolute inset-y-0 right-0 w-64 bg-slate-900 text-white p-4 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">القائمة</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-300 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          {sidebar}
        </aside>
      </div>

      <div className="flex-1 flex flex-col md:mr-64">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm sticky top-0 z-30 p-4 flex justify-between items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-emerald-500">
                <Bars3Icon className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-2">
                <ScaleIcon className="w-7 h-7 text-emerald-500" />
                <h1 className="text-lg font-bold text-slate-800">محامي العراق</h1>
            </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
            {children}
        </main>
      </div>
    </div>
  );
};
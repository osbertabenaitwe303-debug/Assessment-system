import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  FileCheck,
  Table,
  SlidersHorizontal,
  Users,
  BookOpen,
  Sparkles,
  RefreshCw,
  Download,
  Upload,
  UserCheck,
  ShieldCheck,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenLoginModal: () => void;
  onOpenAiAssistant: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLoginModal,
  onOpenAiAssistant,
  onResetData,
  onExportData,
  onImportData
}) => {
  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';

  const navItems = isTeacher
    ? [
        { id: 'teacher-dashboard', label: 'My Subject Dashboard', icon: LayoutDashboard },
        { id: 'assessments', label: 'Subject Assessments', icon: FileCheck },
        { id: 'marksheet', label: 'Marksheet & Gradebook', icon: Table },
        { id: 'classes', label: 'Classes & Subjects', icon: BookOpen }
      ]
    : [
        { id: 'admin-portal', label: 'Admin Verification & Accounts', icon: ShieldCheck },
        { id: 'dashboard', label: 'Schoolwide Overview', icon: LayoutDashboard },
        { id: 'assessments', label: 'All Assessments', icon: FileCheck },
        { id: 'marksheet', label: 'All Marksheets', icon: Table },
        { id: 'classes', label: 'Classes & Subjects', icon: BookOpen }
      ];

  return (
    <header className="bg-[#1C1917] border-b-2 border-stone-800 text-stone-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo & School Name */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-stone-50 text-stone-900 border border-stone-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <GraduationCap className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-100">
                  Oakridge Assessment Hub
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 bg-stone-800 text-amber-300 border border-stone-700">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block font-serif italic">
                Subject Teacher & Admin Verification System
              </p>
            </div>
          </div>

          {/* User Account Badge & Tools */}
          <div className="flex items-center space-x-2">
            {/* Logged in User Profile Switcher */}
            <button
              onClick={onOpenLoginModal}
              title="Switch user account or log in"
              className="flex items-center space-x-2.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 transition-all"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name || 'User'}
                className="w-6 h-6 rounded-full object-cover border border-amber-400"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1">
                  <span className="font-serif font-bold text-xs leading-tight text-stone-100">{currentUser?.name || 'Log In'}</span>
                  <span className={`text-[9px] font-mono font-bold uppercase px-1 py-0.2 ${
                    isAdmin ? 'bg-amber-400 text-stone-900' : 'bg-purple-900 text-purple-200'
                  }`}>
                    {currentUser?.role || 'Guest'}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 leading-none truncate max-w-[120px]">
                  {currentUser?.title || 'User Portal'}
                </p>
              </div>
            </button>

            <button
              id="ai-assistant-header-btn"
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-2 px-3 py-1.5 bg-stone-50 hover:bg-stone-200 text-stone-900 font-bold text-xs sm:text-sm border border-stone-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
              <span className="tracking-wide hidden sm:inline">AI Assistant</span>
            </button>

            <div className="hidden md:flex items-center space-x-1 pl-2 border-l border-stone-800 text-stone-400">
              <button
                id="export-data-btn"
                onClick={onExportData}
                title="Backup / Export School Data"
                className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                id="import-data-btn"
                onClick={onImportData}
                title="Restore / Import School Data"
                className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                id="reset-data-btn"
                onClick={onResetData}
                title="Reset to Demo Data"
                className="p-2 hover:bg-stone-800 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-stone-800/80">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-amber-400 text-amber-300 bg-stone-800/80 font-bold'
                    : 'border-b-2 border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


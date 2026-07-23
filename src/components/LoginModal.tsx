import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  BookOpen,
  KeyRound,
  CheckCircle,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser
}) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'teacher' | 'admin'>('all');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => {
    if (selectedRole === 'all') return true;
    return u.role === selectedRole;
  });

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter an email address');
      return;
    }

    const found = users.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (found) {
      onSelectUser(found);
      onClose();
    } else {
      setErrorMsg(`No account found matching email "${emailInput}". Please select a preset account below.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-2xl max-h-[92vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1C1917] text-stone-50 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base text-white">Oakridge User Portal Access</h3>
          </div>
          {currentUser && (
            <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-900">
          {/* Active Session Info Banner */}
          {currentUser ? (
            <div className="p-4 bg-emerald-50 border border-emerald-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border border-stone-900 object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-stone-900 text-sm">{currentUser.name}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 border ${
                      currentUser.role === 'admin' ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-purple-100 text-purple-900 border-purple-300'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-serif italic">{currentUser.title || currentUser.email}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-800 font-bold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Active Session</span>
              </span>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-800 space-y-1">
              <h4 className="text-sm font-serif font-bold text-amber-950 flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-amber-800" />
                <span>Multi-Role Portal Authentication</span>
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Log in as a <strong>Subject Teacher</strong> to manage assessments & submit student marks, or as an <strong>Admin</strong> to oversee teacher accounts and verify submitted scores.
              </p>
            </div>
          )}

          {/* Preset Quick Login Accounts Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900">
                1-Click Account Switcher / Preset Users
              </h4>
              <div className="flex space-x-1">
                {(['all', 'teacher', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
                      selectedRole === role
                        ? 'bg-stone-900 text-stone-50 border-stone-900'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-stone-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredUsers.map(user => {
                const isCurrent = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`p-3.5 border cursor-pointer transition-all flex flex-col justify-between space-y-2 relative ${
                      isCurrent
                        ? 'bg-purple-50 border-purple-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                        : 'bg-[#FAF8F5] border-stone-800 hover:bg-white hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-800"
                        />
                        <div>
                          <h5 className="text-xs font-serif font-bold text-stone-900 leading-tight">{user.name}</h5>
                          <p className="text-[11px] text-stone-600 line-clamp-1">{user.title}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-300/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-stone-500">{user.email}</span>
                      <span className="font-bold text-stone-900 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>{isCurrent ? 'Current' : 'Log In'}</span>
                        <ArrowRight className="w-3 h-3 text-stone-900" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form for manual credentials */}
          <div className="pt-4 border-t border-stone-300 space-y-3">
            <h4 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider">
              Manual Email Sign-In
            </h4>

            {errorMsg && (
              <p className="text-xs font-bold text-rose-700 bg-rose-50 p-2 border border-rose-300">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleCustomLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-[11px] font-bold text-stone-700">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. s.jenkins@oakridge.edu"
                  value={emailInput}
                  onChange={e => {
                    setEmailInput(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-[11px] font-bold text-stone-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs"
                />
              </div>

              <div className="flex items-end sm:col-span-1">
                <button
                  type="submit"
                  className="w-full py-1.5 bg-stone-900 text-stone-50 font-bold text-xs border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:bg-stone-800 transition-all"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

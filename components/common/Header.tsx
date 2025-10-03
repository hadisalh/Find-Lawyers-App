import React from 'react';
import { User } from '../../types';
import { ScaleIcon, ArrowLeftOnRectangleIcon } from '../ui/icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ScaleIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">محامي العراق</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            أهلاً، <span className="font-bold text-gray-900">{user.fullName}</span>
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-bold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
            title="تسجيل الخروج"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.NAMES, icon: 'fa-users', label: '成員名單' },
    { id: AppTab.LUCKY_DRAW, icon: 'fa-gift', label: '隨機抽籤' },
    { id: AppTab.GROUPING, icon: 'fa-sitemap', label: '自動分組' },
  ];

  return (
    <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col h-auto md:h-screen sticky top-0 z-50 shadow-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-briefcase text-indigo-400"></i>
          <span>HR Magic Suite</span>
        </h1>
      </div>
      
      <div className="flex-1 flex md:flex-col overflow-x-auto md:overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-3 px-6 py-4 transition-all whitespace-nowrap ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white border-l-4 border-indigo-400' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 text-xs text-slate-500 hidden md:block border-t border-slate-800">
        &copy; 2024 行政管理小幫手
      </div>
    </nav>
  );
};

export default Navigation;

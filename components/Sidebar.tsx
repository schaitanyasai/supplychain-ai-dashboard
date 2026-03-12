
import React from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';
import { DashboardIcon, ChartIcon, OptimizeIcon, PlayIcon } from './icons';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const getIcon = (page: Page) => {
  switch (page) {
    case Page.Dashboard:
      return <DashboardIcon className="w-5 h-5 mr-3" />;
    case Page.DemandForecast:
      return <ChartIcon className="w-5 h-5 mr-3" />;
    case Page.Optimization:
      return <OptimizeIcon className="w-5 h-5 mr-3" />;
    case Page.Simulation:
      return <PlayIcon className="w-5 h-5 mr-3" />;
    default:
      return null;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  return (
    <div className="w-64 bg-dark-200 text-dark-content h-screen p-4 flex flex-col fixed">
      <div className="flex items-center mb-10">
        <OptimizeIcon className="w-10 h-10 text-brand-secondary" />
        <h1 className="text-xl font-bold ml-2">SupplyChain AI</h1>
      </div>
      <nav>
        <ul>
          {NAV_ITEMS.map((page) => (
            <li key={page} className="mb-2">
              <button
                onClick={() => onPageChange(page)}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activePage === page
                    ? 'bg-brand-secondary text-white'
                    : 'hover:bg-dark-300'
                }`}
              >
                {getIcon(page)}
                <span className="font-medium">{page}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-sm text-gray-400">
        <p>&copy; 2024 SC-AI Corp.</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;

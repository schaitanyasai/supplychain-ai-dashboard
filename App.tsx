
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DemandForecast from './pages/DemandForecast';
import Optimization from './pages/Optimization';
import Simulation from './pages/Simulation';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);

  const renderPage = () => {
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.DemandForecast:
        return <DemandForecast />;
      case Page.Optimization:
        return <Optimization />;
      case Page.Simulation:
        return <Simulation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-100 text-dark-content">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 flex flex-col ml-64">
        <Header activePage={activePage} />
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;

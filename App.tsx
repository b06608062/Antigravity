
import React, { useState, useCallback } from 'react';
import { AppTab, Participant } from './types';
import Navigation from './components/Navigation';
import NameManagement from './components/NameManagement';
import LuckyDraw from './components/LuckyDraw';
import TeamGrouping from './components/TeamGrouping';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.NAMES);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === AppTab.NAMES && (
            <NameManagement 
              participants={participants} 
              onUpdate={handleUpdateParticipants} 
            />
          )}

          {activeTab === AppTab.LUCKY_DRAW && (
            <LuckyDraw participants={participants} />
          )}

          {activeTab === AppTab.GROUPING && (
            <TeamGrouping participants={participants} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [availablePool, setAvailablePool] = useState<Participant[]>([]);
  const [winnerHistory, setWinnerHistory] = useState<Participant[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  
  const rollInterval = useRef<number | null>(null);

  useEffect(() => {
    setAvailablePool(participants);
  }, [participants]);

  const startRoll = () => {
    if (availablePool.length === 0 && !allowDuplicates) {
      alert('已無可抽籤的成員！');
      return;
    }

    setIsRolling(true);
    setWinner(null);

    // Dynamic shuffling animation
    rollInterval.current = window.setInterval(() => {
      setDisplayIndex(Math.floor(Math.random() * participants.length));
    }, 80);

    // Stop after random time
    setTimeout(() => {
      stopRoll();
    }, 2500);
  };

  const stopRoll = () => {
    if (rollInterval.current) {
      clearInterval(rollInterval.current);
      rollInterval.current = null;
    }

    const pool = allowDuplicates ? participants : availablePool;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    setWinner(chosen);
    setWinnerHistory(prev => [chosen, ...prev]);
    
    if (!allowDuplicates) {
      setAvailablePool(prev => prev.filter(p => p.id !== chosen.id));
    }
    
    setIsRolling(false);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">獎品抽籤</h2>
        <p className="text-slate-600">為活動增加驚喜，隨機抽選幸運兒。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-indigo-50 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                {isRolling ? '抽獎進行中...' : '準備好要抽獎了嗎？'}
              </span>
            </div>

            <div className="w-full flex items-center justify-center h-48">
              {isRolling ? (
                <div className="text-6xl font-black text-slate-800 animate-pulse">
                  {participants[displayIndex]?.name || '...'}
                </div>
              ) : winner ? (
                <div className="flex flex-col items-center animate-bounce">
                  <div className="text-7xl font-black text-indigo-600 drop-shadow-md">
                    {winner.name}
                  </div>
                  <div className="mt-4 text-emerald-500 font-bold flex items-center gap-2">
                    <i className="fas fa-crown"></i> 恭喜獲獎！
                  </div>
                </div>
              ) : (
                <div className="text-6xl font-black text-slate-200">
                  <i className="fas fa-question-circle"></i>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <button
                onClick={startRoll}
                disabled={isRolling || (availablePool.length === 0 && !allowDuplicates)}
                className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-700 shadow-xl"
              >
                {isRolling ? (
                  <>
                    <i className="fas fa-sync fa-spin mr-2"></i> 抽選中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play mr-2"></i> 開始抽選
                  </>
                )}
              </button>

              <div className="flex items-center gap-6 text-sm text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>允許重複中獎</span>
                </label>
                <div className="text-slate-400">
                  剩餘人數: <span className="text-indigo-600 font-semibold">{allowDuplicates ? participants.length : availablePool.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-history text-indigo-400"></i>
            中獎紀錄
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {winnerHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-60">
                <i className="fas fa-ghost text-4xl"></i>
                <span>尚無紀錄</span>
              </div>
            ) : (
              <div className="space-y-3">
                {winnerHistory.map((w, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 animate-slide-in">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-[10px] flex items-center justify-center font-bold">
                        {winnerHistory.length - idx}
                      </span>
                      <span className="font-medium text-slate-700">{w.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 italic">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {winnerHistory.length > 0 && (
            <button
              onClick={() => setWinnerHistory([])}
              className="mt-4 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              清除紀錄
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;

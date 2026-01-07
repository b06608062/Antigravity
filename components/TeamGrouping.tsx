
import React, { useState } from 'react';
import { Participant, Group } from '../types';

interface TeamGroupingProps {
  participants: Participant[];
}

const TeamGrouping: React.FC<TeamGroupingProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<Group[]>([]);
  const [mode, setMode] = useState<'perGroup' | 'totalGroups'>('perGroup');

  // Utility function for shuffling array elements using generic type
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const performGrouping = () => {
    if (participants.length === 0) {
      alert('請先在「成員名單」頁面新增人員！');
      return;
    }

    // Fix: Explicitly specify Participant type parameter for shuffleArray to prevent inference as unknown[]
    const shuffled = shuffleArray<Participant>(participants);
    const result: Group[] = [];
    
    let actualGroupSize = groupSize;
    if (mode === 'totalGroups') {
      actualGroupSize = Math.ceil(participants.length / groupSize);
    }

    for (let i = 0; i < shuffled.length; i += actualGroupSize) {
      result.push({
        id: result.length + 1,
        members: shuffled.slice(i, i + actualGroupSize)
      });
    }

    setGroups(result);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,組別,成員姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `第 ${group.id} 組,${member.name}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const adjustSize = (delta: number) => {
    const maxVal = participants.length || 100;
    setGroupSize(prev => {
      const newVal = prev + delta;
      return Math.max(1, Math.min(maxVal, newVal));
    });
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">自動分組</h2>
          <p className="text-slate-600">設定規則，系統將為您公平分配組別。</p>
        </div>
        {groups.length > 0 && (
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <i className="fas fa-file-csv text-xl"></i> 下載 CSV
          </button>
        )}
      </header>

      {/* 設定區塊：改用按鈕調整數值 */}
      <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 mb-10 text-white">
        <div className="flex flex-col md:flex-row items-stretch md:items-end gap-8">
          <div className="flex-1 space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">分組邏輯</label>
            <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => { setMode('perGroup'); setGroupSize(2); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'perGroup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                每組人數
              </button>
              <button
                onClick={() => { setMode('totalGroups'); setGroupSize(2); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'totalGroups' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                總組別數
              </button>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-3">
            <label className="text-xs font-bold text-slate-100 uppercase tracking-widest block">
              {mode === 'perGroup' ? '調整每組人數' : '調整分組數量'}
            </label>
            <div className="flex items-center bg-white rounded-2xl border-2 border-indigo-400 overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.2)]">
              <button 
                onClick={() => adjustSize(-1)}
                disabled={groupSize <= 1}
                className="w-16 h-16 flex items-center justify-center bg-slate-50 hover:bg-indigo-50 text-indigo-600 disabled:text-slate-300 disabled:bg-slate-100 transition-colors"
              >
                <i className="fas fa-minus text-xl"></i>
              </button>
              
              <div className="flex-1 text-center bg-white">
                <div className="text-slate-900 text-3xl font-black leading-none">
                  {groupSize}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  {mode === 'perGroup' ? '人 / 組' : '組數'}
                </div>
              </div>

              <button 
                onClick={() => adjustSize(1)}
                disabled={groupSize >= (participants.length || 100)}
                className="w-16 h-16 flex items-center justify-center bg-slate-50 hover:bg-indigo-50 text-indigo-600 disabled:text-slate-300 disabled:bg-slate-100 transition-colors"
              >
                <i className="fas fa-plus text-xl"></i>
              </button>
            </div>
          </div>

          <button
            onClick={performGrouping}
            className="w-full md:w-auto px-10 py-5 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-400 transition-all font-black text-lg shadow-xl"
          >
            <i className="fas fa-dice mr-2"></i> 立即分組
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group">
            <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-3">
              <h4 className="font-black text-slate-800 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-100">
                  {group.id}
                </span>
                第 {group.id} 組
              </h4>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                {group.members.length} 人
              </span>
            </div>
            <ul className="space-y-3">
              {group.members.map((m) => (
                <li key={m.id} className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg group-hover:bg-white transition-colors">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <span className="font-medium">{m.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="py-32 text-center text-slate-300 space-y-6">
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <i className="fas fa-layer-group text-7xl opacity-10"></i>
              <i className="fas fa-search text-2xl absolute bottom-0 right-0 opacity-20"></i>
            </div>
          </div>
          <p className="font-medium">尚未進行分組。請設定參數後開始。</p>
        </div>
      )}
    </div>
  );
};

export default TeamGrouping;

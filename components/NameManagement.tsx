
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface NameManagementProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
}

const NameManagement: React.FC<NameManagementProps> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  const mockNames = [
    '陳大文', '林小華', '張美玲', '李志強', '王思源', 
    '陳大文', '趙敏', '周杰倫', '郭富城', '李志強',
    '劉德華', '張學友', '蔡依林', '周子瑜', '徐若瑄'
  ];

  const handlePasteSubmit = () => {
    const names = inputText
      .split(/[\n,]/)
      .map(n => n.trim())
      .filter(n => n !== '');
    
    const newList = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...participants, ...newList]);
    setInputText('');
  };

  const loadMockData = () => {
    const newList = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text
        .split(/[\n,]/)
        .map(n => n.trim())
        .filter(n => n !== '' && n !== 'name' && n !== 'Name');

      const newList = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      onUpdate([...participants, ...newList]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      onUpdate([]);
    }
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const unique = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(unique);
  };

  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => counts[p.name] = (counts[p.name] || 0) + 1);
    return new Set(Object.keys(counts).filter(n => counts[n] > 1));
  }, [participants]);

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">成員名單管理</h2>
          <p className="text-slate-600">在此建立您的名單庫，供抽籤或分組使用。</p>
        </div>
        <button 
          onClick={loadMockData}
          className="px-5 py-2.5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
        >
          <i className="fas fa-magic mr-2"></i>載入範例名單
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-700">
            <i className="fas fa-plus-circle text-indigo-500"></i>
            快速匯入
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">貼上姓名 (每行一個)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="輸入姓名..."
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none text-slate-800"
              />
              <button
                onClick={handlePasteSubmit}
                disabled={!inputText.trim()}
                className="mt-3 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all font-bold shadow-lg shadow-indigo-100"
              >
                加入名單
              </button>
            </div>

            <div className="relative pt-6 border-t border-slate-100">
              <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-3 text-[10px] font-bold text-slate-300 uppercase">或是</span>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">上傳檔案 (.csv, .txt)</label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-indigo-50 hover:file:text-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
              <i className="fas fa-list-ul text-emerald-500"></i>
              預覽名單 ({participants.length})
            </h3>
            <div className="flex gap-2">
              {duplicateNames.size > 0 && (
                <button 
                  onClick={removeDuplicates}
                  className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 flex items-center gap-1.5 font-bold transition-colors"
                >
                  <i className="fas fa-trash-sweep"></i> 移除重複項
                </button>
              )}
              {participants.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-red-500 px-2 py-1.5 transition-colors"
                >
                  <i className="fas fa-trash-alt"></i> 清空
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
            {participants.length === 0 ? (
              <div className="text-center py-20 text-slate-300 italic flex flex-col items-center justify-center gap-4">
                <i className="fas fa-users text-5xl opacity-10"></i>
                <p>名單空空如也...</p>
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDuplicate = duplicateNames.has(p.name);
                return (
                  <div 
                    key={p.id} 
                    className={`group flex items-center justify-between p-3 rounded-xl transition-all border ${isDuplicate ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-transparent hover:border-slate-200 hover:bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full ${isDuplicate ? 'bg-red-200' : 'bg-slate-200 text-slate-500'}`}>
                        {idx + 1}
                      </span>
                      <span className="font-medium">{p.name}</span>
                      {isDuplicate && (
                        <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">重複</span>
                      )}
                    </div>
                    <button 
                      onClick={() => onUpdate(participants.filter(item => item.id !== p.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NameManagement;

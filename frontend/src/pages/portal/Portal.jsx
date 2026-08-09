import React, { useState } from 'react';
import { Database, ShieldAlert } from 'lucide-react';

export default function ResourcePortal({ equipments, searchQuery, onNavigate }) {
  const [filterField, setFilterField] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterQual, setFilterQual] = useState('all');

  const filteredEquips = equipments.filter(eq => {
    const matchSearch = !searchQuery || eq.name.includes(searchQuery) || eq.code.includes(searchQuery) || eq.location.includes(searchQuery);
    const matchField = filterField === 'all' || eq.field === filterField;
    const matchStatus = filterStatus === 'all' || eq.status === filterStatus;
    const matchQual = filterQual === 'all' || (filterQual === 'yes' ? eq.needQualification : !eq.needQualification);
    return matchSearch && matchField && matchStatus && matchQual;
  });

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">统一资源大厅</h1>
          <p className="text-sm text-slate-500">全校科研设备检索与预约入口</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={filterQual} onChange={e => setFilterQual(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 text-slate-600 shadow-sm">
            <option value="all">资质要求 (全部)</option>
            <option value="yes">需资质白名单 (强管控)</option>
            <option value="no">免资质 (常规开放)</option>
          </select>
          <select value={filterField} onChange={e => setFilterField(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 text-slate-600 shadow-sm">
            <option value="all">学科领域 (全部)</option>
            <option value="材料科学">材料科学</option>
            <option value="精细化工">精细化工</option>
            <option value="智能制造">智能制造</option>
            <option value="生物医药">生物医药</option>
            <option value="低碳冶金">低碳冶金</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 text-slate-600 shadow-sm">
            <option value="all">设备状态 (全部)</option>
            <option value="idle">空闲中</option>
            <option value="occupied">占用中</option>
            <option value="maintenance">维修中</option>
          </select>
        </div>
      </div>

      {filteredEquips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <Database size={48} className="mb-4 opacity-30" />
           <p>没有找到符合条件的设备</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquips.map(equip => (
            <div 
              key={equip.id} 
              onClick={() => onNavigate('detail', equip)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="h-44 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                <Database size={48} className="text-blue-100 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-100 shadow-sm z-20">
                  {equip.status === 'idle' && <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-emerald"></span>}
                  {equip.status === 'occupied' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                  {equip.status === 'maintenance' && <span className="w-2 h-2 rounded-full bg-slate-400"></span>}
                  <span className="text-xs font-medium text-slate-700">
                    {equip.status === 'idle' ? '空闲' : equip.status === 'occupied' ? '占用中' : '维修中'}
                  </span>
                </div>
                {equip.needQualification && (
                   <div className="absolute top-3 left-3 bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-20">
                     需资质
                   </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col bg-white relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{equip.type}</div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 leading-snug group-hover:text-blue-700 transition-colors">{equip.name}</h3>
                <p className="text-xs text-slate-400 mb-4 font-mono">{equip.code}</p>
                
                <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-50">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="text-slate-400 mr-2 flex-shrink-0"><ShieldAlert size={14}/></span>
                    <span className="truncate">{equip.field}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="text-slate-400 mr-2 flex-shrink-0"><Database size={14}/></span>
                    <span className="truncate">{equip.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
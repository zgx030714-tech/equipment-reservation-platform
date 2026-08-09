import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, Database, Plus, Trash2, XCircle } from 'lucide-react';

export default function PersonalizedDashboard({ user, equipments, setEquipments, onNavigate, showToast }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 

  const [approvals, setApprovals] = useState([
    { id: 1, type: '资质审核', tagColor: 'text-blue-600 bg-blue-50 border-blue-100', time: '10分钟前', text: '李四 申请了 [X射线衍射仪] 操作白名单' },
    { id: 2, type: '大仪预约', tagColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', time: '1小时前', text: '王五 申请 [高分辨电镜] (8小时)' }
  ]);

  const handleApprovalAction = (id, action) => {
    setApprovals(approvals.filter(a => a.id !== id));
    showToast(`已成功${action === 'pass' ? '通过' : '驳回'}该申请`, action === 'pass' ? 'success' : 'info');
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEquipments(equipments.filter(eq => eq.id !== deleteTarget));
      setDeleteTarget(null);
      showToast('设备已下架并移除', 'success');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">工作台</h1>
          <p className="text-sm text-slate-500">
            {user.role === 'student' ? '你好，张同学。今天也要顺利完成实验哦。' : '王老师，这是您负责的实验室运行概览与资产管理。'}
          </p>
        </div>
      </div>

      {user.role === 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Widget title="我的本周排期" icon={<Calendar className="text-blue-600" size={18} />}>
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-blue-500">
                  <div className="w-20 text-center border-r border-slate-100 pr-4">
                    <p className="text-xs font-semibold text-blue-600 mb-1">今天</p>
                    <p className="text-xl font-bold text-slate-800">14:00</p>
                  </div>
                  <div className="pl-5 flex-1">
                    <h4 className="font-bold text-slate-800 text-base mb-1">高分辨透射电子显微镜</h4>
                    <p className="text-xs text-slate-500 font-mono">材料楼 101 | RES-2026-802</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-sm font-bold rounded-lg">扫码上机</button>
                </div>
              </div>
            </Widget>
            <Widget title="近期常用设备" icon={<Clock className="text-emerald-500" size={18} />}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipments.slice(0,2).map(eq => (
                    <div key={eq.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group bg-white" onClick={() => onNavigate('detail', eq)}>
                      <h4 className="font-bold text-sm text-slate-800 truncate mb-1 group-hover:text-blue-600">{eq.name}</h4>
                      <p className="text-xs text-slate-400">{eq.location}</p>
                    </div>
                  ))}
               </div>
            </Widget>
          </div>
          <div className="space-y-6">
            <Widget title="诚信与违规预警" icon={<AlertCircle className="text-amber-500" size={18} />}>
               <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-bold text-amber-900">当前诚信积分</span>
                   <span className="text-3xl font-black text-amber-600">95</span>
                 </div>
                 <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden mb-4">
                   <div className="bg-amber-500 h-full w-[95%] rounded-full"></div>
                 </div>
                 <ul className="text-xs text-amber-700/80 space-y-2 mt-5 pt-4 border-t border-amber-200/50">
                   <li className="flex items-start"><span className="mr-1.5">•</span> <span>上周四有一次【临近2小时取消预约】，扣除 5 分。</span></li>
                   <li className="flex items-start"><span className="mr-1.5">•</span> <span>积分低于 60 分将自动移入黑名单。</span></li>
                 </ul>
               </div>
            </Widget>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Widget title="待办审批池" icon={<CheckCircle2 className="text-blue-600" size={18} />}>
              <div className="space-y-4">
                {approvals.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 border border-slate-100 rounded-xl border-dashed">
                    当前暂无待办任务
                  </div>
                ) : (
                  approvals.map(app => (
                    <div key={app.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-white animate-fade-in flex flex-col">
                      <div className="flex justify-between mb-3 items-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${app.tagColor}`}>{app.type}</span>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{app.time}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 leading-snug break-words mb-4">{app.text}</p>
                      
                      <div className="flex space-x-2 mt-auto">
                        <button onClick={() => handleApprovalAction(app.id, 'pass')} className="flex-1 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">通过</button>
                        <button onClick={() => handleApprovalAction(app.id, 'reject')} className="flex-1 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors">驳回</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Widget>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Widget 
               title="名下设备实时矩阵与管理" 
               icon={<Database className="text-blue-600" size={18} />}
               extra={
                 <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors font-bold border border-blue-100">
                   <Plus size={14} /> <span>录入新设备</span>
                 </button>
               }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {equipments.map(eq => (
                   <div key={eq.id} className="relative p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col hover:border-blue-300 transition-colors group animate-fade-in h-full">
                     <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(eq.id); }} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10 bg-white p-1 rounded-md shadow-sm border border-slate-100" title="下架设备">
                       <Trash2 size={16} />
                     </button>
                     
                     <div className="flex justify-between items-start mb-3">
                       <Database size={24} className="text-slate-300" />
                     </div>
                     <h4 className="font-bold text-sm text-slate-800 pr-8 leading-snug break-words" title={eq.name}>{eq.name}</h4>
                     <p className="text-xs text-slate-400 mt-1 mb-3">{eq.location}</p>
                     
                     <div className="mt-auto flex items-center justify-between">
                        <div className="flex space-x-1 items-center text-xs text-slate-500">
                           {eq.status === 'idle' && <><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-emerald"></span> 空闲</>}
                           {eq.status === 'occupied' && <><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> 占用</>}
                           {eq.status === 'maintenance' && <><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> 维保</>}
                        </div>
                        {eq.status === 'occupied' && (
                          <button onClick={() => showToast('已发送强制下机指令', 'info')} className="px-2 py-1 border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white text-[10px] rounded font-bold transition-colors">
                            强制下机
                          </button>
                        )}
                     </div>
                   </div>
                 ))}
              </div>
            </Widget>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">确认下架设备</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 pl-13">此操作将把该设备移出资源大厅，普通用户将无法再搜索和预约。是否继续？</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">取消</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors shadow-red-200">确认下架</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddEquipmentModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={(newEq) => { 
            setEquipments([{...newEq, id: Date.now(), status: 'idle'}, ...equipments]); 
            setIsAddModalOpen(false); 
            showToast('新设备已录入系统大厅', 'success');
          }} 
        />
      )}
    </div>
  );
}

const AddEquipmentModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', code: '', location: '', type: '大型精密仪器', field: '低碳冶金', needQualification: true, price: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <h2 className="font-bold text-lg text-slate-800">录入新设备基本档案</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1"><XCircle size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="add-equip-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">1. 基础静态档案 (biz_equipment)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">设备名称 *</label>
                  <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" placeholder="如：核磁共振波谱仪" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">资产编号 *</label>
                  <input required type="text" value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" placeholder="如：EQ-2026-XXX" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">设备类型</label>
                  <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500">
                    <option>大型精密仪器</option><option>常规实验设备</option><option>实验场地/工位</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">所属技术领域</label>
                  <select value={formData.field} onChange={e=>setFormData({...formData, field: e.target.value})} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500">
                    <option>低碳冶金</option><option>材料科学</option><option>精细化工</option><option>智能制造</option><option>生物医药</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-slate-100 w-full my-4"></div>
            
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">2. 管控与计费配置</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">存放位置 (Location)</label>
                  <input required type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" placeholder="如：生科楼 101" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">计费单价 (元/小时)</label>
                  <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" placeholder="请输入数字" />
                </div>
                <div className="col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-lg mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">开启强管控机制 (需资质白名单准入)</p>
                    <p className="text-xs text-slate-500 mt-0.5">针对高价值设备，开启后用户须通过考核方可预约。</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.needQualification} onChange={e=>setFormData({...formData, needQualification: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-md transition-colors">取消</button>
          <button type="submit" form="add-equip-form" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">确认入库并生成档案</button>
        </div>
      </div>
    </div>
  );
};

const Widget = ({ title, icon, extra, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col h-full">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl gap-2 flex-wrap">
      <div className="flex items-center space-x-2">
         {icon}
         <h3 className="font-bold text-slate-800 text-base">{title}</h3>
      </div>
      {extra && <div>{extra}</div>}
    </div>
    <div className="p-6 flex-1 overflow-visible">
      {children}
    </div>
  </div>
);
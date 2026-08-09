import React, { useState } from 'react';
import { ChevronRight, ShieldAlert, CheckCircle2, XCircle, Calendar, CalendarDays, MousePointerClick, Upload, FileText } from 'lucide-react';

const getSafeDateStr = (date) => {
  if (isNaN(date.getTime())) date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const getTodayStr = () => getSafeDateStr(new Date());

export default function EquipmentDetail({ equip, onBack, showToast }) {
  if (!equip) return null;

  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState([]);
  const [conflict, setConflict] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [baseDate, setBaseDate] = useState(getTodayStr()); 

  const generateDays = (startDateStr) => {
    const daysArr = [];
    let base = new Date();
    
    if (startDateStr) {
      const parts = startDateStr.split('-');
      if (parts.length === 3) {
        base = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    
    if (isNaN(base.getTime())) base = new Date();
    
    const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for(let i=0; i<5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = getSafeDateStr(d);
      daysArr.push({
        id: dateStr,
        label: `${d.getMonth()+1}月${d.getDate()}日 (${weekMap[d.getDay()]})`,
        dateStr: dateStr
      });
    }
    return daysArr;
  };
  
  const days = generateDays(baseDate);
  const hours = Array.from({length: 12}, (_, i) => `${i+8}:00`); 
  
  const getSlotId = (dayStr, hourIdx) => `${dayStr}_${hourIdx}`;
  const parseSlotId = (id) => {
    const parts = id.split('_');
    return { dayStr: parts[0], hour: parseInt(parts[1], 10) };
  };

  const occupiedSlots = [
    getSlotId(days[0].id, 2), getSlotId(days[0].id, 3),
    getSlotId(days[1].id, 5), getSlotId(days[1].id, 6),
    getSlotId(days[3].id, 1), getSlotId(days[3].id, 2),
    getSlotId(days[4].id, 8)
  ];

  const handleMouseDown = (id) => {
    if (drawerOpen || equip.status === 'maintenance') return;
    setIsDragging(true);
    setSelection([id]);
    checkConflict([id]);
  };

  const handleMouseEnter = (id) => {
    if (!isDragging || drawerOpen || equip.status === 'maintenance') return;
    if (!selection || selection.length === 0) return; 
    
    const startObj = parseSlotId(selection[0]);
    const currObj = parseSlotId(id);
    if (startObj.dayStr !== currObj.dayStr) return; 
    
    const minHour = Math.min(startObj.hour, currObj.hour);
    const maxHour = Math.max(startObj.hour, currObj.hour);
    
    const newSelection = [];
    for(let h = minHour; h <= maxHour; h++){
      newSelection.push(`${startObj.dayStr}_${h}`);
    }
    setSelection(newSelection);
    checkConflict(newSelection);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!conflict && selection.length > 0) {
      setDrawerOpen(true);
    } else if (conflict) {
      setTimeout(() => setSelection([]), 1000);
    }
  };

  const checkConflict = (currentSelection) => {
    const hasConflict = currentSelection.some(id => occupiedSlots.includes(id));
    setConflict(hasConflict);
  };

  const handleSubmitOrder = () => {
    showToast('提交成功！系统已为您保留该时段', 'success');
    setDrawerOpen(false);
    setSelection([]);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-app-layout relative overflow-hidden">
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 shadow-sm z-10 flex-shrink-0">
        <button onClick={onBack} className="text-slate-500 hover:text-blue-600 flex items-center text-sm font-medium transition-colors">
          <ChevronRight className="rotate-180 mr-1" size={16} /> 返回大厅
        </button>
        <div className="mx-4 w-px h-4 bg-slate-200 hidden sm:block"></div>
        <span className="font-bold text-slate-800 hidden sm:inline-block truncate max-w-[200px] lg:max-w-none">{equip.name}</span>
        {equip.status === 'maintenance' && (
           <span className="ml-auto sm:ml-4 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs rounded-full font-bold">设备维修中，暂停预约</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="flex flex-col lg:flex-row p-4 lg:p-6 max-w-7xl mx-auto w-full gap-6 lg:min-h-full">
          <div className="w-full lg:w-1/3 flex flex-col space-y-6 flex-shrink-0">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">设备参数与规则</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">管控级别</span>
                  {equip.needQualification ? 
                    <span className="text-amber-600 text-sm font-medium flex items-center bg-amber-50 px-2 py-0.5 rounded border border-amber-100"><ShieldAlert size={14} className="mr-1"/> 强管控 (需资质)</span>
                    :
                    <span className="text-emerald-600 text-sm font-medium flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><CheckCircle2 size={14} className="mr-1"/> 免资质开放</span>
                  }
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">计费标准</span>
                  <span className="text-blue-600 text-sm font-bold bg-blue-50 px-2 py-0.5 rounded">¥ {equip.price}.00 / 小时</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">所属领域</span>
                  <span className="text-slate-800 text-sm font-medium">{equip.field}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                 <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors">
                   <FileText size={16} className="text-slate-400" /> <span>预览操作手册 PDF</span>
                 </button>
              </div>
            </div>
            
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
               <div className="flex items-start space-x-3">
                 <MousePointerClick className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                 <div>
                   <h4 className="text-sm font-bold text-blue-900 mb-1">排期交互指南</h4>
                   <p className="text-xs text-blue-800/80 leading-relaxed">
                     在右侧顶端 <strong>选择目标日期</strong>，随后在下方甘特图中 <strong>点击并拖拽框选</strong> 绿色的空闲区域。松手即可确认订单。
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] lg:min-h-0" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                 <h2 className="font-bold text-slate-800 mr-2 hidden sm:block">排期面板</h2>
                 <div className="relative flex items-center bg-white border border-slate-200 rounded-md shadow-sm px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                   <CalendarDays size={16} className="text-slate-400 mr-2" />
                   <input 
                     type="date" 
                     value={baseDate} 
                     onChange={(e) => {
                       setBaseDate(e.target.value || getTodayStr()); 
                       setSelection([]);
                     }}
                     className="text-sm text-slate-700 outline-none bg-transparent cursor-pointer"
                   />
                 </div>
              </div>
              <div className="flex space-x-4 text-xs font-medium">
                <span className="flex items-center"><span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200 mr-1.5"></span> 可约</span>
                <span className="flex items-center"><span className="w-3 h-3 rounded bg-red-50 border border-red-200 mr-1.5"></span> 占用</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 lg:p-6 bg-white">
               <div className="min-w-[800px]">
                 <div className="flex mb-3">
                   <div className="w-24"></div>
                   {hours.map(h => (
                     <div key={h} className="flex-1 text-center text-xs font-semibold text-slate-400">{h}</div>
                   ))}
                 </div>
                 
                 <div className="space-y-3">
                   {days.map((day) => (
                     <div key={day.id} className="flex items-center h-14">
                       <div className="w-24 text-sm font-medium text-slate-700 flex flex-col">
                         <span>{day.label.split(' ')[0]}</span>
                         <span className="text-xs text-slate-400 font-normal">{day.label.split(' ')[1]}</span>
                       </div>
                       <div className="flex-1 flex gap-1 h-full">
                         {hours.map((_, hIdx) => {
                           const id = getSlotId(day.id, hIdx);
                           const isOccupied = occupiedSlots.includes(id);
                           const isSelected = selection.includes(id);
                           const isMaintenance = equip.status === 'maintenance';
                           
                           let bgClass = "bg-emerald-50/70 border-emerald-200/50 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer";
                           if (isMaintenance) bgClass = "bg-slate-100 border-slate-200 cursor-not-allowed";
                           else if (isOccupied) bgClass = "bg-red-50/70 border-red-200/50 cursor-not-allowed";
                           
                           if (isSelected && !isMaintenance) {
                             if (conflict) {
                               bgClass = "bg-red-500 border-red-600 animate-shake shadow-inner text-white";
                             } else {
                               bgClass = "bg-blue-500 border-blue-600 shadow-md text-white scale-[1.02] transition-transform z-10";
                             }
                           }
  
                           return (
                             <div 
                               key={id}
                               onMouseDown={() => handleMouseDown(id)}
                               onMouseEnter={() => handleMouseEnter(id)}
                               className={`flex-1 rounded border transition-all duration-150 relative flex items-center justify-center ${bgClass}`}
                             >
                               {isSelected && conflict && <XCircle size={14} className="text-white/80 absolute" />}
                               {isSelected && !conflict && <CheckCircle2 size={14} className="text-white/80 absolute" />}
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {drawerOpen && <div className="absolute inset-0 bg-slate-900/20 z-20 transition-opacity" onClick={() => {setDrawerOpen(false); setSelection([]);}}></div>}
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-slate-200 transform transition-transform duration-300 ease-out z-30 flex flex-col ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
            <h2 className="font-bold text-lg text-slate-800">确认预约订单</h2>
            <button onClick={() => {setDrawerOpen(false); setSelection([]);}} className="p-1 hover:bg-slate-200 rounded-md text-slate-500 transition-colors">
              <XCircle size={20} />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-white">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">拟预约设备</p>
              <p className="font-bold text-slate-800 text-lg">{equip.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">已选时间段 ({selection.length} 小时)</p>
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 flex items-center"><Calendar size={16} className="mr-2"/> 连续占用 {selection.length} 个时段</p>
              </div>
            </div>
            
            {equip.needQualification && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">资质证明材料 <span className="text-red-500">*</span></p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer text-slate-500 group">
                   <Upload size={24} className="mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                   <p className="text-xs text-center font-medium group-hover:text-blue-600 transition-colors">点击或拖拽上传考核/培训证明</p>
                   <p className="text-[10px] text-slate-400 mt-1">支持 PDF/JPG/PNG，大小不超过 5MB</p>
                </div>
              </div>
            )}
            
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">测试样品信息 <span className="text-red-500">*</span></p>
              <input type="text" placeholder="请输入实验样品名称" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all mb-3" />
              <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span>包含有毒、有害或易燃易爆属性</span>
              </label>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50">
             <div className="flex justify-between items-end mb-4">
               <span className="text-sm font-medium text-slate-600">虚拟预扣费 ({equip.price}/时)</span>
               <span className="text-3xl font-bold text-blue-600">¥ {selection.length * equip.price}.00</span>
             </div>
             <button onClick={handleSubmitOrder} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-200 transition-colors flex items-center justify-center space-x-2">
               <CheckCircle2 size={18} /> <span>确认提交订单</span>
             </button>
          </div>
      </div>
    </div>
  );
}
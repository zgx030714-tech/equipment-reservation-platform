import React, { useState } from 'react';
import { Search, Bell, LayoutDashboard, Database, BarChart3, CheckCircle2, XCircle, Info, LogOut } from 'lucide-react';

import { useEffect } from 'react';
import { getEquipmentsPage } from './api/index';

import LoginScreen from './pages/login/Login';
import ResourcePortal from './pages/portal/Portal';
import EquipmentDetail from './pages/equipment/EquipmentDetail';
import PersonalizedDashboard from './pages/admin/Dashboard';
import DataDashboard from './pages/admin/DataCenter';


const globalStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
  .animate-shake {
    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes toast-slide-in {
    0% { opacity: 0; transform: translate(-50%, -20px); }
    100% { opacity: 1; transform: translate(-50%, 0); }
  }
  .animate-toast {
    animation: toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in-up 0.3s ease-out forwards;
  }
  .pulse-emerald {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    animation: pulse-em 2s infinite;
  }
  @keyframes pulse-em {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .bg-app-layout { background-color: #f0f2f5; }
`;

// const INITIAL_EQUIPMENTS = [
//   { id: 1, name: '高分辨透射电子显微镜', code: 'EQ-2026-001', location: '材料楼 101', status: 'idle', type: '大型精密仪器', field: '材料科学', needQualification: true, price: 200 },
//   { id: 2, name: '场发射扫描电子显微镜', code: 'EQ-2026-002', location: '材料楼 102', status: 'occupied', type: '大型精密仪器', field: '智能制造', needQualification: true, price: 150 },
//   { id: 3, name: 'X射线衍射仪 (XRD)', code: 'EQ-2026-003', location: '化工楼 205', status: 'maintenance', type: '常规设备', field: '精细化工', needQualification: false, price: 50 },
//   { id: 4, name: '核磁共振波谱仪', code: 'EQ-2026-004', location: '生科楼 108', status: 'idle', type: '大型精密仪器', field: '生物医药', needQualification: true, price: 300 },
//   { id: 5, name: '高效液相色谱仪', code: 'EQ-2026-005', location: '化工楼 301', status: 'idle', type: '常规设备', field: '精细化工', needQualification: false, price: 80 },
//   { id: 6, name: '高温管式真空炉', code: 'EQ-2026-006', location: '冶金楼 112', status: 'occupied', type: '常规设备', field: '低碳冶金', needQualification: false, price: 40 },
// ];

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
      active 
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-[inset_3px_0_0_0_#2563eb]' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {React.cloneElement(icon, { size: 20 })}
    <span>{label}</span>
  </button>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('portal');
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 初始状态置为空数组
  const [equipments, setEquipments] = useState([]);

  // 组件首次挂载时，去 Java 后端拉取真实数据
  useEffect(() => {
    // 只有当用户已登录，且处于大厅或工作台时才去拉取
    if (user && (currentPage === 'portal' || currentPage === 'dashboard')) {
      fetchRealEquipments();
    }
  }, [user, currentPage]);

  const fetchRealEquipments = async () => {
    try {
      // 模拟传递分页参数（您可以根据 DTO 的实际结构调整）
      const pageData = await getEquipmentsPage({ current: 1, size: 50 });
      
      // 假设您的后端 MyBatis-Plus 返回的对象包含 records 数组
      if (pageData && pageData.records) {
        // 由于前后端字段命名差异，在映射前做一个简单的适配转换
        const mappedData = pageData.records.map(item => ({
          id: item.id,
          name: item.equipName,       // 对应后端 equip_name 
          code: item.assetCode,       // 对应后端 asset_code
          location: '材料楼 101',      // 暂时写死，因为表中没有放置地点字段
          status: item.status === 1 ? 'idle' : item.status === 2 ? 'occupied' : 'maintenance',
          type: item.equipType === 1 ? '大型精密仪器' : '常规设备', 
          field: item.techField,      // 对应后端 tech_field
          needQualification: item.qualCtrlType === 1, // 1代表强管控
          price: 200 // 暂时写死，后续可以扩展计费表
        }));
        setEquipments(mappedData);
      }
    } catch (error) {
      showToast('设备拉取失败: ' + error.message, 'error');
    }
  };

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const navigateTo = (page, equip = null) => {
    setSelectedEquip(equip);
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('portal');
  };

  if (!user) {
    return (
      <>
        <style>{globalStyles}</style>
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-app-layout text-slate-800 font-sans overflow-hidden">
      <style>{globalStyles}</style>
      
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-5 py-3 rounded-lg shadow-xl text-white font-medium animate-toast ${
          toast.type === 'success' ? 'bg-emerald-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <XCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-20 shadow-sm flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md relative">
            <Database size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">科研设备平台</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon={<Database />} label="资源大厅" active={currentPage === 'portal'} onClick={() => navigateTo('portal')} />
          <NavItem icon={<LayoutDashboard />} label="我的工作台" active={currentPage === 'dashboard'} onClick={() => navigateTo('dashboard')} />
          {user.role === 'admin' && (
            <NavItem icon={<BarChart3 />} label="数据驾驶舱" active={currentPage === 'data'} onClick={() => navigateTo('data')} />
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-400 font-mono">{user.id}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="退出登录">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex-1 flex items-center">
            {currentPage === 'portal' && (
              <div className="relative w-96 hidden lg:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索设备名称、编号、放置地点..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-app-layout">
          {currentPage === 'portal' && <ResourcePortal equipments={equipments} searchQuery={searchQuery} onNavigate={navigateTo} />}
          {currentPage === 'detail' && <EquipmentDetail equip={selectedEquip} onBack={() => navigateTo('portal')} showToast={showToast} />}
          {currentPage === 'dashboard' && <PersonalizedDashboard user={user} equipments={equipments} setEquipments={setEquipments} onNavigate={navigateTo} showToast={showToast} />}
          {currentPage === 'data' && <DataDashboard />}
        </main>
      </div>
    </div>
  );
}
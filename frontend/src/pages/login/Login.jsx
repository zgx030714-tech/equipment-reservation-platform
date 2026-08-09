import React from 'react';
import { Database } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  return (
    <div className="flex h-screen items-center justify-center bg-app-layout bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-[420px] bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 relative">
          <Database size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">科研设备预约平台</h1>
        <p className="text-sm text-slate-500 mb-8">辽宁科技大学统一认证中心</p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={() => onLogin({ role: 'student', name: '张同学', id: '20230001' })} 
            className="w-full py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-bold transition-colors border border-blue-100"
          >
            师生/校外用户 登录
          </button>
          <button 
            onClick={() => onLogin({ role: 'admin', name: '王老师 (系统管理员)', id: '19980012' })} 
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-md shadow-blue-200"
          >
            管理员 登录
          </button>
        </div>
      </div>
    </div>
  );
}
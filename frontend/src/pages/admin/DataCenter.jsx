import React from 'react';
import { Download } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ECHARTS_MOCK_DATA = {
  usage: [{name: '周一', rate: 65}, {name: '周二', rate: 78}, {name: '周三', rate: 82}, {name: '周四', rate: 91}, {name: '周五', rate: 85}, {name: '周六', rate: 45}, {name: '周日', rate: 30}],
  faults: [{name: '离心机', count: 12}, {name: '色谱仪', count: 8}, {name: '光谱仪', count: 5}, {name: '电镜', count: 3}],
  distribution: [{name: '材料学院', value: 400}, {name: '化工学院', value: 300}, {name: '机械学院', value: 200}, {name: '冶金学院', value: 150}]
};

export default function DataDashboard() {
  return (
    <div className="min-h-full bg-app-layout p-6 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">全局维保与共享效益数据舱</h1>
            <p className="text-sm text-slate-500">实时监控全校 500+ 台科研设备运行状态</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-md text-sm font-bold shadow-sm flex items-center space-x-2 transition-colors">
              <Download size={16} /> <span>导出效益报表</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="设备总资产 (万元)" value="12,504.00" trend="+2.4%" color="text-blue-600" />
          <StatCard title="今日开机数" value="342" subtext="/ 510 总数" color="text-emerald-600" />
          <StatCard title="维保预警数" value="18" alert color="text-red-500" />
          <StatCard title="本月共享创收 (元)" value="45,200.00" trend="+15%" color="text-amber-600" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-blue-600 before:mr-2 before:rounded-sm">近七日开机率趋势</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ECHARTS_MOCK_DATA.usage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2, stroke: '#2563eb'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-red-500 before:mr-2 before:rounded-sm">故障频发 TOP 排行</h3>
            <div className="flex-1 flex flex-col justify-center space-y-5">
               {ECHARTS_MOCK_DATA.faults.map((f, i) => (
                 <div key={f.name} className="flex items-center group cursor-pointer">
                   <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 ${i < 3 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                     {i+1}
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between text-sm mb-1.5">
                       <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">{f.name}</span>
                       <span className="text-slate-500 font-mono text-xs">{f.count} 次</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-red-400 to-amber-400 h-full rounded-full" style={{width: `${(f.count/15)*100}%`}}></div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center before:content-[''] before:w-1 before:h-4 before:bg-emerald-500 before:mr-2 before:rounded-sm">各院系设备价值分布</h3>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={ECHARTS_MOCK_DATA.distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {ECHARTS_MOCK_DATA.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 grid grid-cols-2 gap-4 pl-4">
                 {ECHARTS_MOCK_DATA.distribution.map((d, idx) => (
                   <div key={d.name} className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                     <div className="w-3 h-3 rounded-full" style={{backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'][idx % 4]}}></div>
                     <div>
                       <p className="text-xs text-slate-500 mb-0.5">{d.name}</p>
                       <p className="text-xl font-black text-slate-800">{d.value} <span className="text-xs font-normal text-slate-400">万</span></p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, subtext, trend, alert, color }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:border-blue-300 transition-colors">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
    <h4 className="text-sm font-bold text-slate-500 mb-3 relative z-10">{title}</h4>
    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 relative z-10">
      <span className={`text-2xl xl:text-3xl font-black ${color}`}>{value}</span>
      {subtext && <span className="text-sm font-medium text-slate-400">{subtext}</span>}
      {trend && <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{trend}</span>}
      {alert && <span className="absolute right-0 top-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>}
    </div>
  </div>
);
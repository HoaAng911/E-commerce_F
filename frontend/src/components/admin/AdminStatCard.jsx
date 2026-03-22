import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminStatCard = ({ title, value, icon, trend, trendValue, color }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="p-6 bg-white border border-admin-border rounded-2xl shadow-admin-sm hover:shadow-admin-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${color || 'bg-admin-primary-light'} text-admin-primary group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        {trendValue && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trendValue}%
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-2xl font-black text-admin-text tracking-tight mb-1">{value}</h4>
        <p className="text-xs font-bold text-admin-subtext uppercase tracking-widest leading-none mt-1">
          {title}
        </p>
      </div>

      {/* Mini Trend Line (Decorative SVG) */}
      <div className="mt-4 pt-4 border-t border-admin-border/50">
         <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path 
              d={isPositive ? "M0 25 L20 18 L40 22 L60 10 L80 15 L100 5" : "M0 5 L20 15 L40 10 L60 22 L80 18 L100 25"}
              fill="none" 
              stroke={isPositive ? "#10b981" : "#ef4444"} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              className="opacity-40"
            />
         </svg>
      </div>
    </div>
  );
};

export default AdminStatCard;

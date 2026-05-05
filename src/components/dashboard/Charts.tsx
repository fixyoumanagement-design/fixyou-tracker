import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Project } from '../../types';
import { formatRupiah } from '../../lib/utils';

interface ChartsProps {
  projects: Project[];
}

export const Charts: React.FC<ChartsProps> = ({ projects }) => {
  // Aggregate data by month
  const monthlyData = projects.reduce((acc: any, curr) => {
    const date = new Date(curr.runningDate);
    const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    if (!acc[month]) {
      acc[month] = { month, revenue: 0, profit: 0, count: 0 };
    }
    
    acc[month].revenue += curr.revenue;
    acc[month].profit += curr.profit;
    acc[month].count += 1;
    
    return acc;
  }, {});

  const data = Object.values(monthlyData).sort((a: any, b: any) => {
    // Simple sort for display, could be more robust
    return 1; 
  });

  return (
    <div className="bg-white border-2 border-[#141414] p-6 shadow-[4px_4px_0px_0px_#141414] mb-8">
      <h3 className="text-lg font-black uppercase mb-6 flex items-center justify-between">
        Monthly Performance
        <span className="font-mono text-[10px] text-gray-400 font-normal">Revenue vs Net Profit</span>
      </h3>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => `Rp${value / 1000000}M`}
            />
            <Tooltip 
              cursor={{ fill: '#F5F5F3' }}
              contentStyle={{ 
                borderRadius: '0px', 
                border: '2px solid #141414',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '12px'
              }}
              formatter={(value: number) => [formatRupiah(value), '']}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace' }} 
            />
            <Bar dataKey="revenue" name="Gross Revenue" fill="#141414" radius={[2, 2, 0, 0]} />
            <Bar dataKey="profit" name="Net Profit" fill="#10B981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

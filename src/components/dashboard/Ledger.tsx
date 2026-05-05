import React from 'react';
import { Project } from '../../types';
import { formatRupiah } from '../../lib/utils';
import { Download } from 'lucide-react';
import { exportProjectsToExcel } from '../../lib/export';

interface LedgerProps {
  projects: Project[];
}

export const Ledger: React.FC<LedgerProps> = ({ projects }) => {
  const monthlyData = projects.reduce((acc: any, curr) => {
    const date = new Date(curr.runningDate);
    const month = date.toLocaleString('default', { month: 'Long', year: 'numeric' });
    
    if (!acc[month]) {
      acc[month] = { month, revenue: 0, payout: 0, profit: 0, count: 0 };
    }
    
    acc[month].revenue += curr.revenue;
    acc[month].payout += curr.payout;
    acc[month].profit += curr.profit;
    acc[month].count += 1;
    
    return acc;
  }, {});

  const data = Object.values(monthlyData).sort((a: any, b: any) => 1);

  return (
    <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] overflow-hidden">
      <div className="bg-[#141414] p-4 text-white flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-widest">Monthly Financial Ledger</h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => exportProjectsToExcel(projects)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-colors"
          >
            <Download size={12} />
            Export data
          </button>
          <span className="font-mono text-[10px] opacity-70 uppercase border-l border-white/20 pl-4">Unit: IDR (Rupiah)</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-[#141414] bg-[#F5F5F3]">
              <th className="p-4 font-black uppercase">Month</th>
              <th className="p-4 font-black uppercase text-center">Jobs</th>
              <th className="p-4 font-black uppercase">Gross Revenue</th>
              <th className="p-4 font-black uppercase">Payout</th>
              <th className="p-4 font-black uppercase">Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i) => (
              <tr key={row.month} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-bold">{row.month}</td>
                <td className="p-4 text-center">{row.count}</td>
                <td className="p-4">{formatRupiah(row.revenue)}</td>
                <td className="p-4 text-amber-600 font-bold">{formatRupiah(row.payout)}</td>
                <td className="p-4 text-emerald-600 font-bold">{formatRupiah(row.profit)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400 italic uppercase">
                  No data available for ledger tracking
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

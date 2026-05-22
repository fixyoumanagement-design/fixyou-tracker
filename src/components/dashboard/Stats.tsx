import React from 'react';
import { Project } from '../../types';
import { formatRupiah } from '../../lib/utils';
import { TrendingUp, Wallet, DollarSign, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsProps {
  projects: Project[];
}

export const Stats: React.FC<StatsProps> = ({ projects }) => {
  const totalRevenue = projects.reduce((acc, p) => acc + p.revenue, 0);
  const totalPayout = projects.reduce((acc, p) => acc + p.payout, 0);
  const totalTalangan = projects.reduce((acc, p) => acc + (p.talangan || 0), 0);
  const netProfit = totalRevenue - totalPayout - totalTalangan;
  const activeJobs = projects.filter(p => ['BOOKING', 'FIXED/RUNNING'].includes(p.status)).length;

  const cards = [
    { label: 'Total Revenue (Gross)', value: formatRupiah(totalRevenue), icon: TrendingUp, color: 'bg-[#141414]' },
    { label: 'Total Payout', value: formatRupiah(totalPayout), icon: Wallet, color: 'bg-amber-500' },
    { label: 'Total Talangan', value: formatRupiah(totalTalangan), icon: Wallet, color: 'bg-red-500' },
    { label: 'Net Profit', value: formatRupiah(netProfit), icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Active Jobs', value: activeJobs.toString(), icon: Briefcase, color: 'bg-blue-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border-2 border-[#141414] p-4 sm:p-5 lg:p-3.5 xl:p-5 shadow-[4px_4px_0px_0px_#141414]"
        >
          <div className="flex justify-between items-start mb-3">
            <div className={card.color + " p-1.5 text-white"}>
              <card.icon size={16} />
            </div>
            <span className="font-mono text-[9px] uppercase text-gray-400 font-bold tracking-widest">
              Live Data
            </span>
          </div>
          <p className="text-gray-500 text-[9px] uppercase font-bold tracking-tight mb-1 truncate">
            {card.label}
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-sm xl:text-lg 2xl:text-xl font-black font-mono tracking-tighter truncate" title={card.value}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

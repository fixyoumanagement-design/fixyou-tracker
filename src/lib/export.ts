import * as XLSX from 'xlsx';
import { Project } from '../types';

export function exportProjectsToExcel(projects: Project[]) {
  const data = projects.map(p => ({
    'Project Name': p.name,
    'Client': p.client,
    'Brand': p.brand,
    'Running Date': new Date(p.runningDate).toLocaleDateString('id-ID'),
    'Category': p.category,
    'Status': p.status,
    'Gross Revenue (IDR)': p.revenue,
    'Payout (IDR)': p.payout,
    'Net Profit (IDR)': p.profit,
    'Created At': new Date(p.createdAt).toLocaleString('id-ID'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');

  // Generate buffer and download
  XLSX.writeFile(workbook, `Fixyou_Projects_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
}

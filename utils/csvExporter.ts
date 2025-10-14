
import type { TableData } from '../types';

const escapeCsvCell = (cell: string): string => {
  // If the cell contains a comma, double quote, or newline, wrap it in double quotes
  // and escape any existing double quotes by doubling them.
  if (/[",\n]/.test(cell)) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
};

export const exportToCsv = (data: TableData, filename: string = 'snapsheet-export.csv'): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export.');
    return;
  }

  const csvContent = data
    .map(row => row.map(escapeCsvCell).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  URL.revokeObjectURL(url);
};

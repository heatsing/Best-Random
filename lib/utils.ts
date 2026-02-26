import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadCSV(data: string[], filename: string = 'data.csv'): void {
  const csv = data.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getHistoryKey(generatorName: string): string {
  return `bestrandom_history_${generatorName}`;
}

export function saveToHistory(generatorName: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  const key = getHistoryKey(generatorName);
  const history = getHistory(generatorName);
  history.unshift({ data, timestamp: Date.now() });
  
  // Keep only last 20
  const limited = history.slice(0, 20);
  localStorage.setItem(key, JSON.stringify(limited));
}

export function getHistory(generatorName: string): any[] {
  if (typeof window === 'undefined') return [];
  
  const key = getHistoryKey(generatorName);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function clearHistory(generatorName: string): void {
  if (typeof window === 'undefined') return;
  
  const key = getHistoryKey(generatorName);
  localStorage.removeItem(key);
}

import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading catalog data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
  );
};

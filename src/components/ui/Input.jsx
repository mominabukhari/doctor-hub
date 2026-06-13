import React, { forwardRef } from 'react';
import { cn } from './GlassCard';

export const Input = forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 ml-1 mt-1">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

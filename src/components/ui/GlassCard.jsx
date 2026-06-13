import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const GlassCard = ({ children, className, ...props }) => {
  return (
    <motion.div
      className={cn(
        'bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

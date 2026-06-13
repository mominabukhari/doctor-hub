import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './GlassCard';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-emerald-400',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 rounded-xl',
    lg: 'px-8 py-3 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        'relative flex items-center justify-center transition-all duration-300',
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      <span className={cn(isLoading && 'opacity-80')}>{children}</span>
    </motion.button>
  );
};

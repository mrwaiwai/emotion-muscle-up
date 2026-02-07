import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}: GlassCardProps) {
  const variants = {
    default: 'glass-card',
    strong: 'glass-card-strong',
    subtle: 'glass-card bg-white/50',
  };

  return (
    <motion.div
      className={cn(variants[variant], className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

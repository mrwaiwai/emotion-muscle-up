import { ReactNode, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'glass-card',
      strong: 'glass-card-strong',
      subtle: 'glass-card bg-white/50',
    };

    return (
      <motion.div
        ref={ref}
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
);

GlassCard.displayName = 'GlassCard';

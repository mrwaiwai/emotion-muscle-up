import { motion } from 'framer-motion';

interface OrbProps {
  color: string;
  size: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}

const Orb = ({ color, size, position, delay = 0 }: OrbProps) => (
  <motion.div
    className={`floating-orb ${color} ${size}`}
    style={position}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative orbs */}
      <Orb 
        color="bg-primary/20" 
        size="w-96 h-96" 
        position={{ top: '-10%', right: '-5%' }} 
        delay={0}
      />
      <Orb 
        color="bg-accent/30" 
        size="w-80 h-80" 
        position={{ top: '30%', left: '-10%' }} 
        delay={2}
      />
      <Orb 
        color="bg-secondary/40" 
        size="w-72 h-72" 
        position={{ bottom: '10%', right: '10%' }} 
        delay={4}
      />
      <Orb 
        color="bg-emotion-labeling/20" 
        size="w-64 h-64" 
        position={{ bottom: '-5%', left: '20%' }} 
        delay={1}
      />
      <Orb 
        color="bg-emotion-expressing/15" 
        size="w-48 h-48" 
        position={{ top: '50%', right: '30%' }} 
        delay={3}
      />
    </div>
  );
}

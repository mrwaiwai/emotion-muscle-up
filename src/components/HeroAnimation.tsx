import { motion } from 'framer-motion';

export function HeroAnimation() {
  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto mb-6 rounded-3xl overflow-hidden shadow-soft"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Decorative glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none z-10 rounded-3xl" />
      
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto rounded-3xl"
        style={{ aspectRatio: '16/9' }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      
      {/* Floating decorations */}
      <motion.div
        className="absolute top-4 right-4 text-3xl"
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        💪
      </motion.div>
      
      <motion.div
        className="absolute bottom-4 left-4 text-3xl"
        animate={{ 
          y: [0, -6, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        ❤️
      </motion.div>
      
      <motion.div
        className="absolute top-4 left-4 text-2xl"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        ⭐
      </motion.div>
    </motion.div>
  );
}

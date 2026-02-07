import { motion } from 'framer-motion';

interface QuestionVideoProps {
  videoUrl: string;
}

export function QuestionVideo({ videoUrl }: QuestionVideoProps) {
  return (
    <motion.div
      className="w-full max-w-lg mx-auto mb-6 rounded-2xl overflow-hidden shadow-soft"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <video
        key={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto rounded-2xl"
        style={{ aspectRatio: '16/9' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.main>
  );
}

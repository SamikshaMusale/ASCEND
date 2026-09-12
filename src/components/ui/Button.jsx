import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none',
  danger: 'px-6 py-3 bg-semantic-error/20 border border-semantic-error/30 text-semantic-error font-semibold rounded-lg hover:bg-semantic-error/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-semantic-error/50',
};

export default function Button({ children, variant = 'primary', className = '', disabled = false, onClick, type = 'button', ...props }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

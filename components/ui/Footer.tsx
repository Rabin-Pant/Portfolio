// components/ui/Footer.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Heart } from 'lucide-react';

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900/30 border-t border-slate-800/50 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={footerVariants}
        >
          <motion.p
            variants={itemVariants}
            className="text-xs text-slate-500 flex items-center gap-1.5 whitespace-nowrap"
          >
            Made by <span className="text-primary font-medium">Rabin Pant</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Heart size={10} className="text-red-500 inline" />
            </motion.span>
            © {currentYear}
          </motion.p>

          <motion.button
            variants={itemVariants}
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors duration-200 group px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-primary/30 hover:bg-primary/5"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </motion.div>
            Back to Top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

// components/ui/Footer.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

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
        {/* Radial gradients rather than blur-3xl: pulsing the opacity of a
            blurred element re-applies the 64px blur on every frame. */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(111,184,141,0.05)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(111,184,141,0.05)_0%,transparent_70%)] animate-pulse delay-1000" />
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
            © {currentYear}
          </motion.p>

          <motion.button
            variants={itemVariants}
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors duration-200 group px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="anim-bob" style={{ animationDuration: '1.5s' }}>
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </div>
            Back to Top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

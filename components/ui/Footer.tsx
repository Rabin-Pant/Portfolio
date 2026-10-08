// components/ui/Footer.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUp, MapPin } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';

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
      <div className="container-custom relative z-10">
        <motion.div
          className="flex flex-col items-center gap-3 py-5 md:flex-row md:justify-between"
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

          <motion.div variants={itemVariants} className="flex items-center gap-5">
            <motion.a
              href="https://www.linkedin.com/in/rabin-pant-6b4559358"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
              className="inline-flex items-center justify-center min-h-11 min-w-11 text-slate-300 hover:text-white transition-colors duration-200 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span aria-hidden="true"><LinkedinIcon size={20} /></span>
            </motion.a>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={16} aria-hidden="true" />
              Kathmandu, Nepal
            </span>
          </motion.div>

          <motion.button
            variants={itemVariants}
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors duration-200 group px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-primary/30 hover:bg-primary/5"
          >
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            Back to Top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

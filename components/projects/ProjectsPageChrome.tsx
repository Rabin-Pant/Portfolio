// components/projects/ProjectsPageChrome.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ProjectsPageHeader = ({ count }: { count: number }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4"
        >
          Portfolio
        </motion.div>
        <motion.h1
          className="font-display text-4xl md:text-5xl font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          All <span className="gradient-text">projects</span>
        </motion.h1>
        <motion.p
          className="text-body drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Everything I&apos;ve built end to end, in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-block mt-4 text-sm text-body drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] hover:text-foreground transition-colors duration-200"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700">
          <span className="text-sm text-muted">
            Showing <span className="text-foreground font-medium">{count}</span> projects
          </span>
        </div>
      </motion.div>
    </>
  );
};

export const ProjectsBottomCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-center mt-16"
    >
      <div className="inline-flex flex-col items-center gap-4">
        <p className="text-sm text-body drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">Got something in mind?</p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-ink hover:bg-primary-dark transition-all duration-200 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40"
        >
          Let&apos;s talk
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

// components/about/AboutHero.tsx
'use client';

import { motion } from 'framer-motion';

export const AboutHero = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/10">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-mono font-bold mb-6">
            I plan before I <span className="gradient-text">code.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            I'm Rabin Pant, a BSc (Hons) Computing student based in Kathmandu, Nepal. 
            I believe great software starts with a solid foundation — that's why I focus 
            on system design, clean architecture, and cloud-native deployment before 
            writing a single line of code.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <div className="text-2xl font-mono font-bold text-primary">3+</div>
              <div className="text-sm text-slate-400">Production Apps</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-primary">5</div>
              <div className="text-sm text-slate-400">AWS Certifications</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-primary">7+</div>
              <div className="text-sm text-slate-400">Tech Stacks</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
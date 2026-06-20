// components/about/PhilosophySection.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const PhilosophySection = () => {
  const philosophies = [
    'I design systems that can scale from day one',
    'I write code that other developers can read and maintain',
    'I test edge cases before they become production bugs',
    'I document architecture decisions for future reference',
    'I deploy with monitoring and logging from the start',
  ];

  return (
    <section className="py-20 bg-slate-900/10">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6">
              My <span className="gradient-text">Philosophy</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              I believe great software is built with intention, not by accident. 
              Here's what I stand for:
            </p>
            <ul className="space-y-4">
              {philosophies.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-mono font-bold mb-3">
                  "Good software starts with a good plan."
                </h3>
                <p className="text-slate-400 text-sm">— My development mantra</p>
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Java</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Python</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">JavaScript</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">TypeScript</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">SQL</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Bash</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
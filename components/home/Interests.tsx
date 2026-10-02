// components/home/Interests.tsx
'use client';

import { motion } from 'framer-motion';
import {
  LibraryBig,
  Headphones,
  Gamepad2,
  Mountain
} from 'lucide-react';

export const Interests = () => {
  const interests = [
    {
      icon: LibraryBig,
      label: 'Reading',
      description: 'Tech blogs, architecture write-ups, the old novels',
    },
    {
      icon: Headphones,
      label: 'Music',
      description: 'Finding new artists worth listening to',
    },
    {
      icon: Gamepad2,
      label: 'Gaming',
      description: 'Battle royal/RPGs games mostly',
    },
    {
      icon: Mountain,
      label: 'Outdoors',
      description: 'Hiking and biking when I need to get away from a screen',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-y border-slate-800/50 bg-slate-900/10 relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="font-display text-3xl md:text-4xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            What I&apos;m into <span className="gradient-text">besides tech</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-slate-200 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            A few things I spend time on when I&apos;m away from the keyboard.
          </motion.p>
        </motion.div>

        {/* Interests Grid — 2 columns on mobile, 4 on desktop. Was 3 on
            desktop, which orphaned the 4th card alone on its own row with
            two empty cells beside it once two entries were removed; 4 lets
            all of them sit in one even row instead. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 max-w-4xl mx-auto">
          {interests.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
                className="group relative p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 cursor-default shadow-lg hover:shadow-xl"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/5 blur-xl -z-10" />

                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-[scale] duration-300">
                    <Icon size={28} className="text-primary" />
                  </div>
                  
                  {/* Label */}
                  <motion.h3 
                    className="mt-4 text-base md:text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </motion.h3>
                  
                  {/* Description - hidden on mobile, visible on hover on desktop */}
                  <motion.p 
                    className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.description}
                  </motion.p>

                  {/* Decorative dot */}
                  <div className="mt-4 w-1 h-1 rounded-full bg-primary/30" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fun Fact / Quote - Enhanced */}
      </div>
    </section>
  );
};
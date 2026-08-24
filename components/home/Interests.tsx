// components/home/Interests.tsx
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Music,
  Gamepad2,
  Bike,
  Heart
} from 'lucide-react';

// Floating particles for background - static, defined once outside the component
const particles = [
  { id: 0, x: 15, y: 10, size: 2.5, duration: 8, delay: 0, opacity: 0.15 },
  { id: 1, x: 85, y: 20, size: 3, duration: 10, delay: 0.5, opacity: 0.2 },
  { id: 2, x: 25, y: 80, size: 2, duration: 9, delay: 1, opacity: 0.12 },
  { id: 3, x: 75, y: 85, size: 3.5, duration: 11, delay: 1.5, opacity: 0.18 },
  { id: 4, x: 45, y: 15, size: 2, duration: 8, delay: 0.3, opacity: 0.15 },
  { id: 5, x: 10, y: 50, size: 3, duration: 10, delay: 0.8, opacity: 0.2 },
  { id: 6, x: 90, y: 55, size: 2.5, duration: 9, delay: 1.2, opacity: 0.15 },
  { id: 7, x: 50, y: 90, size: 2, duration: 8, delay: 0.6, opacity: 0.12 },
  { id: 8, x: 65, y: 30, size: 3, duration: 11, delay: 1.8, opacity: 0.18 },
  { id: 9, x: 30, y: 65, size: 2.5, duration: 9, delay: 0.4, opacity: 0.15 },
  { id: 10, x: 70, y: 70, size: 2, duration: 10, delay: 0.9, opacity: 0.12 },
  { id: 11, x: 40, y: 40, size: 3, duration: 8, delay: 1.1, opacity: 0.2 },
  { id: 12, x: 55, y: 5, size: 2.5, duration: 11, delay: 0.2, opacity: 0.15 },
  { id: 13, x: 20, y: 95, size: 2, duration: 9, delay: 1.4, opacity: 0.12 },
  { id: 14, x: 80, y: 45, size: 3, duration: 10, delay: 0.7, opacity: 0.18 },
  { id: 15, x: 35, y: 75, size: 2.5, duration: 12, delay: 1.6, opacity: 0.15 },
  { id: 16, x: 60, y: 15, size: 2, duration: 8, delay: 0.1, opacity: 0.12 },
  { id: 17, x: 5, y: 70, size: 3, duration: 11, delay: 0.3, opacity: 0.2 },
  { id: 18, x: 95, y: 35, size: 2.5, duration: 9, delay: 1.3, opacity: 0.15 },
  { id: 19, x: 50, y: 50, size: 2, duration: 10, delay: 0.5, opacity: 0.12 },
];

const particleVariants = {
  hidden: { opacity: 0 },
  visible: ({ duration, delay, opacity }: { duration: number; delay: number; opacity: number }) => ({
    y: [0, -30, 0, 30, 0],
    x: [0, 20, 0, -20, 0],
    opacity: [opacity, opacity * 2, opacity],
    transition: { duration, repeat: Infinity, delay, ease: 'easeInOut' as const },
  }),
};

// Memoized, single viewport observer for all 20 particles via variant propagation
const InterestsParticles = memo(function InterestsParticles() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          custom={{ duration: p.duration, delay: p.delay, opacity: p.opacity }}
          variants={particleVariants}
        />
      ))}
    </motion.div>
  );
});

export const Interests = () => {
  const interests = [
    {
      icon: BookOpen,
      label: 'Reading',
      description: 'Tech blogs, architecture write-ups, the old novels',
    },
    {
      icon: Music,
      label: 'Music',
      description: 'Finding new artists worth listening to',
    },
    {
      icon: Gamepad2,
      label: 'Gaming',
      description: 'Battle royal/RPGs games mostly',
    },
    {
      icon: Bike,
      label: 'Outdoors',
      description: 'Hiking and biking when I need to get away from a screen',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-y border-slate-800/50 bg-slate-900/10 relative overflow-hidden">
      <InterestsParticles />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4"
          >
            <Heart size={14} />
            <span>Outside of work</span>
          </motion.div>

          <motion.h2
            className="font-display text-3xl md:text-4xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            What I'm into <span className="gradient-text">besides code</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-slate-200 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            A few things I spend time on when I'm away from the keyboard.
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
                  {/* Icon with floating animation */}
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    <Icon size={28} className="text-primary" />
                  </motion.div>
                  
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
                  <motion.div 
                    className="mt-4 w-1 h-1 rounded-full bg-primary/30"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1,
                    }}
                  />
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
// components/home/Interests.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Code2, 
  BookOpen, 
  Music, 
  Gamepad2, 
  Bike,
  Globe,
  Heart,
  Sparkles
} from 'lucide-react';

export const Interests = () => {
  const interests = [
    {
      icon: Code2,
      label: 'Open Source',
      description: 'Contributing to and building open-source projects',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      hoverBg: 'hover:bg-blue-500/20',
    },
    {
      icon: BookOpen,
      label: 'Reading',
      description: 'Tech blogs, architecture books, and sci-fi novels',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      hoverBg: 'hover:bg-purple-500/20',
    },
    {
      icon: Music,
      label: 'Music',
      description: 'Playing guitar and discovering new artists',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      hoverBg: 'hover:bg-pink-500/20',
    },
    {
      icon: Gamepad2,
      label: 'Gaming',
      description: 'Strategy games and exploring game design',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      hoverBg: 'hover:bg-green-500/20',
    },
    {
      icon: Bike,
      label: 'Outdoor',
      description: 'Hiking, biking, and exploring new places',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      hoverBg: 'hover:bg-orange-500/20',
    },
    {
      icon: Globe,
      label: 'Travel',
      description: 'Exploring new cultures and meeting people',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      hoverBg: 'hover:bg-teal-500/20',
    },
  ];

  // Floating particles for background
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

  return (
    <section className="py-20 md:py-28 border-y border-slate-800/50 bg-slate-900/10 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
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
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 20, 0, -20, 0],
              opacity: [p.opacity, p.opacity * 2, p.opacity],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

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
            <span>Beyond the Code</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-mono font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            What I'm <span className="gradient-text">Passionate About</span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            When I'm not building applications, you'll find me exploring these interests
            that keep me inspired and balanced.
          </motion.p>
        </motion.div>

        {/* Interests Grid - 3 columns on mobile, 6 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto">
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
                className={`group relative p-6 md:p-8 rounded-2xl border ${item.border} ${item.bg} ${item.hoverBg} transition-all duration-300 cursor-default shadow-lg hover:shadow-xl`}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.bg} blur-xl -z-10`} />
                
                <div className="flex flex-col items-center text-center">
                  {/* Icon with floating animation */}
                  <motion.div 
                    className={`p-3 rounded-xl ${item.bg} border ${item.border} group-hover:scale-110 transition-transform duration-300`}
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
                    <Icon size={28} className={item.color} />
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/30 border border-slate-700 hover:border-primary transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={18} className="text-primary" />
            </motion.div>
            <span className="text-sm md:text-base text-slate-300 group-hover:text-white transition-colors duration-300">
              "Code is poetry, but life is the canvas"
            </span>
            <motion.div
              animate={{ rotate: [0, -10, 0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles size={18} className="text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
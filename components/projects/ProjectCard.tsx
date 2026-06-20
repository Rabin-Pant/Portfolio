// components/projects/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/GithubIcon';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const projectStyles: Record<string, { gradient: string; icon: string; emoji: string; glow: string }> = {
  'inventory-pro': {
    gradient: 'from-emerald-500/20 to-teal-600/20',
    icon: '🏬',
    emoji: '📦',
    glow: 'shadow-emerald-500/10',
  },
  'talentbridge': {
    gradient: 'from-blue-500/20 to-indigo-600/20',
    icon: '💼',
    emoji: '🤝',
    glow: 'shadow-blue-500/10',
  },
  'cinebook': {
    gradient: 'from-rose-500/20 to-orange-600/20',
    icon: '🎬',
    emoji: '🎟️',
    glow: 'shadow-rose-500/10',
  },
  'chat-app': {
    gradient: 'from-purple-500/20 to-pink-600/20',
    icon: '💬',
    emoji: '💬',
    glow: 'shadow-purple-500/10',
  },
};

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const style = projectStyles[project.slug] || {
    gradient: 'from-slate-500/20 to-slate-600/20',
    icon: '🚀',
    emoji: '💻',
    glow: 'shadow-slate-500/10',
  };

  // Fixed particle positions (no Math.random)
  const particles = [
    { x: 10, y: 20, size: 3, duration: 4.2, delay: 0.1 },
    { x: 80, y: 15, size: 4, duration: 5.1, delay: 0.4 },
    { x: 20, y: 70, size: 2.5, duration: 4.8, delay: 0.7 },
    { x: 85, y: 75, size: 3.5, duration: 5.5, delay: 0.3 },
    { x: 45, y: 10, size: 3, duration: 4.5, delay: 0.9 },
    { x: 15, y: 90, size: 2, duration: 5.2, delay: 0.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Glow Effect on Hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 ${style.glow}`} />
      
      <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-2xl">
        {/* Gradient Header with Icon */}
        <Link href={`/projects/${project.slug}`}>
          <div className={`relative h-32 bg-gradient-to-br ${style.gradient} overflow-hidden cursor-pointer`}>
            {/* Fixed Particles (no Math.random) */}
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: p.size,
                    height: p.size,
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                  }}
                  animate={{
                    y: [0, -15, 0, 15, 0],
                    x: [0, 8, 0, -8, 0],
                    opacity: [0.2, 0.7, 0.2],
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

            {/* Pulsing Glow behind emoji */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
            </motion.div>

            {/* Large Emoji/Icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-6xl opacity-90 select-none">
                {style.emoji}
              </span>
            </motion.div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
            
            {/* Tech Stack Tags */}
            <motion.div 
              className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {project.techStack.slice(0, 3).map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 + index * 0.1 }}
                  className="text-[10px] px-2 py-1 rounded-full bg-black/50 text-slate-300 border border-slate-700/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.length > 3 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-[10px] px-2 py-1 rounded-full bg-black/50 text-slate-500 border border-slate-700/50 backdrop-blur-sm"
                >
                  +{project.techStack.length - 3}
                </motion.span>
              )}
            </motion.div>

            {/* Year Badge with animation */}
            <motion.div 
              className="absolute bottom-3 left-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <span className="text-xs font-mono text-slate-300 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
                {project.year}
              </span>
            </motion.div>

            {/* "View Case Study" - Appears on hover */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm"
            >
              <span className="text-white font-medium text-sm flex items-center gap-2">
                View Case Study
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 space-y-3">
          <Link href={`/projects/${project.slug}`}>
            <div className="cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <motion.h3 
                    className="text-lg font-semibold text-white group-hover:text-primary transition-colors flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    {project.title}
                    <motion.span
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <Sparkles size={14} className="text-primary" />
                    </motion.span>
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-slate-400 mt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                  >
                    {project.tagline}
                  </motion.p>
                </div>
              </div>
              <motion.p 
                className="text-sm text-slate-400 line-clamp-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {project.description}
              </motion.p>
            </div>
          </Link>

          <motion.div 
            className="flex items-center justify-between pt-3 border-t border-slate-800/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-white transition-colors duration-200"
                  aria-label="View GitHub repository"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GithubIcon size={16} />
                </motion.a>
              )}
              {project.links.live && (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-white transition-colors duration-200"
                  aria-label="View live demo"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink size={16} />
                </motion.a>
              )}
            </div>
            <Link href={`/projects/${project.slug}`}>
              <motion.span 
                className="text-sm text-primary inline-flex items-center gap-1 cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                Details
                <ArrowRight size={14} />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
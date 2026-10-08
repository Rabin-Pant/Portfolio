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

const projectStyles: Record<string, { emoji: string }> = {
  'talentbridge': { emoji: '🤝' },
  'cinebook': { emoji: '🎟️' },
  'chat-app': { emoji: '💬' },
  'mediatranscribe': { emoji: '🎙️' },
};

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const style = projectStyles[project.slug] || { emoji: '💻' };

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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 shadow-primary/10" />

      <div className="relative panel rounded-xl overflow-hidden border border-slate-800 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-2xl">
        {/* Header with Icon */}
        <Link href={`/projects/${project.slug}`}>
          <div className="relative h-32 bg-gradient-to-br from-slate-800/60 to-slate-900/60 overflow-hidden cursor-pointer">
            {/* Glow behind emoji — static, brightens slightly on hover. */}
            <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(111,184,141,0.1)_0%,transparent_65%)]" />
            </div>

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
                  className="text-[10px] px-2 py-1 rounded-full bg-black/50 text-slate-300 border border-slate-700/50 hover:bg-black/70 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.length > 3 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-[10px] px-2 py-1 rounded-full bg-black/50 text-slate-500 border border-slate-700/50"
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
              <span className="text-xs font-mono text-slate-300 bg-black/30 px-2 py-0.5 rounded-full border border-white/5">
                {project.year}
              </span>
            </motion.div>

            {/* "View Case Study" - Appears on hover */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm"
            >
              <span className="text-white font-medium text-sm flex items-center gap-2">
                View Case Study
                {/* Only animates while hovered — the overlay is invisible
                    otherwise, so a permanent loop here was wasted work. */}
                <span className="inline-block [--nudge:5px] group-hover:anim-nudge">
                  →
                </span>
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
                    <Sparkles size={14} className="text-primary" />
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

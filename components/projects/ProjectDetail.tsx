// components/projects/ProjectDetail.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { GithubIcon } from '@/components/ui/GithubIcon';
import type { Project } from '@/lib/projects';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  return (
    <div className="container-custom">
      {/* Navigation Links */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          All Projects
        </Link>
        <span className="text-slate-600">|</span>
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
        >
          Home
        </Link>
      </div>

      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-mono font-bold">
          {project.title}
        </h1>
        <p className="text-xl text-slate-400">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-300 border border-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Problem → Solution → Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid md:grid-cols-3 gap-8 mb-16"
      >
        <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
          <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
            The Problem
          </h3>
          <p className="text-slate-300 leading-relaxed">{project.problem}</p>
        </div>
        <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
          <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
            The Solution
          </h3>
          <p className="text-slate-300 leading-relaxed">{project.solution}</p>
        </div>
        <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
          <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
            The Results
          </h3>
          <ul className="space-y-2">
            {project.results.map((result) => (
              <li key={result} className="flex items-start gap-2 text-slate-300">
                <CheckCircle size={16} className="text-primary flex-shrink-0 mt-1" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Image Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-800 mb-12"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <div className="text-6xl mb-4">
              {project.title === 'TalentBridge' && '💼'}
              {project.title === 'CineBook' && '🎬'}
              {project.title === 'Chat App' && '💬'}
            </div>
            <p className="text-sm">Project Screenshot Placeholder</p>
            <p className="text-xs text-slate-600 mt-1">Add your own image here</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </motion.div>

      {/* Project Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap gap-4 pt-8 border-t border-slate-800"
      >
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all duration-200"
          >
            <GithubIcon size={18} />
            View Code
          </a>
        )}
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-200"
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        )}
      </motion.div>
    </div>
  );
};
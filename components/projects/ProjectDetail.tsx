'use client';

import Image from 'next/image';
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
          className="inline-flex items-center gap-2 text-body  hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          All Projects
        </Link>
        <span className="text-subdued">|</span>
        <Link
          href="/"
          className="text-sm text-body  hover:text-foreground transition-colors duration-200"
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
        <h1 className="font-display text-4xl md:text-5xl font-semibold">
          {project.title}
        </h1>
        <p className="text-xl text-body">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-white text-sm text-body border border-surface-border"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Implementation and features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid md:grid-cols-2 gap-8 mb-16"
      >
        <div className="bg-white rounded-xl p-6 border border-surface-border">
          <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
            How I built it
          </h3>
          <p className="text-body leading-relaxed">{project.solution}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-surface-border">
          <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
            What it does
          </h3>
          <ul className="space-y-2">
            {project.results.map((result) => (
              <li key={result} className="flex items-start gap-2 text-body">
                <CheckCircle size={16} className="text-primary flex-shrink-0 mt-1" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Project Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative aspect-video bg-gradient-to-br from-white/20 to-white rounded-xl overflow-hidden border border-surface-border mb-12"
      >
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
      </motion.div>

      {/* Project Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap gap-4 pt-8 border-t border-surface-border"
      >
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 border border-surface-border transition-all duration-200"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-200"
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        )}
      </motion.div>
    </div>
  );
};

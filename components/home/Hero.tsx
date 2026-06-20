// components/home/Hero.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiJavascript, 
  SiTypescript, 
  SiOpenjdk,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiTailwindcss,
  SiDocker,
  SiGit,
  SiLinux,
  SiHtml5,
  SiCss
} from 'react-icons/si';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

export const Hero = () => {
  // Fixed positions - no Math.random() to avoid hydration mismatch
  const iconPositions = [
    { left: 15, top: 15 },
    { left: 75, top: 10 },
    { left: 10, top: 45 },
    { left: 85, top: 40 },
    { left: 20, top: 75 },
    { left: 70, top: 75 },
    { left: 45, top: 5 },
    { left: 5, top: 85 },
    { left: 90, top: 85 },
    { left: 35, top: 30 },
    { left: 60, top: 25 },
    { left: 25, top: 55 },
    { left: 75, top: 55 },
    { left: 50, top: 45 },
    { left: 40, top: 70 },
    { left: 55, top: 70 },
  ];

  // Floating tech icons data
  const floatingIcons = [
    { Icon: SiReact, color: '#61DAFB', size: 32, delay: 0, duration: 8 },
    { Icon: SiNextdotjs, color: '#ffffff', size: 28, delay: 0.5, duration: 7 },
    { Icon: SiNodedotjs, color: '#339933', size: 30, delay: 1, duration: 9 },
    { Icon: SiJavascript, color: '#F7DF1E', size: 26, delay: 1.5, duration: 6.5 },
    { Icon: SiTypescript, color: '#3178C6', size: 28, delay: 0.8, duration: 8.5 },
    { Icon: SiOpenjdk, color: '#007396', size: 30, delay: 2, duration: 7.5 },
    { Icon: SiPython, color: '#3776AB', size: 26, delay: 1.2, duration: 9.5 },
    { Icon: SiPostgresql, color: '#4169E1', size: 24, delay: 0.3, duration: 8.5 },
    { Icon: SiMysql, color: '#4479A1', size: 22, delay: 1.8, duration: 7.5 },
    { Icon: SiTailwindcss, color: '#38B2AC', size: 26, delay: 2.5, duration: 8.5 },
    { Icon: SiDocker, color: '#2496ED', size: 24, delay: 1.9, duration: 8.5 },
    { Icon: SiGit, color: '#F05032', size: 22, delay: 0.9, duration: 8.5 },
    { Icon: SiLinux, color: '#FCC624', size: 24, delay: 2.2, duration: 9.5 },
    { Icon: SiHtml5, color: '#E34F26', size: 20, delay: 1.4, duration: 8.5 },
    { Icon: SiCss, color: '#1572B6', size: 20, delay: 1.7, duration: 8.5 },
  ];

  // Custom AWS Icon component
  const AwsIcon = ({ size = 28, color = '#FF9900' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );

  // Combine icons with positions
  const allIcons = [
    ...floatingIcons.map((item, index) => ({
      ...item,
      position: iconPositions[index % iconPositions.length],
    })),
    { 
      Icon: AwsIcon, 
      color: '#FF9900', 
      size: 28, 
      delay: 0.6, 
      duration: 9.5,
      position: { left: 65, top: 30 }
    },
  ];

  // Mobile icons with fixed positions
  const mobileIcons = [
    { Icon: SiReact, color: '#61DAFB', size: 24, left: 5, top: 10 },
    { Icon: SiNextdotjs, color: '#ffffff', size: 20, left: 85, top: 15 },
    { Icon: SiNodedotjs, color: '#339933', size: 22, left: 10, top: 75 },
    { Icon: SiJavascript, color: '#F7DF1E', size: 18, left: 80, top: 80 },
    { Icon: SiTypescript, color: '#3178C6', size: 20, left: 45, top: 8 },
    { Icon: SiOpenjdk, color: '#007396', size: 22, left: 20, top: 45 },
    { Icon: SiPython, color: '#3776AB', size: 18, left: 70, top: 50 },
    { Icon: SiTailwindcss, color: '#38B2AC', size: 20, left: 50, top: 85 },
    { Icon: AwsIcon, color: '#FF9900', size: 20, left: 5, top: 50 },
  ];

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
      {/* Particle Network Background */}
      <div className="absolute inset-0 -z-10">
        <ParticleBackground 
          particleCount={60}
          connectionDistance={120}
          particleColor="rgba(45, 121, 240, 0.3)"
          lineColor="rgba(45, 121, 240, 0.06)"
          maxSpeed={0.4}
        />
        {/* Gradient glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/0 via-[#0A0A0A]/30 to-[#0A0A0A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/0 via-primary/5 to-[#0A0A0A]/0" />
      </div>

      {/* Floating Tech Icons - Desktop */}
      <div className="hidden lg:block absolute inset-0 -z-5 pointer-events-none">
        {allIcons.map((item, index) => {
          const IconComponent = item.Icon;
          const pos = item.position;
          return (
            <motion.div
              key={index}
              className="absolute"
              initial={{ 
                opacity: 0,
                scale: 0.5,
                rotate: 0
              }}
              animate={{ 
                y: [0, -12, 0, 12, 0],
                x: [0, 8, 0, -8, 0],
                opacity: 1,
                scale: 1,
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                y: {
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                },
                x: {
                  duration: item.duration * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay * 0.5,
                },
                rotate: {
                  duration: item.duration * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay * 0.3,
                },
                opacity: { duration: 0.5, delay: item.delay * 0.2 },
                scale: { duration: 0.5, delay: item.delay * 0.2 },
              }}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
            >
              <div 
                className="p-2 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 hover:scale-110 transition-transform duration-300 pointer-events-auto"
                style={{ color: item.color }}
              >
                <IconComponent size={item.size} color={item.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Tech Icons - Mobile */}
      <div className="lg:hidden absolute inset-0 -z-5 pointer-events-none">
        {mobileIcons.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <motion.div
              key={index}
              className="absolute"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                y: [0, -8, 0, 8, 0],
                x: [0, 5, 0, -5, 0],
                opacity: 0.6,
                scale: 1,
              }}
              transition={{
                y: {
                  duration: 6 + (index % 3) * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                },
                x: {
                  duration: 5 + (index % 3) * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                },
                opacity: { duration: 0.5, delay: index * 0.1 },
                scale: { duration: 0.5, delay: index * 0.1 },
              }}
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
              }}
            >
              <div 
                className="p-1.5 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-slate-700/30"
                style={{ color: item.color }}
              >
                <IconComponent size={item.size} color={item.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-slate-800 bg-slate-900/50 text-xs md:text-sm text-slate-400 mb-4 md:mb-6"
            >
              <Sparkles size={12} className="text-primary" />
              <span>Full-Stack Developer • AWS Certified</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold leading-[1.1] tracking-tight"
            >
              I build web apps <br />
              <span className="gradient-text">that actually work.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 md:mt-6 text-base md:text-lg text-slate-400 max-w-lg leading-relaxed"
            >
              I'm a developer who loves creating things that solve real problems. 
              I focus on building clean, fast, and reliable applications — 
              from the database all the way to the user interface.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-200 font-medium text-sm md:text-base shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                See My Work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg border border-slate-700 hover:border-primary hover:bg-primary/10 transition-all duration-200 font-medium text-sm md:text-base"
              >
                <FileText size={16} />
                Download Resume
              </a>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 md:mt-8 flex flex-wrap gap-1.5 md:gap-2"
            >
              {['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Java'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs md:text-sm text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10 scale-110 animate-pulse" />
              
              {/* Animated Border Ring */}
              <div className="relative p-1 rounded-full bg-gradient-to-r from-primary via-blue-500 to-primary animate-spin-slow">
                <div className="p-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary animate-spin-slow-reverse">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800">
                    <Image
                      src="/images/rabin.jpeg"
                      alt="Rabin Pant"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* Floating Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1 md:px-4 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-xl"
              >
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] md:text-xs text-slate-300">Open to work</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
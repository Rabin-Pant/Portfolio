'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { programmingLanguages } from '@/lib/skills';
import { 
  ChevronRight, 
  Rocket, 
  Target, 
  Lightbulb,
  Users,
  Compass,
  LibraryBig,
  Award,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  FolderKanban,
  BadgeCheck,
  Braces
} from 'lucide-react';

const journeySteps = [
  {
    year: '2022',
    title: 'Getting started',
    description: 'I got curious about how websites actually work and built my first HTML and CSS page. That was enough to hook me.',
    icon: Compass,
  },
  {
    year: '2023',
    title: 'Going deeper',
    description: 'Picked up JavaScript and started building small static apps, then got interested in how bigger systems are put together.',
    icon: LibraryBig,
  },
  {
    year: '2024',
    title: 'Finding a path',
    description: 'Started BSc (Hons) Computing. Spent a lot of time on software architecture, algorithms, and cloud computing.',
    icon: GraduationCap,
  },
  {
    year: '2025',
    title: 'Building for real',
    description: 'Built full-stack personal projects and developed practical skills in application design, databases, and cloud computing. This is where I started treating full-stack work seriously.',
    icon: BadgeCheck,
  },
];

const futureGoals = [
  {
    icon: Rocket,
    title: 'Cloud architecture',
    description: 'I want to become an AWS Solutions Architect and get better at designing systems that scale without falling over.',
  },
  {
    icon: Target,
    title: 'Leading a team',
    description: "Eventually I'd like to lead a small team and help other developers get better at building maintainable software.",
  },
  {
    icon: Users,
    title: 'Giving back locally',
    description: 'I want to help grow the developer community in Nepal. Workshops, open source, whatever helps people get unstuck.',
  },
  {
    icon: Lightbulb,
    title: 'Building useful things',
    description: "I'd rather build something that solves a real problem in Nepal, in education or healthcare, than another generic app.",
  },
];

const tabs = [
  { id: 'journey', label: 'My Journey', icon: Calendar },
  { id: 'future', label: 'Future Goals', icon: Rocket },
] as const;

export const AboutSection = ({ projectCount }: { projectCount: number }) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'future'>('journey');
  const stats = [
    { value: String(projectCount), label: 'Personal Projects', icon: FolderKanban },
    { value: '5', label: 'AWS Certs', icon: BadgeCheck },
    { value: String(programmingLanguages.length), label: 'Languages', icon: Braces },
    { value: journeySteps[0].year, label: 'Learning Since', icon: GraduationCap },
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft glows as radial gradients rather than blur-3xl: same look,
            but a gradient is painted once, while a 64px blur filter is a
            per-frame GPU pass whenever this area is re-composited. */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(10,92,142,0.05)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(10,92,142,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            className="font-display text-2xl md:text-4xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Who I <span className="accent-text">am</span>
          </motion.h2>

          <motion.p
            className="mt-3 md:mt-4 text-body max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Full-stack developer. I like taking a system apart to see how the pieces fit before I add my own.
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 text-center border border-surface-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex justify-center mb-1 md:mb-2">
                  <div className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={18} className="text-primary md:w-[22px] md:h-[22px]" />
                  </div>
                </div>
                <div className="text-xl md:text-3xl font-mono font-bold text-primary">{stat.value}</div>
                <div className="text-[10px] md:text-sm text-muted">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          {/* Left: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="lg:sticky lg:top-24">
              <div className="bg-surface rounded-xl md:rounded-2xl overflow-hidden border border-surface-border hover:border-primary/30 transition-all duration-300 shadow-xl group">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src="/images/rabin2.jpeg"
                    alt="Rabin Pant"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
                
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-mono font-bold text-foreground">Rabin Pant</h3>
                  <p className="text-xs md:text-sm text-primary">Full-Stack Developer</p>
                  
                  <div className="mt-3 md:mt-4 space-y-2 md:space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 md:gap-3 text-muted group/item hover:text-body transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-white group-hover/item:bg-primary/10 transition-colors">
                        <MapPin size={12} className="text-muted group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">Kathmandu, Nepal</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-muted group/item hover:text-body transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-white group-hover/item:bg-primary/10 transition-colors">
                        <GraduationCap size={12} className="text-muted group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">BSc (Hons) Computing</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-muted group/item hover:text-body transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-white group-hover/item:bg-primary/10 transition-colors">
                        <Briefcase size={12} className="text-muted group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">{projectCount} Personal Projects</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-muted group/item hover:text-body transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-white group-hover/item:bg-primary/10 transition-colors">
                        <Award size={12} className="text-muted group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">5 AWS Certifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {/* Tabs - Optimized for mobile */}
            <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap text-xs sm:text-sm font-medium flex-shrink-0 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white text-muted hover:text-foreground hover:bg-slate-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={14} className="sm:w-4 sm:h-4" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border border-surface-border min-h-[300px] md:min-h-[380px]"
              >
                {activeTab === 'journey' && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                        <Calendar size={18} className="text-primary md:w-[20px] md:h-[20px]" />
                      </div>
                      <h3 className="text-lg md:text-xl font-mono font-bold text-foreground">My Journey</h3>
                    </div>
                    <p className="text-muted leading-relaxed text-sm md:text-base">
                      It started in 2022 with a pretty basic question:
                      <span className="text-foreground"> &quot;how do websites actually work?&quot; </span>
                      I&apos;ve been building, breaking things, and figuring it out since then.
                    </p>
                    <p className="text-muted leading-relaxed text-sm md:text-base">
                      I picked Computer Science because I wanted the
                      <span className="text-foreground"> why</span>, not just enough to copy-paste something that works.
                    </p>
                    
                    {/* Mobile-optimized timeline */}
                    <div className="relative pl-4 sm:pl-6 border-l-2 border-primary/30 space-y-4 sm:space-y-5 mt-4 md:mt-6">
                      {journeySteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={step.year}
                            className="relative p-3 sm:p-4 rounded-xl bg-white border border-surface-border"
                          >
                            <div className="absolute -left-[21px] sm:-left-[29px] p-1 sm:p-1.5 rounded-full bg-primary/20 border border-primary/30">
                              <Icon size={10} className="text-primary sm:w-3 sm:h-3" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                              <span className="text-xs font-mono text-primary whitespace-nowrap">{step.year}</span>
                              <h4 className="font-semibold text-foreground text-sm sm:text-base">{step.title}</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">{step.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'future' && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                        <Rocket size={18} className="text-primary md:w-[20px] md:h-[20px]" />
                      </div>
                      <h3 className="text-lg md:text-xl font-mono font-bold text-foreground">What&apos;s Next</h3>
                    </div>
                    <p className="text-muted leading-relaxed text-sm md:text-base">
                      Here&apos;s what I&apos;m working toward next.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                      {futureGoals.map((goal) => {
                        const Icon = goal.icon;
                        return (
                          <div
                            key={goal.title}
                            className="p-3 sm:p-4 rounded-xl bg-white border border-surface-border hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group cursor-default"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                                <Icon size={16} className="text-primary" />
                              </div>
                              <h4 className="font-semibold text-foreground text-xs sm:text-sm">{goal.title}</h4>
                            </div>
                            <p className="text-[11px] sm:text-xs text-muted leading-relaxed pl-1">{goal.description}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs sm:text-sm text-body">
                        <span className="text-primary font-medium">Long term,</span>{" "}
                        I want to build things people in Nepal actually use, and help more people here get into tech.
                      </p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3"
            >
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all duration-200 text-xs md:text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                View My Work
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl border border-surface-border hover:border-primary hover:bg-primary/10 transition-all duration-200 text-xs md:text-sm font-medium"
              >
                Let&apos;s Connect
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

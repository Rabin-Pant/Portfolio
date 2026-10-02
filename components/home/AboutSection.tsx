// components/home/AboutSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Brain,
  FolderKanban,
  BadgeCheck,
  Layers3
} from 'lucide-react';

export const AboutSection = () => {
  const [activeTab, setActiveTab] = useState<'journey' | 'future' | 'philosophy'>('journey');

  const journeySteps = [
    {
      year: '2022',
      title: 'Getting started',
      description: 'I got curious about how websites actually work and built my first HTML and CSS page. That was enough to hook me.',
      icon: Compass,
      marker: null,
    },
    {
      year: '2023',
      title: 'Going deeper',
      description: 'Picked up JavaScript and started building small static apps, then got interested in how bigger systems are put together.',
      icon: LibraryBig,
      marker: null,
    },
    {
      year: '2024',
      title: 'Finding a path',
      description: 'Started BSc (Hons) Computing. Spent a lot of time on software architecture, algorithms, and cloud computing.',
      icon: GraduationCap,
      marker: null,
    },
    {
      year: '2025',
      title: 'Building for real',
      description: 'Shipped three production apps and picked up five AWS certifications along the way. This is where I started treating full-stack work seriously.',
      icon: BadgeCheck,
      marker: null,
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

  const philosophyItems = [
    { icon: Brain, text: 'I try to keep code clean and documented well enough that I understand it six months later' },
    { icon: Target, text: 'I think about scale early, but I don\'t over-engineer for problems I don\'t have yet' },
    { icon: Lightbulb, text: 'I\'d rather spend an extra hour understanding the problem than rebuild the wrong solution twice' },
    { icon: Sparkles, text: 'I\'m still learning most of the time, and I like it that way' },
    { icon: Users, text: 'I like working with other developers and sharing what I\'ve figured out' },
  ];

  const stats = [
    { value: '3+', label: 'Projects', icon: FolderKanban },
    { value: '5', label: 'AWS Certs', icon: BadgeCheck },
    { value: '7+', label: 'Tech Stacks', icon: Layers3 },
    { value: '4+', label: 'Years Learning', icon: GraduationCap },
  ];

  const tabs = [
    { id: 'journey', label: 'My Journey', icon: Calendar },
    { id: 'future', label: 'Future Goals', icon: Rocket },
    { id: 'philosophy', label: 'My Philosophy', icon: Lightbulb },
  ] as const;

  return (
    <section className="py-20 md:py-28 bg-slate-900/10 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft glows as radial gradients rather than blur-3xl: same look,
            but a gradient is painted once, while a 64px blur filter is a
            per-frame GPU pass whenever this area is re-composited. */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(111,184,141,0.05)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(111,184,141,0.05)_0%,transparent_70%)]" />
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
            Who I <span className="gradient-text">am</span>
          </motion.h2>

          <motion.p
            className="mt-3 md:mt-4 text-slate-200 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
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
                className="bg-slate-900/60 rounded-xl md:rounded-2xl p-3 md:p-4 text-center border border-slate-800 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex justify-center mb-1 md:mb-2">
                  <div className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={18} className="text-primary md:w-[22px] md:h-[22px]" />
                  </div>
                </div>
                <div className="text-xl md:text-3xl font-mono font-bold text-primary">{stat.value}</div>
                <div className="text-[10px] md:text-sm text-slate-400">{stat.label}</div>
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
              <div className="bg-[#10160d] rounded-xl md:rounded-2xl overflow-hidden border border-slate-800 hover:border-primary/30 transition-all duration-300 shadow-xl group">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {/* No hover-scale here: an animated transform: scale() on a
                      real photo forces the GPU to resample the whole texture
                      on every frame of the transition — confirmed expensive
                      via CDP trace on the backdrop's crossfade (59% of that
                      transition's cost). The card's border-color hover below
                      still gives hover feedback without that cost. */}
                  <Image
                    src="/images/rabin2.jpeg"
                    alt="Rabin Pant"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-mono font-bold text-white">Rabin Pant</h3>
                  <p className="text-xs md:text-sm text-primary">Full-Stack Developer</p>
                  
                  <div className="mt-3 md:mt-4 space-y-2 md:space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 md:gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-slate-800/50 group-hover/item:bg-primary/10 transition-colors">
                        <MapPin size={12} className="text-slate-500 group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">Kathmandu, Nepal</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-slate-800/50 group-hover/item:bg-primary/10 transition-colors">
                        <GraduationCap size={12} className="text-slate-500 group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">BSc (Hons) Computing</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-slate-800/50 group-hover/item:bg-primary/10 transition-colors">
                        <Briefcase size={12} className="text-slate-500 group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">3+ Projects</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-slate-800/50 group-hover/item:bg-primary/10 transition-colors">
                        <Award size={12} className="text-slate-500 group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
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
                        : 'bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-700/50'
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
                className="bg-slate-900/60 rounded-xl md:rounded-2xl p-4 md:p-8 border border-slate-800 min-h-[300px] md:min-h-[380px]"
              >
                {activeTab === 'journey' && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                        <Calendar size={18} className="text-primary md:w-[20px] md:h-[20px]" />
                      </div>
                      <h3 className="text-lg md:text-xl font-mono font-bold text-white">My Journey</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      It started in 2022 with a pretty basic question:
                      <span className="text-white"> "how do websites actually work?" </span>
                      I've been building, breaking things, and figuring it out since then.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      I picked Computer Science because I wanted the
                      <span className="text-white"> why</span>, not just enough to copy-paste something that works.
                    </p>
                    
                    {/* Mobile-optimized timeline */}
                    <div className="relative pl-4 sm:pl-6 border-l-2 border-primary/30 space-y-4 sm:space-y-5 mt-4 md:mt-6">
                      {journeySteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={step.year}
                            className="relative p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700"
                          >
                            <div className="absolute -left-[21px] sm:-left-[29px] p-1 sm:p-1.5 rounded-full bg-primary/20 border border-primary/30">
                              {step.marker ? (
                                <span className="px-0.5 text-[9px] font-mono font-semibold leading-3 text-primary sm:text-[10px] sm:leading-4">
                                  {step.marker}
                                </span>
                              ) : (
                                <Icon size={10} className="text-primary sm:w-3 sm:h-3" />
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                              <span className="text-xs font-mono text-primary whitespace-nowrap">{step.year}</span>
                              <h4 className="font-semibold text-white text-sm sm:text-base">{step.title}</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{step.description}</p>
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
                      <h3 className="text-lg md:text-xl font-mono font-bold text-white">What's Next</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      Here's what I'm working toward next.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                      {futureGoals.map((goal) => {
                        const Icon = goal.icon;
                        return (
                          <div
                            key={goal.title}
                            className="p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group cursor-default"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                                <Icon size={16} className="text-primary" />
                              </div>
                              <h4 className="font-semibold text-white text-xs sm:text-sm">{goal.title}</h4>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pl-1">{goal.description}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs sm:text-sm text-slate-300">
                        <span className="text-primary font-medium">Long term,</span>{" "}
                        I want to build things people in Nepal actually use, and help more people here get into tech.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'philosophy' && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                        <Lightbulb size={18} className="text-primary md:w-[20px] md:h-[20px]" />
                      </div>
                      <h3 className="text-lg md:text-xl font-mono font-bold text-white">My Philosophy</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      A few things I try to stick to, whether or not anyone's checking.
                    </p>

                    <div className="space-y-2 sm:space-y-3 mt-4">
                      {philosophyItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.text}
                            className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/30 hover:translate-x-1 transition-all duration-300 group cursor-default"
                          >
                            <div className="p-1 sm:p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                              <Icon size={12} className="text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700 text-center group hover:border-primary/30 transition-all duration-300">
                      <Sparkles size={16} className="text-primary mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-slate-400">
                        "Good software starts with a good plan."
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1">— My development mantra</p>
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
                className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl bg-primary hover:bg-primary-dark transition-all duration-200 text-xs md:text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                View My Work
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl border border-slate-700 hover:border-primary hover:bg-primary/10 transition-all duration-200 text-xs md:text-sm font-medium"
              >
                Let's Connect
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
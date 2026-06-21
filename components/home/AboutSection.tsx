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
  Code2,
  BookOpen,
  Award,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Sparkles,
  Zap,
  Brain,
  Star,
  Clock
} from 'lucide-react';

export const AboutSection = () => {
  const [activeTab, setActiveTab] = useState<'journey' | 'future' | 'philosophy'>('journey');

  const journeySteps = [
    {
      year: '2022',
      title: 'The Beginning',
      description: 'Started my journey in web development with a curiosity about how websites work. Built my first HTML/CSS page and was hooked.',
      icon: Code2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      year: '2023',
      title: 'Diving Deeper',
      description: 'Discovered JavaScript. Started building Static applications and exploring system design concepts.',
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      year: '2024',
      title: 'Finding My Path',
      description: 'Enrolled in BSc (Hons) Computing, diving deep into software architecture, algorithms, cloud computing and advance programming.',
      icon: GraduationCap,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      year: '2025',
      title: 'Building & Growing',
      description: 'Developed 3+ production applications, earned 5 AWS certifications, and deepened my knowledge in cloud computing and full-stack development.',
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ];

  const futureGoals = [
    {
      icon: Rocket,
      title: 'Cloud Architecture',
      description: 'Become an AWS Solutions Architect, designing scalable cloud-native systems for enterprises.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: Target,
      title: 'Tech Leadership',
      description: 'Lead development teams and mentor junior developers in building robust, maintainable software.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Create developer communities in Nepal, organize tech workshops, and contribute to open-source education.',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      icon: Lightbulb,
      title: 'Product Innovation',
      description: 'Build products that solve real-world problems in Nepal, focusing on education, healthcare, and e-commerce.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ];

  const philosophyItems = [
    { icon: Brain, text: 'I believe in writing code that is clean, maintainable, and well-documented' },
    { icon: Target, text: 'I design systems with scalability in mind from day one' },
    { icon: Lightbulb, text: 'I invest time in understanding the problem before jumping to solutions' },
    { icon: Sparkles, text: 'I believe in continuous learning and staying curious' },
    { icon: Users, text: 'I value collaboration and knowledge sharing with the developer community' },
  ];

  const stats = [
    { value: '4+', label: 'Production Apps', icon: Briefcase },
    { value: '5', label: 'AWS Certs', icon: Award },
    { value: '7+', label: 'Tech Stacks', icon: Code2 },
    { value: '3+', label: 'Years Learning', icon: Clock },
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm mb-4"
          >
            <Heart size={12} className="md:w-[14px] md:h-[14px]" />
            <span>My Story</span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-4xl font-mono font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Who I <span className="gradient-text">Am</span>
          </motion.h2>
          
          <motion.p 
            className="mt-3 md:mt-4 text-slate-400 max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            A full-stack developer passionate about building scalable systems and solving real-world problems.
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
                className="bg-slate-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 text-center border border-slate-800 hover:border-primary/30 transition-all duration-300 group"
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
              <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border border-slate-800 hover:border-primary/30 transition-all duration-300 shadow-xl group">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src="/images/rabin2.jpeg"
                    alt="Rabin Pant"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 border border-white/10"
                  >
                    <span className="text-[10px] md:text-xs text-slate-300 flex items-center gap-1 md:gap-1.5">
                      <Sparkles size={10} className="text-primary md:w-[12px] md:h-[12px]" />
                      Available
                    </span>
                  </motion.div>
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
                      <span className="text-xs md:text-sm">4+ Production Apps</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-slate-400 group/item hover:text-slate-300 transition-colors">
                      <div className="p-1 md:p-1.5 rounded-lg bg-slate-800/50 group-hover/item:bg-primary/10 transition-colors">
                        <Award size={12} className="text-slate-500 group-hover/item:text-primary transition-colors md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-xs md:text-sm">5 AWS Certifications</span>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-800">
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed italic">
                      "I believe great software starts with a solid foundation — 
                      that's why I focus on system design and clean architecture 
                      before writing a single line of code."
                    </p>
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
                className="bg-slate-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 border border-slate-800 min-h-[300px] md:min-h-[380px]"
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
                      I started my web development journey in 2022 with a simple curiosity: 
                      <span className="text-white"> "How do websites actually work?" </span>
                      That curiosity led me down a path of building, breaking, and learning.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      I chose Computer Science because I wanted to understand the 
                      <span className="text-white"> "why" </span>
                      behind the code — not just how to build things, but how to build them 
                      <span className="text-white"> the right way.</span>
                    </p>
                    
                    {/* Mobile-optimized timeline */}
                    <div className="relative pl-4 sm:pl-6 border-l-2 border-primary/30 space-y-4 sm:space-y-5 mt-4 md:mt-6">
                      {journeySteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <motion.div
                            key={step.year}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`relative p-3 sm:p-4 rounded-xl ${step.bg} border ${step.border}`}
                          >
                            <div className="absolute -left-[21px] sm:-left-[29px] p-1 sm:p-1.5 rounded-full bg-primary/20 border border-primary/30">
                              <Icon size={10} className="text-primary sm:w-3 sm:h-3" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                              <span className="text-xs font-mono text-primary whitespace-nowrap">{step.year}</span>
                              <h4 className="font-semibold text-white text-sm sm:text-base">{step.title}</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{step.description}</p>
                          </motion.div>
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
                      I'm excited about the future and the impact I can make in the tech industry.
                      Here's what I'm working toward:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                      {futureGoals.map((goal, index) => {
                        const Icon = goal.icon;
                        return (
                          <motion.div
                            key={goal.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                            className={`p-3 sm:p-4 rounded-xl ${goal.bg} border ${goal.border} hover:border-primary/50 transition-all duration-300 group cursor-default`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <div className={`p-1.5 sm:p-2 rounded-lg ${goal.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={16} className={goal.color} />
                              </div>
                              <h4 className="font-semibold text-white text-xs sm:text-sm">{goal.title}</h4>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pl-1">{goal.description}</p>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs sm:text-sm text-slate-300">
                        <span className="text-primary font-medium">Long-term vision:</span>{" "}
                        Build products that solve real-world problems in Nepal and help grow the local tech ecosystem.
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
                      These are the principles that guide how I build software and work with others:
                    </p>

                    <div className="space-y-2 sm:space-y-3 mt-4">
                      {philosophyItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.text}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            whileHover={{ x: 4, transition: { type: "spring", stiffness: 300 } }}
                            className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/30 transition-all duration-300 group cursor-default"
                          >
                            <div className="p-1 sm:p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                              <Icon size={12} className="text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.text}</span>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700 text-center group hover:border-primary/30 transition-all duration-300">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Sparkles size={16} className="text-primary mx-auto mb-1 sm:mb-2" />
                      </motion.div>
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
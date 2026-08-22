// components/home/ExperienceSection.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ExperienceSection = () => {
  const experiences = [
    {
      company: 'Karmachari Sanchaya Kosh',
      location: 'Pulchowk, Lalitpur',
      role: 'Full Stack Developer Intern',
      period: 'August 2026 — Present',
      current: true,
      stack: ['C#', 'ASP.NET Core Web API', 'ASP.NET Core MVC', 'Entity Framework Core', 'Oracle Database'],
      highlights: [
        'Built and maintained internal web applications using ASP.NET Core MVC and Web API.',
        'Designed Entity Framework Core data models against an Oracle Database for the core business workflows.',
        'Worked the full stack, from API endpoints to the UI, as part of the software development team.',
      ],
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
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
            <Briefcase size={12} className="md:w-[14px] md:h-[14px]" />
            <span>Where I've worked</span>
          </motion.div>

          <motion.h2
            className="font-display text-2xl md:text-4xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Work <span className="gradient-text">experience</span>
          </motion.h2>

          <motion.p
            className="mt-3 md:mt-4 text-slate-200 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
           
          </motion.p>
        </motion.div>

        {/* Experience Cards */}
        <div className="relative max-w-3xl mx-auto pl-4 sm:pl-6 border-l-2 border-primary/30 space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[25px] sm:-left-[31px] top-6 h-3 w-3 rounded-full border-2 border-primary bg-[#0B0F0D]" />

              <div className="panel rounded-xl md:rounded-2xl p-5 md:p-8 border border-slate-800 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Briefcase size={20} className="text-primary md:w-[22px] md:h-[22px]" />
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm md:text-base text-primary font-medium mt-0.5">
                        {exp.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-400 text-xs md:text-sm">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-500" />
                          {exp.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-500" />
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  {exp.current && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10px] md:text-xs font-medium self-start flex-shrink-0"
                    >
                      <Sparkles size={10} />
                      Currently here
                    </motion.span>
                  )}
                </div>

                {/* Highlights */}
                <ul className="space-y-2.5 mb-5">
                  {exp.highlights.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-2.5 text-slate-300 text-xs md:text-sm leading-relaxed"
                    >
                      <CheckCircle2 size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-full bg-slate-800/50 text-xs text-slate-300 border border-slate-700/50 hover:border-primary transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

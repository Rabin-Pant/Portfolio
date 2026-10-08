// components/home/SkillsSection.tsx
'use client';

import { motion } from 'framer-motion';
import {
  PanelsTopLeft,
  Database,
  CloudCog,
  PenTool,
  ServerCog,
  GitPullRequest,
  Braces,
  Blocks
} from 'lucide-react';

export const SkillsSection = () => {
  const skillCategories = [
    {
      icon: PanelsTopLeft,
      title: 'Frontend',
      description: 'Building responsive, interactive user interfaces',
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    },
    {
      icon: ServerCog,
      title: 'Backend',
      description: 'Scalable APIs and robust server-side logic',
      skills: ['Node.js', 'Java', 'Python', 'JSP/Servlets', 'REST APIs', 'WebSocket/Socket.io'],
    },
    {
      icon: Database,
      title: 'Database',
      description: 'Efficient data storage and management',
      skills: ['PostgreSQL', 'MySQL', 'Oracle', 'Prisma', 'JDBC', 'SQL'],
    },
    {
      icon: CloudCog,
      title: 'Cloud & DevOps',
      description: 'Cloud-native deployment and infrastructure',
      skills: ['AWS', 'Vercel', 'Render', 'Neon', 'Git', 'CI/CD', 'Linux', 'Bash'],
    },
    {
      icon: PenTool,
      title: 'Design & Tools',
      description: 'User-centered design and development workflows',
      skills: ['Figma', 'UI/UX Design', 'System Design', 'Architecture Diagrams'],
    },
    {
      icon: GitPullRequest,
      title: 'Version Control',
      description: 'Collaborative development with best practices',
      skills: ['Git', 'GitHub', 'Git Flow', 'Pull Requests', 'Code Review'],
    },
  ];

  const languages = ['Java', 'SQL', 'JavaScript', 'Python', 'Bash', 'TypeScript'];

  return (
    <section className="py-20 md:py-28 bg-slate-900/10 relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="font-display text-3xl md:text-4xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            My <span className="gradient-text">skills</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-slate-200 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            The tools and languages I reach for when turning an idea into a working system.
          </motion.p>
        </motion.div>

        {/* Skill Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-16">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-30px" }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
                className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon size={24} className="text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.02 }}
                      viewport={{ once: true }}
                      className="px-2.5 py-1 rounded-full bg-slate-800/50 text-xs text-slate-300 border border-slate-700/50 hover:border-primary transition-colors duration-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Programming Languages */}
        <div className="max-w-3xl mx-auto">
          {/* Programming Languages - Clean version without stars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Braces size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Programming Languages</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/30 transition-all duration-200 group"
                >
                  <span className="text-sm font-medium text-white">{lang}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { icon: Braces, label: 'Languages', value: '6+' },
            { icon: Blocks, label: 'Frameworks', value: '8+' },
            { icon: Database, label: 'Databases', value: '3+' },
            { icon: CloudCog, label: 'Cloud Platforms', value: '5+' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                className="bg-slate-900/30 rounded-2xl p-5 text-center border border-slate-800 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Icon size={22} className="text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// components/home/SkillsSection.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Cloud, 
  Layout, 
  Server, 
  GitBranch,
  Award,
  Sparkles,
  Terminal,
  Boxes
} from 'lucide-react';

export const SkillsSection = () => {
  const skillCategories = [
    {
      icon: Code2,
      title: 'Frontend',
      description: 'Building responsive, interactive user interfaces',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    },
    {
      icon: Server,
      title: 'Backend',
      description: 'Scalable APIs and robust server-side logic',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      skills: ['Node.js', 'Java', 'Python', 'JSP/Servlets', 'REST APIs', 'WebSocket/Socket.io'],
    },
    {
      icon: Database,
      title: 'Database',
      description: 'Efficient data storage and management',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      skills: ['PostgreSQL', 'MySQL', 'Prisma', 'JDBC', 'SQL', 'TypeORM'],
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Cloud-native deployment and infrastructure',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      skills: ['AWS', 'Vercel', 'Render', 'Neon', 'Git', 'CI/CD', 'Linux', 'Bash'],
    },
    {
      icon: Layout,
      title: 'Design & Tools',
      description: 'User-centered design and development workflows',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      skills: ['Figma', 'UI/UX Design', 'System Design', 'Architecture Diagrams'],
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Collaborative development with best practices',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      skills: ['Git', 'GitHub', 'Git Flow', 'Pull Requests', 'Code Review'],
    },
  ];

  const certifications = [
    { name: 'AWS Cloud Foundations', icon: Award, color: 'text-yellow-400' },
    { name: 'AWS Machine Learning Foundations', icon: Sparkles, color: 'text-purple-400' },
    { name: 'AWS ML for Natural Language Processing', icon: Sparkles, color: 'text-blue-400' },
    { name: 'AWS Data Engineering Foundations', icon: Database, color: 'text-green-400' },
    { name: 'AWS Generative AI Foundations', icon: Sparkles, color: 'text-orange-400' },
    { name: 'Java OOP - LinkedIn Learning', icon: Code2, color: 'text-red-400' },
    { name: 'UI/UX with Figma', icon: Layout, color: 'text-pink-400' },
  ];

  // Languages - Only names, no stars
  const languages = [
    { name: 'Java', level: 'Advanced' },
    { name: 'SQL', level: 'Advanced' },
    { name: 'JavaScript', level: 'Intermediate' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'Bash', level: 'Intermediate' },
    { name: 'TypeScript', level: 'Beginner' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Beginner':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  // Fixed particles
  const particles = [
    { id: 0, x: 10, y: 15, size: 1.5, duration: 10, delay: 0 },
    { id: 1, x: 85, y: 25, size: 2, duration: 12, delay: 0.5 },
    { id: 2, x: 20, y: 75, size: 1.5, duration: 9, delay: 1 },
    { id: 3, x: 70, y: 80, size: 2, duration: 11, delay: 1.5 },
    { id: 4, x: 45, y: 10, size: 1, duration: 8, delay: 0.3 },
    { id: 5, x: 5, y: 50, size: 2, duration: 13, delay: 0.8 },
    { id: 6, x: 92, y: 55, size: 1.5, duration: 10, delay: 1.2 },
    { id: 7, x: 50, y: 92, size: 1, duration: 9, delay: 0.6 },
    { id: 8, x: 65, y: 35, size: 2, duration: 12, delay: 1.8 },
    { id: 9, x: 30, y: 65, size: 1.5, duration: 10, delay: 0.4 },
    { id: 10, x: 75, y: 70, size: 1, duration: 11, delay: 0.9 },
    { id: 11, x: 40, y: 45, size: 2, duration: 9, delay: 1.1 },
    { id: 12, x: 55, y: 5, size: 1.5, duration: 12, delay: 0.2 },
    { id: 13, x: 15, y: 90, size: 1, duration: 10, delay: 1.4 },
    { id: 14, x: 80, y: 40, size: 2, duration: 11, delay: 0.7 },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-900/10 relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -40, 0, 40, 0],
              x: [0, 30, 0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
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

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4"
          >
            <Terminal size={14} />
            <span>Technical Expertise</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-mono font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            My <span className="gradient-text">Skills</span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            A comprehensive overview of my technical expertise, tools, and certifications.
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
                className={`group p-6 rounded-2xl border ${category.border} ${category.bg} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className={`p-3 rounded-xl ${category.bg} border ${category.border} group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon size={24} className={category.color} />
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

        {/* Languages & Certifications */}
        <div className="grid md:grid-cols-2 gap-6">
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
                <Code2 size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Programming Languages</h3>
            </div>

            <div className="space-y-3">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{lang.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getLevelColor(lang.level)}`}>
                      {lang.level}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Award size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Certifications</h3>
            </div>

            <div className="space-y-3">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-slate-800/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={16} className={cert.color} />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">
                      {cert.name}
                    </span>
                  </motion.div>
                );
              })}
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
            { icon: Code2, label: 'Languages', value: '6+' },
            { icon: Boxes, label: 'Frameworks', value: '8+' },
            { icon: Database, label: 'Databases', value: '3+' },
            { icon: Cloud, label: 'Cloud Platforms', value: '5+' },
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
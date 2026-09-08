// components/home/SkillsSection.tsx
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Cloud,
  Layout,
  Server,
  GitBranch,
  Terminal,
  Boxes
} from 'lucide-react';
import { SiFigma } from 'react-icons/si';
import { FaAws, FaLinkedin } from 'react-icons/fa6';

// Fixed particles - static, defined once outside the component
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

const particleVariants = {
  hidden: { opacity: 0 },
  visible: ({ duration, delay }: { duration: number; delay: number }) => ({
    y: [0, -40, 0, 40, 0],
    x: [0, 30, 0, -30, 0],
    opacity: [0.2, 0.5, 0.2],
    transition: { duration, repeat: Infinity, delay, ease: 'easeInOut' as const },
  }),
};

// Memoized, single viewport observer for all particles via variant propagation
const SkillsParticles = memo(function SkillsParticles() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0 }}
    >
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
          custom={{ duration: p.duration, delay: p.delay }}
          variants={particleVariants}
        />
      ))}
    </motion.div>
  );
});

export const SkillsSection = () => {
  const skillCategories = [
    {
      icon: Code2,
      title: 'Frontend',
      description: 'Building responsive, interactive user interfaces',
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    },
    {
      icon: Server,
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
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Cloud-native deployment and infrastructure',
      skills: ['AWS', 'Vercel', 'Render', 'Neon', 'Git', 'CI/CD', 'Linux', 'Bash'],
    },
    {
      icon: Layout,
      title: 'Design & Tools',
      description: 'User-centered design and development workflows',
      skills: ['Figma', 'UI/UX Design', 'System Design', 'Architecture Diagrams'],
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Collaborative development with best practices',
      skills: ['Git', 'GitHub', 'Git Flow', 'Pull Requests', 'Code Review'],
    },
  ];

  const cloudCertifications = [
    { name: 'AWS Cloud Foundations', issuer: 'Amazon Web Services', icon: FaAws, color: '#FF9900', link: 'https://www.credly.com/badges/6af2504a-9dcc-434f-b1fb-d2a8e49ad382/linked_in_profile' },
    { name: 'AWS Machine Learning Foundations', issuer: 'AWS Academy Graduate', icon: FaAws, color: '#FF9900', link: 'https://www.credly.com/badges/d055c99f-8284-4073-8657-1746dd48f7ea/linked_in_profile' },
    { name: 'AWS Machine Learning for Natural Language Processing', issuer: 'AWS Academy Graduate', icon: FaAws, color: '#FF9900', link: 'https://www.credly.com/badges/7c7e0c3c-9e87-4962-a6ac-1815551012e8/linked_in_profile' },
    { name: 'AWS Data Engineering Foundations', issuer: 'AWS Academy Graduate', icon: FaAws, color: '#FF9900', link: 'https://www.credly.com/badges/9063927c-796b-4d02-a7ea-aaa8553f2028/linked_in_profile' },
    { name: 'AWS Generative AI Foundations', issuer: 'AWS Academy Graduate', icon: FaAws, color: '#FF9900', link: 'https://www.credly.com/badges/45aae555-abf3-4c98-8e89-5175e3b69d4d/linked_in_profile' },
  ];

  const devCertifications = [
    { name: 'Java OOP', issuer: 'LinkedIn Learning', icon: FaLinkedin, color: '#0A66C2', link: 'https://www.linkedin.com/learning-login/share?account=57118729&forceAccount=false&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2Fcollections%2F7503016642931662848%3Ftrk%3Dshare_collection_url%26shareId%3DvuYB0JFqS222wpyDdMHpig%253D%253D' },
    { name: 'UI/UX with Figma', issuer: 'Figma', icon: SiFigma, color: '#F24E1E' },
  ];

  // Languages - Only names
  const languages = ['Java', 'SQL', 'JavaScript', 'Python', 'Bash', 'TypeScript'];

  const renderCertifications = (certs: typeof cloudCertifications | typeof devCertifications) =>
    certs.map((cert, index) => {
      const Icon = cert.icon;
      const cardClassName =
        'flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-primary/30 transition-all duration-200 group';
      const cardContent = (
        <>
          <div
            className="flex-shrink-0 rounded-lg bg-slate-900/60 p-2 ring-1 ring-inset ring-white/5 group-hover:scale-110 transition-transform duration-300"
            style={{ color: cert.color }}
          >
            <Icon size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200 truncate">
              {cert.name}
            </div>
            <div className="text-[11px] text-slate-500">{cert.issuer}</div>
          </div>
        </>
      );

      return cert.link ? (
        <motion.a
          key={cert.name}
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          whileHover={{ x: 4 }}
          className={cardClassName}
        >
          {cardContent}
        </motion.a>
      ) : (
        <motion.div
          key={cert.name}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          whileHover={{ x: 4 }}
          className={cardClassName}
        >
          {cardContent}
        </motion.div>
      );
    });

  return (
    <section className="py-20 md:py-28 bg-slate-900/10 relative overflow-hidden">
      <SkillsParticles />

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
            <span>What I work with</span>
          </motion.div>

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
            The tools and languages I actually reach for, plus a few certifications along the way.
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

        {/* Languages & Certifications */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* AWS Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <FaAws size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">AWS Certifications</h3>
            </div>

            <div className="space-y-3">
              {renderCertifications(cloudCertifications)}
            </div>
          </motion.div>

          {/* Programming & Design Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Layout size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Programming & Design Certifications</h3>
            </div>

            <div className="space-y-3">
              {renderCertifications(devCertifications)}
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
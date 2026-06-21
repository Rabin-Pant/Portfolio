// components/ui/Footer.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon } from '@/components/ui/GithubIcon';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';
import { 
  Mail, 
  MapPin, 
  Phone, 
  ArrowUp, 
  Sparkles,
  Heart,
  Code
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Contact', href: '/#contact' },
  ];

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'rabinpant194@gmail.com', 
      href: 'mailto:rabinpant194@gmail.com',
      color: 'hover:text-red-400'
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: 'Kathmandu, Nepal', 
      href: '#',
      color: 'hover:text-green-400'
    },
  ];

  const socialLinks = [
    { 
      icon: GithubIcon, 
      label: 'GitHub', 
      href: 'https://github.com/Rabin-Pant',
      color: 'hover:text-white'
    },
    { 
      icon: LinkedinIcon, 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/rabin-pant-6b4559358',
      color: 'hover:text-[#0077B5]'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      href: 'mailto:rabinpant194@gmail.com',
      color: 'hover:text-red-400'
    },
  ];

  const techStack = ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-slate-900/30 border-t border-slate-800/50 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container-custom relative z-10">
        {/* Main Footer */}
        <motion.div 
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={footerVariants}
        >
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Link href="/" className="group flex items-center space-x-2 mb-4">
                <motion.span 
                  className="text-xl font-mono font-bold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-primary">R</span>abin
                </motion.span>
                <motion.span 
                  className="w-1 h-1 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-slate-400 font-mono">Pant</span>
              </Link>
              
              <motion.p 
                className="text-sm text-slate-400 leading-relaxed mb-4"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Building production-grade applications with clean architecture,
                real-time features, and cloud-native deployment.
              </motion.p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 rounded-xl bg-slate-800/30 text-slate-400 ${link.color} border border-slate-700/50 transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.15,
                        y: -2,
                        backgroundColor: 'rgba(45, 121, 240, 0.1)',
                        borderColor: 'rgba(45, 121, 240, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      aria-label={link.label}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links - No Home */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <motion.li 
                    key={link.label}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mail size={14} className="text-primary" />
                Contact
              </h4>
              <ul className="space-y-3">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {item.href && item.href !== '#' ? (
                        <a
                          href={item.href}
                          className={`flex items-center gap-3 text-sm text-slate-400 ${item.color} transition-all duration-200 group`}
                        >
                          <motion.div 
                            className="p-1.5 rounded-lg bg-slate-800/30 group-hover:bg-primary/10 transition-colors"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                          >
                            <Icon size={14} className="text-slate-500 group-hover:text-primary transition-colors" />
                          </motion.div>
                          <span className="group-hover:text-white transition-colors">{item.value}</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-3 text-sm text-slate-400">
                          <div className="p-1.5 rounded-lg bg-slate-800/30">
                            <Icon size={14} className="text-slate-500" />
                          </div>
                          <span>{item.value}</span>
                        </span>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Tech Stack & Availability */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code size={14} className="text-primary" />
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      backgroundColor: 'rgba(45, 121, 240, 0.15)',
                      borderColor: 'rgba(45, 121, 240, 0.3)'
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-800/30 text-xs text-slate-300 border border-slate-700/50 transition-all duration-200 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
              
              {/* Availability Badge */}
              <motion.div 
                className="flex items-center gap-2 text-sm text-slate-400 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.2)'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-emerald-400 font-medium">Available for freelance work</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-slate-800/50 py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.p 
              className="text-xs text-slate-500 flex items-center gap-1.5"
              whileHover={{ x: 2 }}
            >
              Made by <span className="text-primary font-medium">Rabin Pant</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Heart size={10} className="text-red-500 inline" />
              </motion.span>
              © {currentYear}
            </motion.p>

            {/* Bottom Links */}
            <div className="flex items-center gap-6 text-xs">
              {['Projects', 'About', 'Contact', 'Resume'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  {item === 'Resume' ? (
                    <a
                      href="/resume.pdf"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-primary transition-colors duration-200"
                    >
                      {item}
                    </a>
                  ) : (
                    <Link
                      href={item === 'Projects' ? '/projects' : `/#${item.toLowerCase()}`}
                      className="text-slate-500 hover:text-primary transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Back to Top */}
            <AnimatePresence>
              {isVisible && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollToTop}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors duration-200 group px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-primary/30 hover:bg-primary/5"
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                  </motion.div>
                  Back to Top
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
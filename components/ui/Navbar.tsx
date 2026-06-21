// components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/GithubIcon';

const navLinks = [
  { href: '/#about', label: 'About', delay: 0.1 },
  { href: '/#skills', label: 'Skills', delay: 0.15 },
  { href: '/#projects', label: 'Projects', delay: 0.2 },
  { href: '/#contact', label: 'Contact', delay: 0.25 },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Detect scroll for glass effect and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (isHomePage) {
        const sections = ['about', 'skills', 'projects', 'contact'];
        let current = '';
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100) {
              current = section;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (isHomePage) {
      const element = document.querySelector(href.replace('/', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (!isHomePage) return false;
    const section = href.replace('/#', '');
    return activeSection === section;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || isOpen
          ? 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg'
          : 'bg-[#0A0A0A]/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-2 relative z-50"
            onClick={handleLogoClick}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <span className="text-xl font-mono font-bold text-white">
                <span className="text-primary">R</span>abin
              </span>
              <motion.span 
                className="w-1 h-1 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-slate-300 font-mono">Pant</span>
            </motion.div>
            <motion.span
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium transition-colors duration-200 relative group cursor-pointer ${
                  isActive(link.href) ? 'text-primary' : 'text-slate-300 hover:text-white'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: link.delay, duration: 0.3 }}
                whileHover={{ y: -1 }}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                  isActive(link.href) ? 'opacity-0' : ''
                }`} />
              </motion.a>
            ))}

            {/* GitHub Link */}
            <motion.a
              href="https://github.com/Rabin-Pant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors duration-200"
              aria-label="GitHub Profile"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <GithubIcon size={20} />
            </motion.a>

            {/* Resume Button */}
            <motion.a
              href="/resume.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-200 text-sm font-medium relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={14} />
                Resume
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-primary transition-colors p-2 rounded-lg hover:bg-white/10 z-50"
            aria-label="Toggle menu"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation - Improved visibility */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <motion.div className="py-6 space-y-4 border-t border-slate-700/50 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-b-2xl">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block text-base font-medium transition-colors duration-200 px-4 py-3 rounded-xl ${
                      isActive(link.href) 
                        ? 'text-primary bg-primary/10 border border-primary/20' 
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.label}</span>
                      {isActive(link.href) && (
                        <motion.span
                          className="inline-block w-1.5 h-1.5 bg-primary rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      )}
                    </div>
                  </motion.a>
                ))}

                <div className="border-t border-slate-700/50 pt-4">
                  <motion.a
                    href="https://github.com/Rabin-Pant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-base text-slate-200 hover:text-white transition-colors duration-200 px-4 py-3 rounded-xl hover:bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ x: 4 }}
                  >
                    <GithubIcon size={20} />
                    GitHub
                  </motion.a>

                  <motion.a
                    href="/resume.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-colors duration-200 text-sm font-medium text-center text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      Resume
                    </div>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
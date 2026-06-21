// components/home/ContactSection.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Sparkles, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { GithubIcon } from '@/components/ui/GithubIcon';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';
import useWeb3Forms from '@web3forms/react';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: '', // Hidden honeypot field - leave empty
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Ref for the hidden honeypot field
  const botCheckRef = useRef<HTMLInputElement>(null);

  // Web3Forms Access Key
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

  const { submit } = useWeb3Forms({
    access_key: accessKey,
    settings: {
      from_name: 'Portfolio Contact Form',
      subject: 'New Contact Message from RabinPant.dev',
    },
    onSuccess: (message, data) => {
      console.log('Success:', message);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 5000);
    },
    onError: (message, data) => {
      console.error('Error:', message);
      setIsSubmitting(false);
      setSubmitError(message || 'Something went wrong. Please try again.');
      setTimeout(() => setSubmitError(null), 5000);
    },
  });

  // Enhanced email validation
  const validateEmail = (email: string): boolean => {
    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    
    // Additional checks
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    // Block common disposable email domains
    const disposableDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'throwaway.com',
      'temp-mail.org', 'maildrop.cc', 'spamgourmet.com',
      'fake.com', 'mailnesia.com', 'guerrillamail.org',
      'mailinator.net', 'trash-mail.com', 'trash2009.com',
      'mytrashmail.com', 'spambox.us', 'throwawayemail.com'
    ];
    if (disposableDomains.some(d => domain.includes(d))) return false;
    
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation - enhanced
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address. No disposable/fake emails allowed.';
    }

    // Subject validation
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    // Message validation
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    // Honeypot check - must be empty
    if (formData.botcheck && formData.botcheck.trim() !== '') {
      newErrors.botcheck = 'Spam detected. Please try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submit({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        // Don't include botcheck - Web3Forms handles it automatically
      });
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setSubmitError('Something went wrong. Please try again.');
      setTimeout(() => setSubmitError(null), 5000);
    }
  };

  const socialLinks = [
    {
      icon: GithubIcon,
      label: 'GitHub',
      href: 'https://github.com/Rabin-Pant',
      username: '@Rabin-Pant',
      color: 'text-white',
      bg: 'hover:bg-white/10',
    },
    {
      icon: LinkedinIcon,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rabin-pant-6b4559358',
      username: 'Rabin Pant',
      color: 'text-[#0077B5]',
      bg: 'hover:bg-[#0077B5]/10',
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:rabinpant194@gmail.com',
      username: 'rabinpant194@gmail.com',
      color: 'text-red-400',
      bg: 'hover:bg-red-400/10',
    },
  ];

  // Background particles
  const particles = [
    { id: 0, x: 15, y: 10, size: 2, duration: 8, delay: 0 },
    { id: 1, x: 85, y: 20, size: 1.5, duration: 10, delay: 0.5 },
    { id: 2, x: 25, y: 80, size: 2.5, duration: 9, delay: 1 },
    { id: 3, x: 75, y: 85, size: 1, duration: 11, delay: 1.5 },
    { id: 4, x: 45, y: 15, size: 2, duration: 8, delay: 0.3 },
    { id: 5, x: 10, y: 50, size: 1.5, duration: 10, delay: 0.8 },
    { id: 6, x: 90, y: 55, size: 2, duration: 9, delay: 1.2 },
    { id: 7, x: 50, y: 90, size: 1.5, duration: 8, delay: 0.6 },
    { id: 8, x: 65, y: 30, size: 2.5, duration: 11, delay: 1.8 },
    { id: 9, x: 30, y: 65, size: 1, duration: 9, delay: 0.4 },
    { id: 10, x: 70, y: 70, size: 2, duration: 10, delay: 0.9 },
    { id: 11, x: 40, y: 40, size: 1.5, duration: 8, delay: 1.1 },
    { id: 12, x: 55, y: 5, size: 2, duration: 11, delay: 0.2 },
    { id: 13, x: 20, y: 95, size: 1, duration: 9, delay: 1.4 },
    { id: 14, x: 80, y: 45, size: 2.5, duration: 10, delay: 0.7 },
    { id: 15, x: 35, y: 75, size: 1.5, duration: 12, delay: 1.6 },
    { id: 16, x: 60, y: 15, size: 2, duration: 8, delay: 0.1 },
    { id: 17, x: 5, y: 70, size: 1, duration: 11, delay: 0.3 },
    { id: 18, x: 95, y: 35, size: 2, duration: 9, delay: 1.3 },
    { id: 19, x: 50, y: 50, size: 1.5, duration: 10, delay: 0.5 },
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
              y: [0, -30, 0, 30, 0],
              x: [0, 20, 0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
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
            <Sparkles size={14} />
            <span>Let's Connect</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-mono font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Get In <span className="gradient-text">Touch</span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Have a project in mind or want to collaborate? Reach out through the form below
            or connect with me on social platforms.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Form - 3/5 of the space */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-800 hover:border-primary/30 transition-all duration-300 shadow-xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Mail size={20} className="text-primary" />
                </div>
                <h3 className="text-xl font-mono font-bold">
                  Send a <span className="gradient-text">Message</span>
                </h3>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot Field - Hidden from users */}
                <div className="hidden">
                  <input
                    ref={botCheckRef}
                    type="text"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={handleChange}
                    placeholder="Leave this field empty"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>

                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <motion.div
                    className={`relative rounded-xl transition-all duration-300 ${
                      focusedField === 'name' ? 'ring-2 ring-primary/50' : ''
                    } ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none transition-colors duration-200"
                      placeholder="John Doe"
                    />
                  </motion.div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Email <span className="text-primary">*</span>
                  </label>
                  <motion.div
                    className={`relative rounded-xl transition-all duration-300 ${
                      focusedField === 'email' ? 'ring-2 ring-primary/50' : ''
                    } ${errors.email ? 'ring-2 ring-red-500/50' : ''}`}
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none transition-colors duration-200"
                      placeholder="john@example.com"
                    />
                  </motion.div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.email}
                    </motion.p>
                  )}
                  <p className="mt-1 text-[10px] text-slate-500">
                    We'll never share your email with anyone else.
                  </p>
                </motion.div>

                {/* Subject */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject <span className="text-primary">*</span>
                  </label>
                  <motion.div
                    className={`relative rounded-xl transition-all duration-300 ${
                      focusedField === 'subject' ? 'ring-2 ring-primary/50' : ''
                    } ${errors.subject ? 'ring-2 ring-red-500/50' : ''}`}
                  >
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none transition-colors duration-200"
                      placeholder="Project Collaboration"
                    />
                  </motion.div>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.subject}
                    </motion.p>
                  )}
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message <span className="text-primary">*</span>
                  </label>
                  <motion.div
                    className={`relative rounded-xl transition-all duration-300 ${
                      focusedField === 'message' ? 'ring-2 ring-primary/50' : ''
                    } ${errors.message ? 'ring-2 ring-red-500/50' : ''}`}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none transition-colors duration-200 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </motion.div>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                  >
                    <AlertCircle size={16} />
                    {submitError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-dark transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle size={18} />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center text-[10px] text-slate-500"
                >
                  <p>Your email will never be shared. Protected by Web3Forms.</p>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Social Links - 2/5 of the space */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Connect Cards */}
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all duration-300 shadow-xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-mono font-bold">
                  Connect <span className="gradient-text">Elsewhere</span>
                </h3>
              </motion.div>

              <div className="space-y-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 6, transition: { type: "spring", stiffness: 300 } }}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700 ${link.bg} transition-all duration-300 group`}
                    >
                      <motion.div
                        className={`p-2.5 rounded-xl bg-slate-800/50 ${link.bg} group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon size={22} className={link.color} />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white group-hover:text-primary transition-colors duration-300">
                          {link.label}
                        </p>
                        <p className="text-xs text-slate-400">{link.username}</p>
                      </div>
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                      >
                        <ArrowRight size={16} className="text-slate-500 group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2.5 rounded-xl bg-primary/10 border border-primary/20"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <MapPin size={20} className="text-primary" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-white">Kathmandu, Nepal</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">🇳🇵</span>
                    <span className="text-xs text-slate-400">Remote • Worldwide</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <motion.span
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-emerald-400 font-medium">Available for freelance work</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
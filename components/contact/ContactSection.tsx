// components/contact/ContactSection.tsx
// components/contact/ContactSection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, MapPin, Send } from 'lucide-react'; 
import { GithubIcon } from '@/components/ui/GithubIcon';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';

// ... rest of the code remains the same
export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is where you'd send the form data to your backend
    // For now, we'll just simulate a submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset the success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const socialLinks = [
    {
      icon: GithubIcon,
      label: 'GitHub',
      href: 'https://github.com/Rabin-Pant',
      username: '@Rabin-Pant',
    },
    {
      icon: LinkedinIcon,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rabin-pant-6b4559358',
      username: 'Rabin Pant',
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:rabinpant194@gmail.com',
      username: 'rabinpant194@gmail.com',
    },
  ];

  return (
    <section className="min-h-[calc(100vh-80px)] py-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">
              Let's <span className="gradient-text">Connect</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Reach out through the form below
              or connect with me on social platforms.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Form - Takes 3/5 of the space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-3"
            >
              <div className="bg-slate-900/30 rounded-xl p-6 md:p-8 border border-slate-800">
                <h2 className="text-2xl font-mono font-bold mb-6">
                  Send a <span className="gradient-text">Message</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors duration-200"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors duration-200"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors duration-200"
                      placeholder="Project Collaboration"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors duration-200 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>✅</span>
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Social Links - Takes 2/5 of the space */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
                <h3 className="text-lg font-mono font-bold mb-6">
                  Connect <span className="gradient-text">Elsewhere</span>
                </h3>

                <div className="space-y-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-primary transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                            {link.label}
                          </p>
                          <p className="text-xs text-slate-400">{link.username}</p>
                        </div>
                        <span className="text-slate-500 group-hover:text-primary transition-colors">→</span>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Calendly / Location */}
              <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
                <a
                  href="https://calendly.com/rabinpant194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/30 transition-all duration-200 group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                      Schedule a Call
                    </p>
                    <p className="text-xs text-slate-400">15-min free consultation</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-primary transition-colors">→</span>
                </a>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800/50">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-400">Kathmandu, Nepal 🇳🇵</span>
                  <span className="text-xs text-slate-500 ml-auto">Remote • Worldwide</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
// components/home/ContactSection.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

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
      // Web3Forms' free plan only accepts submissions made directly from the
      // browser - server-to-server calls (e.g. from a Next.js API route) are
      // rejected with a 403 unless you're on their Pro plan.
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          botcheck: formData.botcheck,
          from_name: 'Portfolio Contact Form',
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setTimeout(() => setSubmitError(null), 5000);
    }
  };

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
            Get in <span className="gradient-text">touch</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-slate-200 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Got a project or an idea you want to talk through? The form below reaches me directly.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="panel rounded-2xl p-6 md:p-8 border border-slate-800 hover:border-primary/30 transition-all duration-300 shadow-xl">
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
                <h3 className="font-display text-xl font-semibold">
                  Send a <span className="gradient-text">message</span>
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
                        Sending
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle size={18} />
                        Sent, thanks
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send message
                      </>
                    )}
                  </motion.button>
                </motion.div>

              </form>
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
};

'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

const disposableDomains = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'throwaway.com',
  'temp-mail.org', 'maildrop.cc', 'spamgourmet.com',
  'fake.com', 'mailnesia.com', 'guerrillamail.org',
  'mailinator.net', 'trash-mail.com', 'trash2009.com',
  'mytrashmail.com', 'spambox.us', 'throwawayemail.com'
];

const validateEmail = (email: string): boolean => {
  // Basic email format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  // Additional checks
  const domain = email.split('@')[1];
  if (!domain) return false;
  if (disposableDomains.some(d => domain.includes(d))) return false;

  return true;
};

const contactFields = [
  { name: 'name', label: 'Your Name', type: 'text', delay: 0.15 },
  { name: 'email', label: 'Your Email', type: 'email', delay: 0.2 },
  { name: 'subject', label: 'Subject', type: 'text', delay: 0.25 },
  { name: 'message', label: 'Message', type: 'textarea', delay: 0.3 },
] as const;

interface ContactFieldProps {
  name: (typeof contactFields)[number]['name'];
  label: string;
  type: 'text' | 'email' | 'textarea';
  delay: number;
  value: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function ContactField({ name, label, type, delay, value, error, onChange }: ContactFieldProps) {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    required: true,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? name + '-error' : undefined,
    className: 'w-full px-4 py-3 rounded-xl bg-white border border-surface-border text-foreground placeholder:text-muted focus:outline-none transition-colors duration-200',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay }} viewport={{ once: true }}>
      <label htmlFor={name} className="block text-sm font-medium text-body mb-2">
        {label} <span className="text-primary">*</span>
      </label>
      <div className={`relative rounded-xl transition-all duration-300 ${error ? 'ring-2 ring-red-500/50' : 'focus-within:ring-2 focus-within:ring-primary/50'}`}>
        {type === 'textarea' ? (
          <textarea {...inputProps} rows={4} className={inputProps.className + ' resize-none'} />
        ) : (
          <input {...inputProps} type={type} />
        )}
      </div>
      {error && (
        <motion.p id={name + '-error'} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-700 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
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
            Get in <span className="accent-text">touch</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-body max-w-2xl mx-auto text-sm md:text-base"
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
            <div className="panel rounded-2xl p-6 md:p-8 border border-surface-border hover:border-primary/30 transition-all duration-300 shadow-xl">
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
                  Send a <span className="accent-text">message</span>
                </h3>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot Field - Hidden from users */}
                <div className="hidden">
                  <input
                    type="text"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={handleChange}
                    placeholder="Leave this field empty"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>

                {contactFields.map((field) => (
                  <ContactField
                    key={field.name}
                    {...field}
                    value={formData[field.name]}
                    error={errors[field.name]}
                    onChange={handleChange}
                  />
                ))}

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm flex items-center gap-2"
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
                    className="w-full px-6 py-3.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

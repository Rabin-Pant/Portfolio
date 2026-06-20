// components/about/ProcessSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Layers, Code, Cloud, Rocket } from 'lucide-react';

export const ProcessSection = () => {
  const steps = [
    {
      icon: Layers,
      title: '1. System Design',
      description: 'I start with architecture diagrams, database schemas, and API contracts before writing code. This ensures scalability from day one.',
    },
    {
      icon: Code,
      title: '2. Clean Code',
      description: 'Following SOLID principles and design patterns, I write maintainable, testable code that other developers can understand and extend.',
    },
    {
      icon: Cloud,
      title: '3. Cloud Deployment',
      description: 'I deploy applications using modern cloud platforms (AWS, Vercel, Render) with CI/CD pipelines for seamless updates.',
    },
    {
      icon: Rocket,
      title: '4. Performance & Scale',
      description: 'I optimize for speed, implement caching strategies, and design for horizontal scaling to handle growth.',
    },
  ];

  return (
    <section className="py-20 border-y border-slate-800/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-mono font-bold">
            My <span className="gradient-text">Process</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            How I approach every project, from concept to deployment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-slate-900/30 rounded-xl p-6 border border-slate-800 hover:border-primary transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
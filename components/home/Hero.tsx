// components/home/Hero.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          {/* No order override: on mobile this should read message-first,
              photo-second — a portrait photo at near-full mobile width was
              previously ordered ahead of it (order-1) and, at aspect-[4/5],
              stood ~540px tall on a ~660px-tall viewport, pushing the actual
              headline almost entirely below the fold. Natural DOM order
              already puts text in the left column on desktop's 2-col grid,
              so no override is needed there either. */}
          <div>
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-balance"
            >
              I'm good at turning<br />
              <span className="gradient-text">messy data into working systems.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 md:mt-6 text-base md:text-lg text-slate-200 max-w-lg leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            >
              I'm a developer based in Kathmandu. Most of my time goes into the
              thinking before the coding: how the data should be structured, how
              the pieces should fit together, what's likely to break later. The
              actual building tends to be the easy part once that's sorted.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-200 font-medium text-sm md:text-base shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                See my work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg border border-slate-700 hover:border-primary hover:bg-primary/10 transition-all duration-200 font-medium text-sm md:text-base"
              >
                <FileText size={16} />
                Download résumé
              </a>
            </motion.div>
          </div>

          {/* Right: Profile Photo */}
          {/* Opacity only — an animated scale on a real photo forces the GPU
              to resample the whole texture every frame. Confirmed expensive
              via CDP trace elsewhere on this site (59% of a full-viewport
              photo transition's cost); this image is smaller but the same
              mechanism applies. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            {/* Capped smaller on phones: at near-full mobile width, this
                portrait-ratio card was ~540px tall on a ~660px viewport. */}
            <div className="relative w-full max-w-55 sm:max-w-sm">
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#10160d] shadow-2xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/images/rabin.jpeg"
                    alt="Rabin Pant"
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 24vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-transparent to-transparent" />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <div className="font-display text-lg font-semibold text-white">Rabin Pant</div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-500">
                      Full-Stack Developer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

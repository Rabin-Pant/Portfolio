import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, MapPin } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';
import { profileLinks } from '@/lib/profile';

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          {/* Keep the text before the portrait on mobile. */}
          <div>
            {/* Main Heading */}
            <h1
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-balance"
            >
              I&apos;m good at turning<br />
              <span className="accent-text">messy data into working systems.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="mt-4 md:mt-6 text-base md:text-lg text-body max-w-lg leading-relaxed"
            >
              I&apos;m a developer based in Kathmandu. Most of my time goes into the
              thinking before the coding: how the data should be structured, how
              the pieces should fit together, what&apos;s likely to break later. The
              actual building tends to be the easy part once that&apos;s sorted.
            </p>

            {/* CTA Buttons */}
            <div
              className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Link
                href="#projects"
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-200 font-medium text-sm md:text-base shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                See my work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={profileLinks.resume}
                download
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg border border-surface-border hover:border-primary hover:bg-primary/10 transition-all duration-200 font-medium text-sm md:text-base"
              >
                <FileText size={16} />
                Download Resume
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 md:mt-6">
              <a
                href={profileLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-body transition-colors duration-200 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span aria-hidden="true"><LinkedinIcon size={20} /></span>
              </a>
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={16} aria-hidden="true" />
                Kathmandu, Nepal
              </span>
            </div>
          </div>

          {/* Right: hero portrait */}
          {/* Keep the portrait and text visible in the initial HTML. */}
          <div
            className="flex justify-center"
          >
            <div
              className="relative aspect-[4/5] w-full max-w-55 translate-x-4 overflow-hidden sm:max-w-sm lg:translate-x-12"
              style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
            >
              <Image
                src="/images/hero section (rabin).jpeg"
                alt="Rabin Pant"
                fill
                sizes="(max-width: 640px) 220px, 384px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

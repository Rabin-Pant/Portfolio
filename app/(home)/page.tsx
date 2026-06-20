// app/(home)/page.tsx
'use client';

import { Hero } from '@/components/home/Hero';
import { Interests } from '@/components/home/Interests';
import { AboutSection } from '@/components/home/AboutSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="interests">
        <Interests />
      </section>
      <section id="skills">
        <SkillsSection />
      </section>
      <section id="projects">
        <FeaturedProjects />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <Footer />
    </main>
  );
}
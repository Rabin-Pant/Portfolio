// app/(home)/page.tsx
import { Hero } from '@/components/home/Hero';
import { Interests } from '@/components/home/Interests';
import { AboutSection } from '@/components/home/AboutSection';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { CertificationsSection } from '@/components/home/CertificationsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
  return (
    <div className="journey-home">
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="experience">
        <ExperienceSection />
      </section>
      <section id="interests">
        <Interests />
      </section>
      <section id="skills">
        <SkillsSection />
      </section>
      <section id="certifications">
        <CertificationsSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <Footer />
    </div>
  );
}

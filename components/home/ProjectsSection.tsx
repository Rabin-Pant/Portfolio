import Image from 'next/image';
import { ArrowUpRight, Check } from 'lucide-react';
import { GithubIcon } from '@/components/ui/GithubIcon';
import { projects } from '@/lib/projects';

export function ProjectsSection() {
  return (
    <div className="project-stories py-20 md:py-28">
      <div className="container-custom">
        <header className="project-stories-header">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold">The <span className="gradient-text">projects</span></h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-slate-300 leading-relaxed">
            {projects.length} projects, from the problem that started each one to how I built it.
          </p>
        </header>

        <div className="project-stories-list">
          {projects.map((project, index) => (
            <article key={project.slug} id={`project-${project.slug}`} className="project-story" aria-labelledby={`title-${project.slug}`}>
              <div className="project-story-heading">
                <span className="project-story-number">{String(index + 1).padStart(2, '0')} <span>/ {String(projects.length).padStart(2, '0')}</span></span>
                <span className="project-story-year">Built in {project.year}</span>
              </div>
              <div className="project-story-grid">
                <div>
                  <h3 id={`title-${project.slug}`} className="font-display text-3xl md:text-4xl font-semibold text-white">{project.title}</h3>
                  <p className="project-story-tagline">{project.tagline}</p>
                  <p className="project-story-description">{project.description}</p>
                  <ul className="project-story-stack" aria-label={`${project.title} technologies`}>
                    {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                  <div className="project-story-links">
                    {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={16} aria-hidden="true" /> Source on GitHub<span className="sr-only"> for {project.title} (opens in a new tab)</span><ArrowUpRight size={14} aria-hidden="true" /></a>}
                    {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer">Live demo<span className="sr-only"> of {project.title} (opens in a new tab)</span><ArrowUpRight size={14} aria-hidden="true" /></a>}
                  </div>
                  <div className="project-story-image">
                    <Image src={project.image} alt={`${project.title} application interface`} width={1280} height={800} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 80vw, 48vw" className="w-full h-auto" />
                  </div>
                </div>
                <div className="project-story-notes panel">
                  <div>
                    <h4 className="section-kicker">The problem</h4>
                    <p>{project.problem}</p>
                  </div>
                  <div>
                    <h4 className="section-kicker">How I built it</h4>
                    <p>{project.solution}</p>
                  </div>
                  <div>
                    <h4 className="section-kicker">What it does</h4>
                    <ul className="project-story-results">
                      {project.results.map((result) => <li key={result}><Check size={15} aria-hidden="true" /><span>{result}</span></li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

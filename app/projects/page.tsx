// app/projects/page.tsx
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectsPageHeader, ProjectsBottomCTA } from '@/components/projects/ProjectsPageChrome';

export default function ProjectsPage() {
  return (
    <main className="py-20">
      <div className="container-custom">
        <ProjectsPageHeader count={projects.length} />

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <ProjectsBottomCTA />
      </div>
    </main>
  );
}

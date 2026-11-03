import { notFound } from 'next/navigation';
import { getProjectBySlug, projects } from '@/lib/projects';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-20">
      <ProjectDetail project={project} />
    </div>
  );
}

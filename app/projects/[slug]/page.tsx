// app/projects/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/projects';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { projects } = await import('@/lib/projects');
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
    <main className="py-20">
      <ProjectDetail project={project} />
    </main>
  );
}
import { projects } from './projects';

const JOURNEY_STOPS = [
  { id: 'hero' },
  { id: 'about' },
  { id: 'experience' },
  { id: 'interests' },
  { id: 'skills' },
  { id: 'certifications' },
  { id: 'projects' },
  { id: 'contact' },
] as const;

export const CROWN_PROGRESS = JOURNEY_STOPS.length - 1 + projects.length;

// Each project visits a different wing of the palace. Contact is the final stop.
export const JOURNEY_WAYPOINTS = JOURNEY_STOPS.flatMap((stop, index) => {
  if (stop.id === 'projects') {
    return [
      { id: stop.id, progress: index },
      ...projects.map((project, projectIndex) => ({
        id: `project-${project.slug}`, progress: index + projectIndex + 1,
      })),
    ];
  }
  return [{ id: stop.id, progress: index + (stop.id === 'contact' ? projects.length : 0) }];
});

export type JourneyScene = {
  setProgress: (progress: number) => void;
  dispose: () => void;
};


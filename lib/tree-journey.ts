import { projects } from './projects';

const JOURNEY_STOPS = [
  { id: 'hero' },
  { id: 'about' },
  { id: 'experience' },
  { id: 'interests' },
  { id: 'skills' },
  { id: 'certifications' },
  { id: 'projects' },
  { id: 'palace-approach', projectTailFraction: 0.32 },
  { id: 'palace-bridge', projectTailFraction: 0.56 },
  { id: 'palace-entrance', projectTailFraction: 0.74 },
  { id: 'palace-gallery', projectTailFraction: 0.86 },
  { id: 'palace-sanctuary', projectTailFraction: 0.94 },
  { id: 'contact' },
] as const;

export const CROWN_PROGRESS = JOURNEY_STOPS.length - 1 + projects.length;
export const FINAL_PROJECT_ID = projects.length ? `project-${projects[projects.length - 1].slug}` : 'projects';

type JourneyWaypoint = { id: string; progress: number; projectTailFraction?: number };

// Palace stops use positions within the final project, without adding DOM spacers.
export const JOURNEY_WAYPOINTS = JOURNEY_STOPS.flatMap<JourneyWaypoint>((stop, index) => {
  if (stop.id === 'projects') {
    return [
      { id: stop.id, progress: index },
      ...projects.map((project, projectIndex) => ({
        id: `project-${project.slug}`, progress: index + projectIndex + 1,
      })),
    ];
  }
  return [{
    id: stop.id,
    progress: index + (index > 6 ? projects.length : 0),
    ...('projectTailFraction' in stop ? { projectTailFraction: stop.projectTailFraction } : {}),
  }];
});

export const PALACE_ENTRANCE_PROGRESS = JOURNEY_WAYPOINTS.find(stop => stop.id === 'palace-entrance')!.progress;
export const PALACE_INTERIOR_PROGRESS = JOURNEY_WAYPOINTS.find(stop => stop.id === 'palace-gallery')!.progress;

export type JourneyScene = {
  setProgress: (progress: number) => void;
  dispose: () => void;
};

